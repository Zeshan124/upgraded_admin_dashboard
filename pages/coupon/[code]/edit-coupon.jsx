import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";

import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";

import { Controller, useForm } from "react-hook-form";
import { Select } from 'antd';
import { TimePicker, DatePicker } from 'antd';
import moment from 'moment';


import { fetchAllCategories } from "~/api/categoryService";
import { fetchAllSubCategories } from "~/api/subCategoryService";
import { fetchAllProducts } from "~/api/productService";
import { addCoupon, getCouponByCode, updateCoupon } from "~/api/couponService";
import useSWR from "swr";
import { useRouter } from "next/router";
import useMessageHandler from "~/components/hooks/useMessageHandler";
import useCategories from "~/components/hooks/useCategories";
import useProducts from "~/components/hooks/useProducts";
import ErrorBoundary from "~/components/utils/ErrorBoundary";


const { RangePicker } = DatePicker;



const EditCoupon = () => {
    const [couponData, setCouponData] = useState(null);
    const router = useRouter();
    const { code } = router.query;
    const url = `/coupon/${code}`;
    const { data: couponValue, error } = useSWR(code ? url : null,
        code ? () => getCouponByCode(code) : null,
        {
            revalidateIfState: false,
            revalidateOnReconnect: false,
            revalidateOnMount: true
        });
    const { productData,  errorProduct: errorProduct, isLoadingProduct: isLoading, mutateProduct: mutate, } = useProducts()
    const { categoryData, categoryError: errorcategory, categoryLoading: isLoadingcategory } = useCategories();
    // const { subCategoryData, subCategoryError, subCategoryLoading } = useSubCategories(initialSubcategory);
    const { showSuccess, showError, contextHolder } = useMessageHandler();

    const { register, handleSubmit, watch, control, reset, setValue, formState: { errors } } = useForm({
        defaultValues: couponData ? { ...couponData } : {} // Set default values if coupon data is available
    });
    const setFormValues = (data, dataList, key) => {
        const values = data[key] || []; // Handling undefined values
        const selectedItems = dataList
            .filter((item) => values === (item.categoryID || item.productID))
            .map((item) => (item.categoryID || item.productID));
        return (selectedItems.length > 0) ? selectedItems : []; // Return null if no selected items found
    };


    useEffect(() => {
        if (!router.isReady) return;
        if (couponValue && couponValue.length > 0 ) {
            const couponItem = couponValue[0]
            // setValue(`expiryDate`, moment(couponItem.expiryDate));
            couponItem.startDate && setValue(`startDate`, [moment(couponItem.startDate), moment(couponItem.expiryDate)]);

            const formattedTime = couponItem.expiryTime && moment(couponItem.expiryTime, 'HH:mm');
            if (formattedTime.isValid()) {
                setValue('expiryTime', formattedTime);
            }
            couponItem.couponID && setValue('couponID', couponItem.couponID);
            couponItem.couponCode && setValue("couponCode", couponItem.couponCode);
            couponItem.description && setValue("description", couponItem.description);
            couponItem.plan && setValue("plan", (Array(couponItem.plan) || []));
            couponItem.type && setValue("type", couponItem.type);
            couponItem.figure && setValue("figure", couponItem.figure);
            couponItem.limitused && setValue("limitused", couponItem.limitused);
            couponItem.usedInOrder && setValue("usedInOrder", couponItem.usedInOrder);
            couponItem.appliedTo && setValue("appliedTo", couponItem.appliedTo);
            couponItem.minSpend && setValue("minSpend", couponItem.minSpend);
            couponItem.maxSpend && setValue("maxSpend", couponItem.maxSpend);
            if(productData && productData.length >0){
                couponItem.productExcludeID && setValue("productExcludeID", setFormValues(couponItem, productData, "productExcludeID"));
                couponItem.productIncludeID && setValue("productIncludeID", setFormValues(couponItem, productData, "productIncludeID"));

            }
            if(categoryData && categoryData.length>0){
                couponItem.categoryExcludeID && setValue("categoryExcludeID", setFormValues(couponItem, categoryData, "categoryExcludeID"));
                couponItem.categoryIncludeID && setValue("categoryIncludeID", setFormValues(couponItem, categoryData, "categoryIncludeID"));
            }


            couponItem.planInclude && setValue("planInclude", JSON.parse(couponItem.planInclude));
            couponItem.planExclude && setValue("planExclude", JSON.parse(couponItem.planExclude));

        }
    }, [couponValue]);



    const dispatch = useDispatch();
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
            planExclude: ([data?.planExclude?.join()]),
            expiryTime: formattedExpiryTime,
            expiryDate: formattedExpiryDate,
            startDate: formattedStartDate,
            plan: data.plan[0],
        };

        try {
            const response = await updateCoupon(newData); // Call the addCoupon function with form data
            
            if (response?.status === 200) {
                alert(response.data.message || "Coupon Updated SuccessFully")
                showSuccess(response.data.message || "Coupon Updated SuccessFully");
                router.push('/coupon')
                reset();
            }
  
            

        } catch (error) {
            alert(error.message || "Error Updating Coupon")
            // showError(error.message || "Error Updating Coupon")
            console.error("Error Updating coupon:", error);
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
                                                {errors.Description && <span className="text-danger">Required Field</span>}
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
                                                <input className="form-control" {...register("figure", { required: true })} type="text" placeholder="Enter Figure name..." />
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
                            <button className="ps-btn ps-btn--gray">Cancel</button>
                            <button className="ps-btn" type="submit">Submit</button>
                        </div>
                    </form>
                </section>
            </ErrorBoundary>
        </ContainerDefault>
    );
};

export default connect((state) => state.app)(EditCoupon);

// export async function getStaticPaths() {
//     try {
//         const productData = await fetchAllProducts();
//         const categoryData = await fetchAllCategories();
//         const subCategory = await fetchAllSubCategories();
//         return {
//             props: {
//                 product: productData,
//                 category: categoryData,
//                 subCategory: subCategory
//             },
//         };
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return {
//             props: {
//                 product: [],
//                 category: [],
//                 subCategory: []
//             },
//         };
//     }
// }