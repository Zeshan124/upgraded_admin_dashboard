import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";

import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";

import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Select } from 'antd';
import { TimePicker, DatePicker } from 'antd';



import { fetchAllCategories } from "~/api/categoryService";
import { fetchAllSubCategories } from "~/api/subCategoryService";
import { fetchAllProducts } from "~/api/productService";
import { addCoupon } from "~/api/couponService";
import useSWR from "swr";
import useProducts from "~/components/hooks/useProducts";
import useCategories from "~/components/hooks/useCategories";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import { useRouter } from "next/router";
import useMessageHandler from "~/components/hooks/useMessageHandler";


const { RangePicker } = DatePicker;



const CreateCoupon = ({ product: initialProduct=[], category: initialCategory=[] }) => {
    const { productData,
        errorProduct: error,
        isLoadingProduct: isLoading,
        mutateProduct: mutate, } = useProducts(initialProduct)
    const { categoryData, categoryError: errorcategory, categoryLoading: isLoadingcategory } = useCategories(initialCategory);
    // const { subCategoryData, subCategoryError, subCategoryLoading } = useSubCategories(initialSubcategory);
    const { showSuccess, showError, contextHolder } = useMessageHandler();
    const { register, handleSubmit, watch, control, reset, setValue, formState: { errors }, } = useForm();
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        dispatch(toggleDrawerMenu(false));
    }, []);


    const plansOptions = Array.from({ length: 10 }, (_, i) => i + 3);
    const typeOptions = [{ value: "Fixed Amount", id: "1" }, { value: "Percentage Amount", id: "0" }]
    const appliedToOptions = ["advance", "plan", "TotalDeal"];
    const dateFormat = 'YYYY/MM/DD';
    const Timeformat = 'HH:mm';
    const onSubmit = async (data) => {
        const formattedStartDate = data.startDate && data.startDate[0].format(dateFormat)
        const formattedExpiryDate = data.startDate && data.startDate[1].format(dateFormat)
        const formattedExpiryTime = data.expiryTime && data.expiryTime.format(Timeformat)
        const newData = {
            ...data,
            expiryTime: formattedExpiryTime,
            expiryDate: formattedExpiryDate,
            startDate: formattedStartDate,
            plan: data?.plan?.join(),
            planExclude: JSON.stringify(data?.planExclude),
            planInclude: JSON.stringify(data?.planInclude),
        };

        try {

            const response = await addCoupon(newData); // Call the addCoupon function with form data
            if (response?.status && response?.status === 200) {
                alert(response.data.message || "Coupon added SuccessFully")
                showSuccess(response.data.message || "Coupon added SuccessFully");
                router.push('/coupon')
                reset();
            }else{
                alert('Error')
        
            }
            
            //Handle success or further actions after adding the coupon
        } catch (error) {
            alert(error.message || "Error Adding Coupon")
            console.error("Error adding coupon:", error);
            // Handle error scenarios
        }
    }
    return (
        <ContainerDefault title="Coupon Detail">
            <HeaderDashboard
                title="Coupon Detail"
                description="Qistbazaar Create Coupon "
            />
            <ErrorBoundary>
                {contextHolder}
                <section className="ps-dashboard">
                    <form onSubmit={handleSubmit(onSubmit)} className="ps-form ps-form--new-product" action="" method="get" >
                        <div className="ps-section__left">
                            <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                                    <figure className="ps-block--form-box">
                                        <figcaption className="text-white">General</figcaption>
                                        <div className="ps-block__content">

                                            <div className="form-group">
                                                <label> Coupon Code<sup>*</sup> </label>
                                                <input className="form-control" {...register("couponCode", { required: true })} type="text" placeholder="Enter couponCode name..." />
                                                {errors.couponCode && <span className="text-danger">Required Field</span>}
                                            </div>

                                            <div className="form-group">
                                                <label> Description<sup>*</sup> </label>
                                                <textarea {...register("description", { required: true })} className="form-control" rows={5} type="text" placeholder="Enter description name...">

                                                </textarea>
                                                {errors.description && <span className="text-danger">Required Field</span>}
                                            </div>
                                            {/* Applied Tp */}
                                            <div className="form-group " >
                                                <label htmlFor="x">Applied To<sup>*</sup></label>
                                                <Controller
                                                    name="appliedTo"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="click to select appliedTo" size="large" className="w-100"
                                                            onChange={(value) => field.onChange(value)}
                                                            options={appliedToOptions.map((item) => ({
                                                                value: item,
                                                                label: `${item}`,
                                                            }))}
                                                        />
                                                    )}
                                                />
                                                {errors.appliedTo && <span>This field is required</span>}
                                            </div>
                                            {/* {Plans} */}
                                            <div className="form-group " >
                                                <label htmlFor="x">Plans<sup>*</sup></label>
                                                <Controller
                                                    name="plan"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field} mode="multiple"
                                                            placeholder="click to plans" size="large" className="w-100"
                                                            onChange={(value) => field.onChange(value)}
                                                            options={plansOptions.map((number) => ({
                                                                value: number,
                                                                label: `${number}`,
                                                            }))}
                                                        />
                                                    )}
                                                />
                                                {errors.plan && <span>This field is required</span>}
                                            </div>

                                            {/* {Type of Plan} */}
                                            <div className="form-group " >
                                                <label htmlFor="x">Type of Plan<sup>*</sup></label>
                                                <Controller
                                                    name="type"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="click to Type Of Plan" size="large" className="w-100"
                                                            onChange={(value) => field.onChange(value)}
                                                            options={typeOptions.map((item) => ({
                                                                value: item.id,
                                                                label: `${item.value}`,
                                                            }))}
                                                        />
                                                    )}
                                                />
                                                {errors.type && <span>This field is required</span>}
                                            </div>
                                            {/* Figure */}
                                            <div className="form-group">
                                                <label> Figure <sup>*</sup> </label>
                                                <input className="form-control" {...register("figure", { required: true })} type="number" placeholder="Enter Figure name..." />
                                                {errors.figure && <span className="text-danger">Required Field</span>}
                                            </div>



                                        </div>
                                    </figure>
                                    <figure className="ps-block--form-box">
                                        <figcaption className="text-white">Restrictions</figcaption>

                                        <div className="ps-block__content">
                                            <div className="form-group">
                                                <label> Min Spend <sup>*</sup> </label>
                                                <input className="form-control" {...register("minSpend", { required: true })} type="number" placeholder="Enter Min Spend ..." />
                                                {errors.minSpend && <span className="text-danger">Required Field</span>}
                                            </div>

                                            <div className="form-group">
                                                <label> Max Spend <sup>*</sup> </label>
                                                <input className="form-control" {...register("maxSpend", { required: true })} type="number" placeholder="Enter Max Spend ..." />
                                                {errors.maxSpend && <span className="text-danger">Required Field</span>}
                                            </div>
                                            <div className="form-group">
                                                <label> Limit Used <sup>*</sup> </label>
                                                <input className="form-control" type="number" {...register("limitused", { required: true })} placeholder="Enter limitused..." />
                                                {errors.limitused && <span className="text-danger">Required Field</span>}
                                            </div>

                                            {/* <div className="form-group">
                                                <label> Used In Order <sup>*</sup> </label>
                                                <input className="form-control" {...register("usedInOrder", { required: true })} type="number" placeholder="Enter Min Spend name..." />
                                                {errors.usedInOrder && <span className="text-danger">Required Field</span>}
                                            </div> */}

                                            <div className="form-group">
                                                <label>Expiry Time</label>
                                                <Controller
                                                    name="expiryTime"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TimePicker
                                                            {...field}
                                                            onChange={(expiryTime) => field.onChange(expiryTime)}
                                                            onBlur={field.onBlur}
                                                            placeholder="Select Time"
                                                            className="form-control"
                                                            format={Timeformat}
                                                        />
                                                    )}
                                                />
                                                {errors.expiryTime && <span className="text-danger">Required Field</span>}
                                            </div>

                                            <div className="form-group">
                                                <label>Start and Expiry Date</label>
                                                <Controller
                                                    name="startDate"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RangePicker
                                                            {...field}
                                                            onChange={(date) => field.onChange(date)}
                                                            onBlur={field.onBlur}
                                                            className="form-control"
                                                            format={dateFormat}
                                                        />
                                                    )}
                                                />
                                                {errors.startDate && <span className="text-danger">Required Field</span>}
                                            </div>
                                            {/* <div className="form-group">
                                            <label>Expiry Date</label>
                                            <Controller
                                                name="expiryDate"
                                                control={control}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        onChange={(date) => field.onChange(date)}
                                                        onBlur={field.onBlur}
                                                        className="form-control"
                                                    />
                                                )}
                                            />
                                        </div> */}
                                        </div>
                                    </figure>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">

                                    <figure className="ps-block--form-box">
                                        <figcaption className="text-white">Exclude/Include</figcaption>
                                        <div className="ps-block__content">

                                            {/* {product} */}
                                            <div className="form-group " >
                                                <label htmlFor="x">Product Include<sup>*</sup></label>
                                                <Controller
                                                    name="productIncludeID"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field} mode="multiple"
                                                            placeholder="click to select productInclude" size="large" className="w-100"
                                                            onChange={(value) => field.onChange(value)}
                                                            options={productData?.map((item) => ({
                                                                value: item.productID,
                                                                label: item.title,
                                                                id: item.productID,
                                                            }))}
                                                        />
                                                    )}
                                                />

                                            </div>
                                            <div className="form-group " >
                                                <label htmlFor="x">Product Exclude<sup>*</sup></label>
                                                <Controller
                                                    name="productExcludeID"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field} mode="multiple"
                                                            placeholder="click to Exclude Product" size="large" className="w-100"
                                                            onChange={(value) => field.onChange(value)}
                                                            options={productData?.map((item) => ({
                                                                value: item.productID,
                                                                label: item.title,
                                                                id: item.productID,
                                                            }))}
                                                        />
                                                    )}
                                                />

                                            </div>

                                            <div className="form-group " >
                                                <label htmlFor="x">category Include<sup>*</sup></label>
                                                <Controller
                                                    name="categoryIncludeID"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field} mode="multiple"
                                                            placeholder="click category Include" size="large" className="w-100"
                                                            onChange={(value) => field.onChange(value)}
                                                            options={categoryData?.map((item) => ({
                                                                value: item.categoryID,
                                                                label: item.name,
                                                                id: item.categoryID,
                                                            }))}
                                                        />
                                                    )}
                                                />

                                            </div>
                                            <div className="form-group " >
                                                <label htmlFor="x">Category ExcludeID<sup>*</sup></label>
                                                <Controller
                                                    name="categoryExcludeID"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field} mode="multiple"
                                                            placeholder="click categoryExclude" size="large" className="w-100"
                                                            onChange={(value) => field.onChange(value)}
                                                            options={categoryData?.map((item) => ({
                                                                value: item.categoryID,
                                                                label: item.name,
                                                                id: item.categoryID,
                                                            }))}
                                                        />
                                                    )}
                                                />

                                            </div>
                                            <div className="form-group " >
                                                <label htmlFor="x">Plan Include<sup>*</sup></label>
                                                <Controller
                                                    name="planInclude"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field} mode="multiple"
                                                            placeholder="click to select planInclude" size="large" className="w-100"
                                                            onChange={(value) => field.onChange(value)}
                                                            options={plansOptions.map((number) => ({
                                                                value: number,
                                                                label: `${number}`,
                                                            }))}
                                                        />
                                                    )}
                                                />

                                            </div>
                                            <div className="form-group " >
                                                <label htmlFor="x">Plan Exclude<sup>*</sup></label>
                                                <Controller
                                                    name="planExclude"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field} mode="multiple"
                                                            placeholder="click to Plan Exclude" size="large" className="w-100"
                                                            onChange={(value) => field.onChange(value)}
                                                            options={plansOptions.map((number) => ({
                                                                value: number,
                                                                label: `${number}`,
                                                            }))}
                                                        />
                                                    )}
                                                />

                                            </div>

                                        </div>
                                    </figure>

                                </div>
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="ps-form__bottom">
                            <div className="ps-btn ps-btn--black" onClick={() => (router.push('/coupon'))}>
                                Back
                            </div>
                            {/* <button className="ps-btn ps-btn--gray">Cancel</button> */}
                            <button className="ps-btn" type="submit">Submit</button>
                        </div>
                    </form>
                </section>
            </ErrorBoundary>
        </ContainerDefault>
    );
};

export default connect((state) => state.app)(CreateCoupon);
// export async function getStaticProps() {
//     try {
//         const productData = await fetchAllProducts();
//         const categoryData = await fetchAllCategories();
//         // const subCategory = await fetchAllSubCategories();
//         return {
//             props: {
//                 product: productData,
//                 category: categoryData,
//                 // subCategory: subCategory
//             },
//         };
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return {
//             props: {
//                 product: [],
//                 category: [],
//                 // subCategory: []
//             },
//         };
//     }
// }