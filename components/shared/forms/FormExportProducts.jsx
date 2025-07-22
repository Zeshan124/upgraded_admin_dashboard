import { Modal } from 'antd';
import React, { useState } from 'react';
import {
    Button,
    DatePicker,
    Form,
} from 'antd';
import { fetchProductCSV } from '~/api/productService';
const { RangePicker } = DatePicker;
const FormExportProducts = ({ open, setOpen }) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();


    const dateFormat = 'YYYY/MM/DD';

    const handleOk = async () => {
        form
            .validateFields()
            .then((values) => {

                setConfirmLoading(true);

                const startDate = values.range && values.range[0].format(dateFormat)
                const endDate = values.range && values.range[1].format(dateFormat)
                // console.log(startDate, endDate)
                const data = fetchProductCSV(startDate, endDate).then((response) => {

                    if (response) {
                        const url = window.URL.createObjectURL(new Blob([response?.data]))
                        const link = document.createElement('a')
                        link.href = url
                        const fileName = `Products ${startDate} to ${endDate}.csv`;
                        link.setAttribute('download', fileName)
                        document.body.appendChild(link)
                        link.click()
                        link.remove()
                    }

                })

            })
            .catch((error) => {
                console.error("404 Error:", error);
                alert('Error');
            }).finally(()=>{
                setTimeout(() => {
                setConfirmLoading(false);
                    setOpen(false);
                }, 2000);
            });
    };

    const handleCancel = () => {

        setOpen(false);
    };

    return (
        <Modal
            title="Export Product CSV"
            visible={open} // Changed prop name from open to visible
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} loading={confirmLoading}>
                    Download
                </Button>,
            ]}
        >
            <Form
                form={form}
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 12,
                }}
                layout="horizontal"


            >
                <Form.Item
                    label="Pick A Range: "
                    name="range" // Provide a unique name for each form item
                    rules={[
                        {
                            required: true,
                            message: 'Please select start date',
                        },
                    ]}
                >
                    <RangePicker />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default FormExportProducts;
