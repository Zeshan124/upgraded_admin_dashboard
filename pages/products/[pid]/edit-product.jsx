import React, { useEffect, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";

import { useRouter } from 'next/router';

import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";

import { Select, Spin } from 'antd';
import { Collapse, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

import ContainerDefault from "~/components/layouts/ContainerDefault";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";

import useSWR from "swr";
import { getProductById, updateProduct } from "~/api/productService";
import { fetchAllCategories } from "~/api/categoryService";
import { fetchAllSubCategories } from "~/api/subCategoryService";
import useCategories from "~/components/hooks/useCategories";
import useSubCategories from "~/components/hooks/useSubCategories";
import useProducts from "~/components/hooks/useProducts";
import Editor from "~/components/shared/UI/Editor";
import { getImageURL } from "~/util";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import LoadingSpinner from "~/components/shared/UI/LoadingSpinner";
import { SapItemLookup } from "~/api/OMSService";
import SearchItemCode from "~/components/partials/products/SearchItemCode";


const EditProductPage = () => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { categoryData, categoryError, categoryLoading } = useCategories();
  const { subCategoryData, subCategoryError, subCategoryLoading } = useSubCategories();
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const {pid} = router?.query;
  const url = `/products/${pid}`;
  const [product, setProduct] = useState(null);
  // const [error, setError] = useState(null);
  const [isFormSubmiting, setIsFormSubmiting] = useState(false);
  const { data: productItems, error, isLoading } = useSWR(pid ? url : null,
    pid ? () => getProductById(pid) : null,
    {
      revalidateIfState: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true
    });

  const { register, handleSubmit, watch, control, reset, setValue, formState: { errors }, } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'installmentPlans' });

  useEffect(() => {

    if (!router.isReady) return;
    if (productItems && productItems.length) {
      const productData = productItems[0];

        setValue('title', productData?.title);
        setValue('status', productData?.status);
        setValue('shortDescription', productData?.shortDescription);
        setValue('detailedDescription', productData?.detailedDescription);
        setValue('itemCode', productData?.itemCode);
        setValue('deleteStatus', productData?.deleteStatus);
        productData?.tags?.trim() !== "" ? setValue('tags', productData?.tags?.split(",")) : setValue('tags', []);
        if (productData?.installmentPlan && productData?.installmentPlan?.length > 0) {
          const plans = productData.installmentPlan.map((plan, index) => ({
            id: index,
            advanceAmount: plan?.advanceAmount,
            noOfMonths: plan?.noOfMonths,
            amountPerMonth: plan?.amountPerMonth
          }));
          setValue('installmentPlans', plans);
        }
        const transformedCategories = productData?.categories?.map(category => (category?.categoryID));
        const transformedSubcategories = productData?.subcategories?.map(subcategory => (subcategory?.subCategoryID));
   
        transformedSubcategories&& setValue('subcategoryIDs', transformedSubcategories);
        setValue('categoryID', transformedCategories);

        const productImages = productData?.galleryimages && productData?.galleryimages?.map((image) => ({
          uid: image.imageID,
          name: (image.imagePath),
          status: 'done',
          url: getImageURL(image.imagePath),
        }));

        const thumbnail = productData?.productImage ? [
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: getImageURL(productData?.productImage),
          },] : []


        setValue('productImage', { fileList: thumbnail });
        setValue('galleryImages', { fileList: productImages });
        setEditorLoaded(true);
      }
      // setIsLoading(false);
  }, [productItems]);


  useEffect(()=>{
    dispatch(toggleDrawerMenu(false));
  },[])
  //-------------------------------------------------------------------

  useEffect(() => {
    const selectedCategories = watch('categoryID');

    if (selectedCategories && subCategoryData) {
      if (subCategoryData.length > 0) {
        const filteredSubs = subCategoryData.filter(subCat => (selectedCategories?.includes(subCat?.categoryID))
        );
        setFilteredSubCategories(filteredSubs);
      }
    }
  }, [watch('categoryID'), subCategoryData]);


  const uploadImageButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const onSubmit = async (data) => {
    setIsFormSubmiting(true);
    const { productImage, deleteStatus, galleryImages, title, itemCode, detailedDescription, shortDescription, categoryID, status, tags, installmentPlans, subcategoryIDs,
    } = data;

    const formData = new FormData();

    try {
      if (productImage?.fileList[0]?.originFileObj) {
        formData.append("productImage", productImage.fileList[0].originFileObj)
      }

      const imagesIDs = productItems[0]?.galleryimages && productItems[0].galleryimages?.map((image) => (
        image.imageID
      ))
      let count = 0;

      galleryImages?.fileList && (galleryImages?.fileList.map((image, index) => {
        if (image.originFileObj) {
          formData.append(`galleryImages`, image.originFileObj); //Added new or updated
          count = count + 1;
        } else {
          const indexToRemove = imagesIDs.indexOf(image.uid);
          if (indexToRemove !== -1) {
            imagesIDs.splice(indexToRemove, 1);// these image ids remain unchanged //Not updated
          }
        }
      }));


      galleryImages?.fileList && imagesIDs?.forEach((imageID, index) => {
        if (index < count) {
          formData.append(`updatedImageIDs[${index}]`, imageID); // Updated image IDs
        } else {
          formData.append(`imageToRemove[${index - count}]`, imageID); // Removed image IDs
        }
      });
      //check if count is greater than imagesIDs.length then amount of greater is  new image added 
      // all images ids are updatedImageIDS
      //else if count less then imageIDs.length then amount of less than is  removed images.
      // all images ids are updatedImageIDS
      //amount of less than  ids should be imageToRemove
      // remaining are updatedImageIDS
      //and if they are equal then all of them is updated
      // and both are 0 then no images is updated or added

      formData.append("productID", productItems[0].productID)
      formData.append("title", title);
      formData.append("itemCode", itemCode);
      formData.append("detailedDescription", detailedDescription);
      formData.append("shortDescription", shortDescription);
      categoryID && formData.append("categoryID", JSON.stringify(categoryID));
      // formData.append("deleteStatus", 0);
      formData.append("status", status);
      tags && formData.append("tags", tags.join(","));
      formData.append("feature", 0);
      // formData.append('modifiedBy', 11)
      formData.append("deleteStatus", deleteStatus);
      subcategoryIDs  && formData.append("subcategoryIDs", JSON.stringify(subcategoryIDs));

      installmentPlans.forEach((plan, index) => {
        formData.append(`installmentPlan[${index}]`, JSON.stringify(plan));
      });

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const response = await updateProduct(formData);

      if (response.status === 200) {
        alert(response.data.message|| response.message || "Item Updated SuccessFully")
        router.push('/products');
      }else{
        alert(response.data.message || "Error Updating")
      }
    } catch (error) {

      alert(error.message || "ERROR!!!!!!!!!")
    }finally{
      setIsFormSubmiting(false);
    }

  };
  const AccordionOnChange = (key) => {
  
  };
  if (isLoading || !productItems) return (<LoadingSpinner/>)
  if(error) return <div>{error.message || error || "Error"}</div>
  return (
    <ContainerDefault title="Edit Product">
      <HeaderDashboard
        title="Edit Product"
        description="Qistbazaar Edit Product "
      />
      <ErrorBoundary>
        <section className="ps-new-item">
          <form onSubmit={handleSubmit(onSubmit)} className="ps-form ps-form--new-product" action="" method="get" >
            <div className="ps-form__content">

              <div className="row">

                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                  {/* Left Side Here */}
                  <figure className="ps-block--form-box">
                    <figcaption className="text-white">General</figcaption>
                    <div className="ps-block__content">

                      {/* Product Title */}
                      <div className="form-group">
                        <label> Product Title<sup>*</sup> </label>
                        <input {...register("title", { required: true })} className="form-control" type="text" placeholder="Enter product name..." />
                        {errors.title && <span>This field is required</span>}
                      </div>
                      {/* Stock */}
                      <div className="form-group">
                        <label htmlFor="x">Stock Status<sup>*</sup></label>
                        <select  {...register('status', { required: true })} id="inputState" className="form-control">
                          {/* <option value="choose" disabled hidden>Choose Status...</option> */}
                          <option value="1">In Stock</option>
                          <option value="0">Out of Stock</option>
                        </select>
                        {errors.status && <span>This field is required</span>}
                      </div>

                      {/* DeleteStatus */}
                      <div className="form-group">
                        <label htmlFor="x">Delete Status<sup>*</sup></label>
                        <select  {...register('deleteStatus', { required: true })} id="inputState" className="form-control">
                          {/* <option value="choose" disabled hidden>Choose Status...</option> */}
                          <option value="1">Draft</option>
                          <option value="0">Published</option>
                        </select>
                        {errors.deleteStatus && <span>This field is required</span>}
                      </div>

                      {/* {Category} */}
                      <div className="form-group " >
                        <label htmlFor="x">Category<sup>*</sup></label>
                        <Controller
                          name="categoryID"
                          control={control}

                          render={({ field }) => (
                            <>
                              <Select

                                {...field} mode="multiple"
                                placeholder="click to select categories" size="large" className="w-100"
                                onChange={(value) => field.onChange(value)}

                                options={categoryData?.map((item) => ({
                                  value: item?.categoryID,
                                  label: item?.name,
                                  id: item?.categoryID,
                                }))}
                              />
                            </>
                          )}
                        />
                        {errors.category && <span>This field is required</span>}
                      </div>

                      {/* Sub Category */}
                      <div className="form-group " >
                        <label htmlFor="x">Sub Category<sup>*</sup></label>
                        <Controller
                          name="subcategoryIDs"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              mode="multiple"
                              placeholder="click to select sub-categories"
                              size="large"
                              className="w-100"
                              onChange={(value) => field.onChange(value)}
                              options={filteredSubCategories?.map((item) => ({
                                value: item?.subCategoryID,
                                label: item?.name,
                                id: item?.subCategoryID,
                              }))}
                            />
                          )}
                        />
                        {errors?.subcategoryIDs && <span>This field is required</span>}
                      </div>

                      {/* Product Description */}
                      {/* Product Short Description */}
                      <div className="form-group">
                        <label>
                          Tags<sup>*</sup>
                        </label>
                        <Controller
                          name="tags"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              mode="tags"
                              placeholder="write and enter to add new Tags"
                              size="large"
                              className="w-100"
                              onChange={(value) => field.onChange(value)}

                            />
                          )}
                        />
                        {errors.tags && <span>This field is required</span>}

                      </div>
                  

                      <div className="form-group">
                        <label> Product Item Code<sup>*</sup> </label>
                        <SearchItemCode onSelect={(selectedItem) => setValue("itemCode", selectedItem)} />
                        <input {...register("itemCode", { required: true })} className="form-control" type="text" placeholder="Enter  Product Item Code..." />
                        {errors.itemCode && <span>This field is required</span>}
                      </div>  
                      {/* Product Short Description */}
                      <div className="form-group">
                        <label>
                          Product Short Description<sup>*</sup>
                        </label>
                        <textarea
                          {...register("shortDescription", { required: true })}
                          className="form-control"
                          rows="2"
                          name="shortDescription"
                        ></textarea>
                        {errors.shortDescription && <span>This field is required</span>}
                      </div>


                      {/* {Product Detailed Descriptio } */}
                      <div className="form-group">
                        <label>
                          Product Detailed Description<sup>*</sup>
                        </label>

                        <div className="">
                          <Controller
                            name="detailedDescription"
                            control={control}
                            render={({ field }) => (
                              <Editor
                                name="detailedDescription"
                                onChange={(event, editor) => {
                                  const data = editor.getData();
                                  setValue('detailedDescription', data); // Set the value to the form field
                                }}
                                value={field.value}
                                editorLoaded={editorLoaded}
                              />
                            )}
                          />
                        </div>
                        {errors.detailedDescription && <span>This field is required</span>}
                      </div>

                    </div>
                  </figure>
                </div>
                {/* Right Side Here */}
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                  {/* Installemment Plan Form */}
                  <figure className="ps-block--form-box">
                    <figcaption className="text-white">Product Installment Plan</figcaption>
                    <div className="ps-block__content">

                      {/* Installment Plans */}
                      <div className="form-group">

                        <button type="button" className="btn mb-2 btn-secondary d-block ml-auto" onClick={() => append({ advAmount: '', noOfMonths: '', amountPerMonth: '' })}>
                          Add New Plan
                        </button>
                        <Collapse defaultActiveKey={1} onChange={AccordionOnChange}>
                          {fields.map((field, index) => (
                            <Panel key={field.id} header={
                              <div className="d-flex justify-content-between align-items-start p-0 m-0 pt-1">
                                <span style={{ flex: '0 0 auto' }}>{`Plan ${index + 1}`}</span>
                                {fields.length > 1 && (<div className="text-danger m-0 p-0" onClick={() => remove(index)} style={{ fontSize: "15px", cursor: 'pointer' }}>
                                  <i className="fa fa-minus"></i>
                                </div>)}
                              </div>
                            }>

                              <div className='d-flex flex-wrap flex-sm-nowrap justify-content-start align-items-end w-100' style={{ gap: "10px" }}>

                                <div>
                                  <label>Adv. Amount</label>
                                  <input {...register(`installmentPlans[${index}].advanceAmount`)}
                                  onFocus={(e) => e.currentTarget.addEventListener('wheel', (e) => e.preventDefault())}
                                    onBlur={(e) => e.currentTarget.removeEventListener('wheel', (e) => e.preventDefault())}

                                    defaultValue={field.advanceAmount} className="form-control px-2" type="number" style={{ height: "30px", margin: '0 0 10px', width: "100%" }} placeholder="Advance Amount" />

                                </div>

                                <div>
                                  <label>No of Months</label>
                                  <input {...register(`installmentPlans[${index}].noOfMonths`)}
                                    onFocus={(e) => e.currentTarget.addEventListener('wheel', (e) => e.preventDefault())}
                                    onBlur={(e) => e.currentTarget.removeEventListener('wheel', (e) => e.preventDefault())}

                                    defaultValue={field.noOfMonths} className="form-control px-2" type="number" style={{ height: "30px", margin: '0 0 10px', width: "100%" }} placeholder="No of Months" />
                                </div>

                                <div>
                                  <label>Amount/month</label>
                                  <input {...register(`installmentPlans[${index}].amountPerMonth`)}
                                    onFocus={(e) => e.currentTarget.addEventListener('wheel', (e) => e.preventDefault())}
                                    onBlur={(e) => e.currentTarget.removeEventListener('wheel', (e) => e.preventDefault())}

                                    defaultValue={field.amountPerMonth} className="form-control px-2" type="number" style={{ height: "30px", margin: '0 0 10px', width: "100%" }} placeholder="Amount Per Month" />
                                </div>
                              </div>
                            </Panel>
                          ))}
                        </Collapse>
                      </div>
                    </div>
                  </figure>

                  {/* Product Images Form */}
                  <figure className="ps-block--form-box">
                    <figcaption className="text-white">Product Images</figcaption>
                    <div className="ps-block__content">

                      <div className="form-group">
                        <label>Product Thumbnail</label>
                        <div className="form-group--nest">
                          <Controller
                            name="productImage"
                            control={control}
                            render={({ field }) => (
                              <>
                                <Upload

                                  {...field}
                                  fileList={(field.value && field.value?.fileList)}
                                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                  listType="picture-card" maxCount={1}  >
                                  {(field.value?.fileList?.length >= 1) ? null : uploadImageButton}
                                </Upload>
                              </>
                            )}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Product Gallery Images</label>
                        <div className="form-group--nest">
                          <Controller
                            name="galleryImages"
                            control={control}
                            render={({ field }) => (
                              <>

                                <Upload
                                  {...field}
                                  fileList={(field.value && field.value?.fileList)}
                                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                  listType="picture-card" maxCount={5} multiple>
                                  {field.value?.fileList?.length >= 5 ? null : uploadImageButton}
                                </Upload>
                              </>
                            )}


                          />
                        </div>
                      </div>

                    </div>
                  </figure>



                  {/* Meta Product SEO */}
                  {/* <figure className="ps-block--form-box">
                  <figcaption className="text-white">Meta</figcaption>
                  <div className="ps-block__content">
                    <div className="form-group form-group--select">
                      <label>Brand</label>
                      <div className="form-group__content">
                        <select className="ps-select" title="Brand">
                          <option value="1">Brand 1</option>
                          <option value="2">Brand 2</option>
                          <option value="3">Brand 3</option>
                          <option value="4">Brand 4</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Tags</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                </figure> */}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="ps-form__bottom">
              <div className="ps-btn ps-btn--black" onClick={() => (router.push('/products'))}>
                Back
              </div>
              <button className="ps-btn ps-btn--gray" onClick={() => (router.push('/products'))}>Cancel</button>
              <button className="ps-btn" type="submit" disabled={isFormSubmiting} >Submit {isFormSubmiting && <Spin />}</button>
              {/* <button className="ps-btn" type="submit">Submit</button> */}
            </div>
          </form>
        </section>
      </ErrorBoundary>
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(EditProductPage);


