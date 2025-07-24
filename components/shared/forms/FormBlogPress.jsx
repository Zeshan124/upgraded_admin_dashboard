import { useState, useEffect } from "react";
import Editor from "~/components/shared/UI/Editor";
import { WebAddPage, UpdateWebPage } from "~/services/PagesServices";
import useMessageHandler from "~/components/hooks/useMessageHandler";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import { Spin, Upload, Select, Radio, Input } from "antd";
import { useForm, Controller } from "react-hook-form";

import { getImageURL } from "~/util";
import { useRouter } from "next/router";
import { AddPressBlog, UpdatePressBlog } from "~/services/pressBlogServive";

const initialData = {
  title: "",
  blog: 1,
  shortDescription: "",
  url: "",
};

const FormBlogPress = ({ updateData=null }) => {
  const [detailedDescription, setDetailedDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const router = useRouter();

  const { showSuccess, showError, contextHolder } = useMessageHandler();

  const { watch, control, handleSubmit, setValue } = useForm({
    defaultValues: initialData,
  });
  const blog = watch("blog");
  useEffect(() => {
    setEditorLoaded(true);
  }, []);
  useEffect(() => {
    if (updateData) {
      
      setValue('title', updateData.title);
      setValue('blog', updateData.blog);
      setValue('shortDescription', updateData.shortDescription);
      setValue('url', updateData.url);

      const image = updateData?.image && {
        uid: updateData.id,
        name: updateData.image,
        status: 'done',
        url: getImageURL(updateData.image),
      }
      setValue('image', { fileList: [image] });
      setDetailedDescription(updateData.detailedDescription);

    }
  }, [updateData, setValue]);
  const validateForm = (data) => {
    if (!data.title)
      return showError("Title missing! Every epic needs a title, right?");

    if (!detailedDescription.trim() && blog) {
      return showError(
        "Oops! Looks like you forgot to add a description. Don’t be shy!"
      );
    }
    if (!data?.url?.trim() && !blog) {
      return showError(
        "No URL? How will people find your press release? Don't leave it lost in the web!"
      );
    }

    // Validate short description
    if (!data.shortDescription.trim()) {
      return showError("Short description? It's a must! Give us a sneak peek.");
    }
    if (
      !data.image ||
      !data.image.fileList ||
      data.image.fileList.length === 0
    ) {
      return showError(
        "No image? Come on, a picture speaks louder than words!"
      );
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
      formData.append("detailedDescription", blog ? detailedDescription : "");
      formData.append("url", !blog ? data.url : "");
      formData.append("shortDescription", data?.shortDescription);
      formData.append("blog", blog);
      
      data?.image &&
        data?.image?.fileList &&
        data?.image?.fileList?.forEach((file) => {
          if (file.url) {
            formData.append("image", file?.url); // Send the URL of the existing images
          } else {
            formData.append("image", file?.originFileObj); // Send the newly uploaded files
          }
        });
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      let response;
     
      if (updateData) {
        formData.append("id", updateData?.id);
        response = await UpdatePressBlog(formData);
      }else{
        response = await AddPressBlog(formData);
      }
      // console.log(response);
      if (response.data.message && response.status === 200) {
        showSuccess(response.data.message || "Added");
        router.push("/blog-and-press");
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
          {updateData? 'Update': 'Create'} {!blog ? " Press" : " Blog"}
        </figcaption>
        <form
          onSubmit={handleSubmit(submitFormHandler)}
          className="ps-form ps-form--new px-2"
        >
          <div className="form-group">
            <label>
              Select Type (Press or Blog:)<sup>*</sup>
            </label>
            <Controller
              name="blog"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Blog"
                  size="large"
                  className="w-100"
                  options={[
                    {
                      value: 1,
                      label: "Blog",
                    },
                    {
                      value: 0,
                      label: "Press",
                    },
                  ]}
                />
              )}
            />
          </div>
          {!blog ? (
            <div className="form-group">
              <label>
                Url<sup>*</sup>
              </label>
              <input
                className="form-control"
                type="text"
                placeholder="Url (of Press to redirect)"
                {...control.register("url", { required: true })}
              />
            </div>
          ) : (
            ""
          )}
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
              Short Description:<sup>*</sup>
            </label>
            <div className="w-100 mw-100">
              <textarea
                className="form-control"
                type="text"
                placeholder="Short description for cards"
                {...control.register("shortDescription", { required: true })}
              />
            </div>
          </div>

          <div className={`${!blog && "d-none"} form-group w-100 mw-100`}>
            <label>
              Detailed Description:<sup>*</sup>
            </label>
            <div className="w-100 mw-100">
              <Editor
                name="detailedDescription"
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDetailedDescription(data);
                }}
                value={detailedDescription}
                editorLoaded={editorLoaded}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Image:<sup>*</sup>
            </label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <>
                  <Upload
                    {...field}
                    fileList={field.value && field.value?.fileList}
                    //   action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    maxCount={1}
                  >
                    {field.value?.fileList?.length >= 1 ? null : "Upload"}
                  </Upload>
                </>
              )}
            />
          </div>

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

export default FormBlogPress;
