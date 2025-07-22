import React, { useEffect, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Spin } from 'antd';

import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";

import { Select } from 'antd';
import { Collapse, InputNumber, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

import ContainerDefault from "~/components/layouts/ContainerDefault";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";


import { fetchAllCategories } from "~/api/categoryService";
import { fetchAllSubCategories } from "~/api/subCategoryService";
import { addProduct } from "~/api/productService";
import useCategories from "~/components/hooks/useCategories";
import useSubCategories from "~/components/hooks/useSubCategories";
import Editor from "~/components/shared/UI/Editor";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
const { Option } = Select;
import {slugify} from '~/util';
import SearchItemCode from "~/components/partials/products/SearchItemCode";

const CreateProductPage = ({ category: initialCategory, subCategory: initialSubcategory }) => {
  const router = useRouter();

  const { categoryData, categoryError, categoryLoading } = useCategories(initialCategory);
  const { subCategoryData, subCategoryError, subCategoryLoading } = useSubCategories(initialSubcategory);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const noOfMonthsValues = [2,3,6,9,12,18]
  const { register, handleSubmit, watch, control, reset, setValue, formState: { errors }, } = useForm({
    defaultValues: {
      title: '',
      installmentPlans: [{ amountPerMonth: '', advanceAmount: '', noOfMonths: noOfMonthsValues[1] },],
      shortDescription: '',
      detailedDescription: '',
      productTitle: '',
      itemCode: '',
      productImage: [],
      status: '0',
      tags: []
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'installmentPlans' });

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    const selectedCategories = watch('categoryID');

    if (selectedCategories && subCategoryData?.length > 0) {
      const filteredSubs = subCategoryData?.filter(subCat => (selectedCategories?.includes(subCat?.categoryID))
      );
      setFilteredSubCategories(filteredSubs);
    }
  }, [watch('categoryID'), subCategoryData]);


  const renameFiles = (files, slug) => {
    return files.map((file, index) => {
      const ext = file.name.split('.').pop();
      const newName = `${slug}-${index + 1}.${ext}`;

      return new File([file], newName, { type: file.type });
    });
  };
  const onSubmit = async (data) => {
    setIsLoading(true);

    const { productImage, galleryImages, title, detailedDescription, itemCode, shortDescription, categoryID, status, tags, installmentPlans, subcategoryIDs,
    } = data;

    try {
      // Validate if productImage is not empty
      if (!data.productImage || data.productImage.length === 0) {
        throw new Error("Product Image is required");
      }

      // Validate if categoryID is not empty
      if (!data.categoryID || data.categoryID.length === 0) {
        throw new Error("Category is required");
      }



      // Validate if installmentPlans is not empty
      if (!data.installmentPlans || data.installmentPlans.length === 0) {
        throw new Error("Installment Plans are required");
      }
      const formData = new FormData();
      const slug = slugify(title);
      const renamedProductImage = renameFiles([productImage?.fileList[0]?.originFileObj], slug)[0];

      formData.append("productImage", renamedProductImage);
      if (data.galleryImages && data.galleryImages.fileList && data.galleryImages.fileList.length > 0) {
        const renamedGalleryImages = renameFiles(galleryImages.fileList.map(image => image.originFileObj), slug);
        renamedGalleryImages.forEach(image => {
          formData.append("galleryImages", image);
        });
      }

      formData.append("title", title);
      formData.append("itemCode", itemCode);
      formData.append("detailedDescription", detailedDescription);
      formData.append("shortDescription", shortDescription);
      // categoryID.forEach((id) => {
      formData.append("categoryID", JSON.stringify(categoryID));
      // });
      formData.append("createdBy", 11);
      formData.append("status", status);
      formData.append("tags", tags.join(","));
      formData.append("feature", 0);
      // Append installmentPlans
      // installmentPlans.forEach((plan, index) => {
      //   formData.append(`installmentPlans[${index}]`, JSON.stringify(plan));
      // });
      if (Array.isArray(installmentPlans) && installmentPlans?.length > 0) {
        installmentPlans.forEach((plan, index) => {
          formData.append(`installmentPlans[${index}]`, JSON.stringify(plan));
        });
      } 
      if (data.subcategoryIDs || data.subcategoryIDs?.length > 0) {
        formData.append("subcategoryIDs", JSON.stringify(subcategoryIDs))
      }else{

        formData.append("subcategoryIDs", JSON.stringify([]))
      }

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await addProduct(formData);

      
      if (response.status === 200) {
        alert(response.data.message || "Item Added SuccessFully")
        router.push('/products');
      }
      else{
        alert(response.data.message || "Error Inserting Data")
      }
    } catch (error) {
      console.error(error)
      alert(error.message || "ERROR!!!!!!!!!")
    }finally{
      setIsLoading(false);
    }

  };
  const AccordionOnChange = (key) => {

  };
  const uploadImageButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <ContainerDefault title="Create new product">
      <HeaderDashboard
        title="Create Product"
        description="qistbazaar Create New Product "
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
                        {errors.title && <span className="text-danger">This field is required</span>}
                      </div>
                      {/* Stock */}
                      <div className="form-group">
                        <label htmlFor="x">Stock Status<sup>*</sup></label>
                        <select  {...register('status', { required: true })} id="inputState" className="form-control">
                          {/* <option value="choose" disabled hidden>Choose Status...</option> */}
                          <option value="1">In Stock</option>
                          <option value="0">Out of Stock</option>
                        </select>
                        {errors.status && <span className="text-danger">This field is required</span>}
                      </div>

                      {/* {Category} */}
                      <div className="form-group " >
                        <label htmlFor="x">Category<sup>*</sup></label>
                        <Controller
                          name="categoryID"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field} mode="multiple"
                              placeholder="click to select categories" size="large" className="w-100"
                              onChange={(value) => field.onChange(value)}
                              options={categoryData?.map((item) => ({
                                value: item.categoryID,
                                label: item.name,
                                id: item.categoryID,
                              }))}
                            />
                          )}
                        />
                        {errors.category && <span className="text-danger">This field is required</span>}
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
                              options={filteredSubCategories.map((item) => ({
                                value: item.subCategoryID,
                                label: item.name,
                                id: item.subCategoryID,
                              }))}
                            />
                          )}
                        />
                        {errors.subcategoryIDs && <span className="text-danger">This field is required</span>}
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
                        {errors.tags && <span className="text-danger">This field is required</span>}

                      </div>
                      <div className="form-group">
                        <label> Item Code<sup>*</sup> </label>
                        <SearchItemCode onSelect={(selectedItem) => setValue("itemCode", selectedItem)} />
                        <input {...register("itemCode", { required: true })} className="form-control" type="text" placeholder="Enter Item Code..." />
                        {errors.itemCode && <span className="text-danger">This field is required</span>}
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
                        {errors.shortDescription && <span className="text-danger">This field is required</span>}
                      </div>


                      {/* {Product Detailed Descriptio } */}
                      <div className="form-group">
                        <label>
                          Product Detailed Description<sup>*</sup>
                        </label>
                        {/* <textarea
                        {...register("detailedDescription", { required: true })}
                        className="form-control"
                        rows="6"
                        name="detailedDescription"
                      ></textarea> */}
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
                              // <CKEditor
                              //   editor={ClassicEditor}
                              //   data={field.value}
                              //   onChange={(event, editor) => {
                              //     const data = editor.getData();
                              //     setValue('detailedDescription', data); // Set the value to the form field
                              //   }}
                              // />
                            )}
                          />
                        </div>
                        {errors.detailedDescription && <span className="text-danger">This field is required</span>}
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

                        <button type="button" className="btn mb-2 btn-secondary d-block ml-auto" onClick={() => append({ advAmount: '', noOfMonths: noOfMonthsValues[1], amountPerMonth: '' })}>
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

                              <div className='d-flex flex-wrap flex-sm-nowrap justify-content-start align-items-start w-100' style={{ gap: "10px" }}>

                                <div>
                                  <label>Adv. Amount</label>
                                  <input {...register(`installmentPlans[${index}].advanceAmount`)}
                                    onFocus={(e) => e.currentTarget.addEventListener('wheel', (e) => e.preventDefault())}
                                    onBlur={(e) => e.currentTarget.removeEventListener('wheel', (e) => e.preventDefault())}

                                    defaultValue={field.advanceAmount} className="form-control px-2" type="number" style={{ height: "30px", margin: '0 0 10px', width: "100%" }} placeholder="Advance Amount" />

                                </div>

                                {/* <div>
                                  <label>No of Months</label>
                                  <input {...register(`installmentPlans[${index}].noOfMonths`)}
                                    defaultValue={field.noOfMonths} className="form-control px-2" type="number" style={{ height: "30px", margin: '0 0 10px', width: "100%" }} placeholder="No of Months" />
                                </div> */}

                                <div>
                                  <label>Amount/month</label>
                                  <input {...register(`installmentPlans[${index}].amountPerMonth`)}
                                    onFocus={(e) => e.currentTarget.addEventListener('wheel', (e) => e.preventDefault())}
                                    onBlur={(e) => e.currentTarget.removeEventListener('wheel', (e) => e.preventDefault())}

                                    defaultValue={field.amountPerMonth} className="form-control px-2" type="number" style={{ height: "30px", margin: '0 0 10px', width: "100%" }} placeholder="Amount Per Month" />
                                </div>
                                <div>
                                  <label>No of Months</label>
                                  <select
                                    {...register(`installmentPlans[${index}].noOfMonths`, { required: true })}
                                    defaultValue={field.noOfMonths || 3} // Ensure a default value is set
                                    className=" px-1"
                                    style={{ height: "30px", width: "100%", minWidth: '100px', }} // Adjust the style as needed
                                  >
                                    {
                                      noOfMonthsValues.map((item) => (
                                        <option value={item}>{item}</option>
                                      ))
                                    }
                                  </select>
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
                              <Upload
                                {...field} action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-card" maxCount={1}  >
                                {field.value?.fileList?.length >= 1 ? null : uploadImageButton}
                              </Upload>
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
                              <Upload
                                {...field} action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-card" maxCount={5} multiple>
                                {field.value?.fileList?.length >= 5 ? null : uploadImageButton}
                              </Upload>
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
              {/* <button className="ps-btn ps-btn--gray">Cancel</button> */}
              <button className="ps-btn" type="submit" disabled={isLoading} >Submit {isLoading && <Spin />}</button>
            </div>
          </form>
        </section>
      </ErrorBoundary>
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(CreateProductPage);

export async function getStaticProps() {
  try {
    const categoryData = await fetchAllCategories();
    const subCategory = await fetchAllSubCategories();
    return {
      props: {
        category: categoryData,
        subCategory: subCategory
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        category: [],
        subCategory: []
      },
    };
  }
}
