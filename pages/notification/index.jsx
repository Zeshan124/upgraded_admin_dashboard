import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Spin, Select, Radio } from 'antd';
import { toggleDrawerMenu } from "~/store/app/action";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import { sendNotification } from "~/api/services";
import useProducts from "~/components/hooks/useProducts";
import useCategories from "~/components/hooks/useCategories";

const { Option } = Select;

const SendNotificationPage = () => {
  const dispatch = useDispatch();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      product: '',
      category: '',
      choice: 'product',
      body: ''
    }
  });
 
  const { productData, errorProduct, isLoadingProduct } = useProducts();
  const { categoryData, errorCategory, isLoadingCategory } = useCategories();

  const choice = watch('choice');

  const onSubmit = async (data) => {
    setIsLoadingButton(true);


    try {
      const notification = {
        to: 'that',
        notification: {
          title: data.title,
          body: data.body,
        },
        data: data.choice === 'product' ? { product: data.product } : { category: data.category },
      };

      const response = await sendNotification(notification);

      if (response || response.message_id){
        alert('SuccessFully Sent');
        reset();
      }
    } catch (error) {
      alert('Error Sending')
      console.error('Error sending notification:', error);
    }

    setIsLoadingButton(false);
  };

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  return (
    <ContainerDefault title="Send Notification">
      <HeaderDashboard title="Send Notification" description="Send notifications to users" />
      <ErrorBoundary>
        <section className="ps-new-item">
          <form onSubmit={handleSubmit(onSubmit)} className="ps-form ps-form--new-product">
            <div className="ps-form__content">
              <div className="row">
                <div className="col-12">
                  <figure className="ps-block--form-box">
                    <figcaption className="text-white">Notification Details</figcaption>
                    <div className="ps-block__content">
                      <div className="form-group">
                        <label>Notification Title<sup>*</sup></label>
                        <input {...register('title', { required: true })} className="form-control" type="text" placeholder="Enter notification title..." />
                        {errors.title && <span className="text-danger">This field is required</span>}
                      </div>
                      <div className="form-group">
                        <label>Notification Body<sup>*</sup></label>
                        <input {...register('body', { required: true })} className="form-control" type="text" placeholder="Enter notification body..." />
                        {errors.body && <span className="text-danger">This field is required</span>}
                      </div>
                      <div className="form-group">
                        <label className='mr-2'>Choose between Category or Product<sup>*</sup></label>
                        <Controller
                          name="choice"
                          control={control}
                          defaultValue="product"
                          render={({ field }) => (
                            <Radio.Group {...field} onChange={(e) => field.onChange(e.target.value)}>
                              <Radio value="category">Category</Radio>
                              <Radio value="product">Product</Radio>
                            </Radio.Group>
                          )}
                        />
                      </div>
                      {choice === 'category' && (
                        <div className="form-group">
                          <label>Category<sup>*</sup></label>
                          <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                showSearch
                                placeholder="Select category"
                                size="large"
                                className="w-100"
                                loading={isLoadingCategory}
                                filterOption={(input, option) =>
                                  option.label.toLowerCase().includes(input.toLowerCase())
                                }
                                options={categoryData?.map((item) => ({
                                  value: item.slug,
                                  label: item.name,
                                }))}
                              />
                            )}
                          />
                        </div>
                      )}
                      {choice === 'product' && (
                        <div className="form-group">
                          <label>Product<sup>*</sup></label>
                          <Controller
                            name="product"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                showSearch
                                placeholder="Select product"
                                size="large"
                                className="w-100"
                                loading={isLoadingProduct}
                                filterOption={(input, option) =>
                                  option.label.toLowerCase().includes(input.toLowerCase())
                                }
                                options={productData?.map((item) => ({
                                  value: item.slug,
                                  label: item.title,
                                }))}
                              />
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </figure>
                </div>
              </div>
            </div>
            <div className="ps-form__bottom">
              <button className="ps-btn" type="submit" disabled={isLoadingButton}>Submit {isLoadingButton && <Spin />}</button>
            </div>
          </form>
        </section>
      </ErrorBoundary>
    </ContainerDefault>
  );
};

export default connect((state) => state.app)(SendNotificationPage);
