import { useState } from 'react';
import { message } from 'antd';

const useMessageHandler = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const showMessage = (type, content) => {
        messageApi.open({
            type,
            content,
        });
    };

    const showSuccess = (content) => {
        showMessage('success', content);
    };

    const showError = (content) => {
        showMessage('error', content);
    };

    const showWarning = (content) => {
        showMessage('warning', content);
    };

    return { showSuccess, showError, showWarning, contextHolder };
};

export default useMessageHandler;
