import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from 'antd';
import { UpdateSlider, addSlider } from '~/services/sliderService';
import useMessageHandler from '~/components/hooks/useMessageHandler';
import { fetchSliders } from '~/services/sliderService';
import useSWR from 'swr';

const FormUpdateSlider = ({ data:items, onCancel, mutate }) => {
    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm();
    const { showSuccess, showError, contextHolder } = useMessageHandler();

    useEffect(() => {
        // console.log(items)
        setValue('order_position', items.order_position);
        setValue('sliderurl', items.sliderurl);
        setValue('sliderID', items.sliderID);

        const webImage =[
            {
                uid: '-1', // Unique ID for the file
                name: items.sliderImagePath, // File name
                status: 'done', // Status for Ant Design's Upload component
                url: `https://backend.qistbazaar.pk/${items.sliderImagePath}`, // Image URL
            },
        ]
        const mobileImage =[
            {
                uid: '-2',
                name: items.mobSlider,
                status: 'done',
                url: `https://backend.qistbazaar.pk/${items.mobSlider}`, // Mobile image URL
            },
        ]

        setValue('sliderImage', { fileList: webImage });
        setValue('mobSlider', { fileList: mobileImage });
    }, [items]);
    const onSubmit = async (formData) => {
        try {
            // console.log(formData)
            if (!formData.sliderImage || !formData.sliderurl || !formData.mobSlider || !formData.order_position) {
                showError('Please fill in all required fields.');
                return;
            }
            const updatedData = new FormData();

            // Append updated fields to FormData
            updatedData.append('sliderurl', formData.sliderurl);
            updatedData.append('order_position', formData.order_position);
            updatedData.append('sliderID', formData.sliderID); // Assuming the slider ID is in `data`
            // console.log(formData)
            // Append images if they were changed
            if (formData.sliderImage && formData.sliderImage.fileList.length > 0) {
                // console.log('IMAGEE1')
                updatedData.append('sliderImage', formData.sliderImage.fileList[0].originFileObj);
            }
            if (formData.mobSlider && formData.sliderImage.fileList.length>0) {
                // console.log('IMAGEE2')
                updatedData.append('mobSlider', formData.mobSlider.fileList[0].originFileObj);
            } 
            for(const key of updatedData){
                // console.log(key)
            }
            const response = await UpdateSlider(updatedData)
            console.log(response)
            //FORM Update slider
            if (response?.status === 200) {
                showSuccess(response?.message || response?.data?.message || "Successfully Updated.");
                mutate()
                onCancel();
            }else{
                showError(response?.message || response?.data?.message || "ERROR.");
            }
            

            
        } catch (error) {
            showError(error.message || 'Failed to create slider');
        }
    };


    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            {contextHolder}

            <form onSubmit={handleSubmit(onSubmit)} className="ps-form ps-form--new">
                <div className="ps-form__content">
                    <div className='d-flex justify-content-start align-items-center'>
                        <div className="form-group">
                            <label>Web IMAGE<sup>*</sup></label>
                            <Controller
                                name="sliderImage"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Upload

                                            {...field}
                                            fileList={(field.value && field.value?.fileList)}
                                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                            listType="picture-card" maxCount={1}  >
                                            {(field.value?.fileList?.length >= 1) ? null : uploadButton}
                                        </Upload>
                                    </>
                                )}
                            />

                        </div>
                        <div className="form-group">
                            <label>Mobile IMAGE<sup>*</sup></label>
                            <Controller
                                name="mobSlider"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Upload

                                            {...field}
                                            fileList={(field.value && field.value?.fileList)}
                                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                            listType="picture-card" maxCount={1}  >
                                            {(field.value?.fileList?.length >= 1) ? null : uploadButton}
                                        </Upload>
                                    </>
                                )}
                            />
                            
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Order Postion<sup>*</sup></label>
                        <input
                            {...register('order_position', { required: 'This field is required' })}
                            className={`form-control ${errors.sliderUrl ? 'ps-form--danger' : ''}`}
                            type="text"
                            placeholder="Enter Link"
                        />
                        {errors.order_position && <span className="ps-form__error">{errors.order_position.message}</span>}
                    </div>
                    <div className="form-group">
                        <label>URL<sup>*</sup></label>
                        <input
                            {...register('sliderurl', { required: 'This field is required' })}
                            className={`form-control ${errors.sliderUrl ? 'ps-form--danger' : ''}`}
                            type="text"
                            placeholder="Enter Link"
                        />
                        {errors.sliderUrl && <span className="ps-form__error">{errors.sliderUrl.message}</span>}
                    </div>
                </div>
                <div className="ps-form__bottom">
                    <button className="ps-btn ps-btn--gray" onClick={onCancel} type="button">
                        Cancel
                    </button>
                    <button className="ps-btn ps-btn--submit success" type="submit">
                        Update
                    </button>
                </div>
            </form>
        </>
    );
};

export default FormUpdateSlider;
