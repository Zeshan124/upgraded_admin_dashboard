import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from 'antd';
import { addSlider } from '~/services/sliderService';
import useMessageHandler from '~/components/hooks/useMessageHandler';
import { fetchSliders } from '~/services/sliderService';
import useSWR from 'swr';

const FormCreateSlider = ({ onCancel }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const { data: sliderData, error, isLoading, mutate } = useSWR(
        '/slider/get',
        fetchSliders,
    );
    const { showSuccess, showError, contextHolder } = useMessageHandler();
    const [fileList, setFileList] = useState([]);
    const [mobileFileList, setMobileFileList] = useState([]);
    const onSubmit = async (data) => {
        try {
            if (!data.sliderImage || !data.sliderUrl || !data.mobSlider) {
                showError('Please fill in all required fields.');
                return;
            }

            const response = await addSlider(data.sliderImage, data.sliderUrl, data.mobSlider, (sliderData.length || 12) );
            if(response?.status===200){
                showSuccess(response.data.message || "Successfully Deleted.");
            }
            onCancel();
            showSuccess(response.data.message || "Successfully Deleted.");
        } catch (error) {
            showError(error.message || 'Failed to create slider');
        }
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        // Set value for 'sliderUrl' field in react-hook-form
        if (newFileList.length > 0) {
            const sliderImage = newFileList[0].originFileObj;
            setValue('sliderImage', sliderImage);
        }
    };
    const handleMobileChange = ({ fileList: newFileList }) => {
        setMobileFileList(newFileList);
        // Set value for 'sliderUrl' field in react-hook-form
        if (newFileList.length > 0) {
            const sliderImage = newFileList[0].originFileObj;
            setValue('mobSlider', sliderImage);
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
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleChange}
                                maxCount={1}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        </div>
                        <div className="form-group">
                            <label>Mobile IMAGE<sup>*</sup></label>
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-card"
                                fileList={mobileFileList}
                                onChange={handleMobileChange}
                                maxCount={1}
                            >
                                {mobileFileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>URL<sup>*</sup></label>
                        <input
                            {...register('sliderUrl', { required: 'This field is required' })}
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
                        Add
                    </button>
                </div>
            </form>
        </>
    );
};

export default FormCreateSlider;
