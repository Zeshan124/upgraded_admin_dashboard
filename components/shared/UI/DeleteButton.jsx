import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';

const DeleteButton = ({ title, onConfirm, children }) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showPopconfirm = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
            onConfirm(); // Execute the provided onConfirm function
        }, 200);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Popconfirm
            title={title}
            open={open}
            placement="leftTop"
            onConfirm={handleOk}
            okButtonProps={{
                loading: confirmLoading,
            }}
            onCancel={handleCancel}
        >

            <span onClick={showPopconfirm}>
                {(children || <i className="fa fa-trash"></i>)}
            </span>
        </Popconfirm>
    );
};

export default DeleteButton;