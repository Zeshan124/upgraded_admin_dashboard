import { Modal, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { importProductCSV } from '~/services/productService';

const FormImportProducts = ({ open, setOpen }) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const props = {
        name: 'file',
        // action: 'http://125.209.91.114:3059/api/products/importproduct',
        accept: '.csv', // Allow only CSV files
        fileList,
        onChange(info) {
            setFileList(info.fileList.slice(-1)); // Keep only the last uploaded file
        },
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
        },
    };

    const handleOk = async () => {
        try {
            setConfirmLoading(true);
            // Assuming you want to access the first file in the list if available
            const uploadedFile = fileList.length > 0 ? fileList[0] : null;

            if (uploadedFile) {
                const formData = new FormData();
                formData.append('csvFile', uploadedFile.originFileObj);
                try{
                    const response = await importProductCSV(formData);
                 
                    if (response.status===200){
                        message.success(response.data.message||`file uploaded successfully`);
                        setOpen(false);
                    

                    }
                    // console.log(response)
                    if (!response.data.success){
                        message.error(response.data.message || `File upload failed.`)
                    }
                    setConfirmLoading(false);

                }catch(error){
                    // console.log(`File upload failed.-`, error)
                    message.error(error.message||`File upload failed.`)
                    setConfirmLoading(false);
                }
                // Replace this with your actual API endpoint for file upload
                // const response = await fetch('YOUR_UPLOAD_ENDPOINT', {
                //     method: 'POST',
                //     body: formData,
                // });

                // if (response.ok) {
                //     message.success(`${uploadedFile.name} file uploaded successfully`);
                // } else {
                //     message.error(`File upload failed: ${response.statusText}`);
                // }
            } else {
                message.error('Please upload a file');
                setConfirmLoading(false);
            }


        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Modal
            title="Export Order Report"
            visible={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} loading={confirmLoading}>
                    Upload
                </Button>,
            ]}
        >
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload (CSV)</Button>
            </Upload>
        </Modal>
    );
};

export default FormImportProducts;
