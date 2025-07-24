import { useState, useEffect } from "react";
import Editor from "~/components/shared/UI/Editor";
import { WebAddPage, UpdateWebPage } from "~/api/PagesServices";
import useMessageHandler from "~/components/hooks/useMessageHandler";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import { Spin, Upload, Select, Radio, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import useCategories from "~/components/hooks/useCategories";
import useCategoryandSub from "~/components/hooks/useCategoryandSub";
import { getImageURL } from "~/util";
import { useRouter } from "next/router";

const initialData = {
  title: "",
  allPro: 0,
  catSlug: "",
  subCatSlug: "",
  minPrice: 0,
  maxPrice: 0,
};

const FormWebPage = ({ pageData = null }) => {
  const [value, setDescription] = useState("");
  const [valueUrdu, setValueUrdu] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const router = useRouter();

  const { showSuccess, showError, contextHolder } = useMessageHandler();
  const { categoryData } = useCategories();
  const { CategorySubcategory } = useCategoryandSub();
  const { watch, control, handleSubmit, setValue } = useForm({
    defaultValues: initialData,
  });

  const selectedCategory = watch("catSlug");
  const selectedAllPro = watch("allPro");
  const filteredSubCategories = CategorySubcategory?.filter(
    (subCategory) => subCategory.slug === selectedCategory
  );

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    if (pageData) {
      if (pageData.allPro === 0) {
        setValue("allPro", pageData.allPro);
      } else {
        if (pageData.catSlug) setValue("allPro", 2);
        if (pageData.catSlug && pageData.subCatSlug) setValue("allPro", 3);
        if (!pageData.catSlug && !pageData.subCatSlug)
          setValue("allPro", pageData.allPro);
      }

      setValue("title", pageData.title);
      setValue("catSlug", pageData.catSlug);
      setValue("subCatSlug", pageData.subCatSlug);
      setValue("minPrice", pageData.minPrice);
      setValue("maxPrice", pageData.maxPrice);
      const images =
        pageData?.pageImages &&
        pageData?.pageImages?.map((image) => ({
          uid: image.pageImageID,
          name: image.imagePath,
          status: "done",
          url: getImageURL(image.imagePath),
        }));
      setValue("pageImages", { fileList: images });
      setDescription(pageData.contentEnglish);
      setValueUrdu(pageData.contentUrdu);
    }
  }, [pageData, setValue]);

  const validateForm = (data) => {
    if (!value.trim())
      return showError(
        "Oops! Looks like you forgot to add a description. Don’t be shy!"
      );
    if (!data.title)
      return showError("Title missing! Every epic needs a title, right?");
    if (data.allPro !== 0) {
      if (data.allPro === 2 && !data.catSlug)
        return showError("Category is a must! Don’t leave it hanging.");
      if (data.allPro === 3 && (!data.catSlug || !data.subCatSlug))
        return showError(
          "Pick a category and a subcategory. It’s not that hard!"
        );
      if (!data.minPrice || !data.maxPrice)
        return showError("Price range please! Every thing have a limit");
      if (data.minPrice > data.maxPrice)
        return showError("When did min become greater than max? Genius!");
    }
    return true;
  };

  const submitFormHandler = async (data) => {
    setIsLoading(true);
    if (!validateForm(data)) {
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("contentEnglish", value);
      if (valueUrdu) formData.append("contentUrdu", valueUrdu);
      if (data?.minPrice) formData.append("minPrice", data?.minPrice);
      if (data?.maxPrice) formData.append("maxPrice", data?.maxPrice);
      if (data?.catSlug) formData.append("catSlug", data?.catSlug);
      if (data?.subCatSlug) formData.append("subCatSlug", data?.subCatSlug);
      const booleanValue =
        data?.allPro === 2 || data?.allPro === 3 ? 1 : data?.allPro;
      formData.append("allPro", booleanValue);
      // if (data.pageImages.fileList){

      // }

      data?.pageImages &&
        data?.pageImages?.fileList &&
        data?.pageImages?.fileList?.forEach((file) => {
          if (file.url) {
            formData.append("pageImages", file?.url); // Send the URL of the existing images
          } else {
            formData.append("pageImages", file?.originFileObj); // Send the newly uploaded files
          }
        });
      // for (const [key, value] of formData.entries()) {
      //     console.log(`${key}:`,  (value));
      // }
      let response;
      if (pageData) {
        formData.append("id", pageData.customPageID);
        response = await UpdateWebPage(formData);
      } else {
        response = await WebAddPage(formData);
      }

      if (response.data.message && response.status === 200) {
        showSuccess(response.data.message || "Page is Added");
        router.push("/custom-pages/web-pages/");
      } else {
        throw new Error(
          response?.data?.message ||
            response?.message ||
            "Failed to complete operation"
        );
      }
    } catch (error) {
      showError("Error during operation");
      console.error("Error Posting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      {contextHolder}
      <figure className="ps-block--form-box">
        <figcaption className="text-white text-center mb-4">
          Create Page
        </figcaption>
        <form
          onSubmit={handleSubmit(submitFormHandler)}
          className="ps-form ps-form--new px-2"
        >
          <div className="form-group">
            <label>
              Title<sup>*</sup>
            </label>
            <input
              className="form-control"
              type="text"
              placeholder="Title (heading on top of page)"
              {...control.register("title", { required: true })}
            />
          </div>

          <div className="form-group w-100 mw-100">
            <label>
              Write English Content:<sup>*</sup>
            </label>
            <div className="w-100 mw-100">
              <Editor
                name="pages"
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
                value={value}
                editorLoaded={editorLoaded}
              />
            </div>
          </div>

          <div className="form-group w-100 mw-100">
            <label>Write Urdu Content:</label>
            <div className="w-100 mw-100">
              <Editor
                name="pages"
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setValueUrdu(data);
                }}
                value={valueUrdu}
                editorLoaded={editorLoaded}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Images</label>
            <Controller
              name="pageImages"
              control={control}
              render={({ field }) => (
                <>
                  <Upload
                    {...field}
                    fileList={field.value && field.value?.fileList}
                    //   action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    maxCount={3}
                  >
                    {field.value?.fileList?.length >= 3 ? null : "Upload"}
                  </Upload>
                </>
              )}
            />
          </div>

          <div className="form-group">
            <label>
              Include Products<sup>*</sup>
            </label>
            <Controller
              name="allPro"
              control={control}
              render={({ field }) => (
                <Radio.Group {...field}>
                  <Radio value={0}>None</Radio>
                  <Radio value={1}>All Products</Radio>
                  <Radio value={2}>Category</Radio>
                  <Radio value={3}>Sub Category</Radio>
                </Radio.Group>
              )}
            />
          </div>

          {selectedAllPro === 2 && (
            <div className="form-group">
              <label>Category</label>
              <Controller
                name="catSlug"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select Category"
                    size="large"
                    className="w-100"
                    options={categoryData?.map((item) => ({
                      value: item.slug,
                      label: item.name,
                    }))}
                  />
                )}
              />
            </div>
          )}

          {selectedAllPro === 3 && (
            <>
              <div className="form-group">
                <label>Category</label>
                <Controller
                  name="catSlug"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Category"
                      size="large"
                      className="w-100"
                      options={CategorySubcategory?.map((item) => ({
                        value: item.slug,
                        label: item.CategoryName,
                      }))}
                    />
                  )}
                />
              </div>
              <div className="form-group">
                <label>Sub Category</label>
                <Controller
                  name="subCatSlug"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="large"
                      className="w-100"
                      placeholder="Select Sub Category"
                      disabled={!selectedCategory}
                      options={
                        filteredSubCategories?.[0]?.subcategory?.map(
                          (item) => ({
                            value: item.slug,
                            label: item.subcategoryName,
                          })
                        ) || []
                      }
                    />
                  )}
                />
              </div>
            </>
          )}

          {selectedAllPro !== 0 && (
            <div className="d-flex">
              <div className="form-group mr-2">
                <label>Min Price</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ height: "40px" }}
                  placeholder="Min Price"
                  {...control.register("minPrice", { required: true })}
                />
              </div>
              <div className="form-group">
                <label>Max Price</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ height: "40px" }}
                  placeholder="Max Price"
                  {...control.register("maxPrice", { required: true })}
                />
              </div>
            </div>
          )}
          <div className="ps-form__bottom">
            <div
              className="ps-btn ps-btn--black"
              onClick={() => router.push("/custom-pages/web-pages")}
            >
              Back
            </div>
            <button className="ps-btn" type="submit" disabled={isLoading}>
              Submit {isLoading && <Spin />}
            </button>
          </div>
        </form>
      </figure>
    </ErrorBoundary>
  );
};

export default FormWebPage;
