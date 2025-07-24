import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteUser } from '~/services/userService';

import DropdownAction from '~/components/elements/basic/DropdownAction';
import useMessageHandler from '~/components/hooks/useMessageHandler';
import ErrorBoundary from '~/components/utils/ErrorBoundary';
import FormEditUser from '../forms/Edit/FormEditUser';
import { Modal } from 'antd';

const TableCustomerItems = ({ userData, mutate }) => {
    const router = useRouter();
    const { showSuccess, showError, contextHolder } = useMessageHandler();
    const { token } = useSelector(state => state.auth);
    const deleteHandler = async (userID) => {
        try {
            const newData = userData && userData?.filter((item) => item.userID !== userID);
            await mutate(newData, false);
            const response = await deleteUser(userID, token);
            if (response.status === 200) {
                showSuccess(response.data.message || 'Successfully Deleted');
            }
        } catch (error) {
            showError(error.message || 'Error Deleting');
        }
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(false);
    const showModal = (item) => {
        setSelectedItem(item)
        setIsModalOpen(true);
    };
    const handleOk = async (message) => {
        showSuccess(message);
        await mutate();
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const tableItemsView = userData?.length > 0 ? userData?.map((item, index) => {
        let badgeView;

        if (item.role === "customer") {
            badgeView = <span className="ps-badge success">Customer</span>;
        } else {
            badgeView = <span className="ps-badge gray">{item.role}</span>;
        }


        return (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>
                    <strong>{item?.fullname}</strong>
                </td>
                <td>{item?.email}</td>
                <td>{item?.phoneNo}</td>
              
                <td>{item?.cnic}</td>
                <td>{item?.username}</td>
                <td>{badgeView}</td>
                <td>
                    <DropdownAction deleteHandler={() => (deleteHandler(item?.userid))}
                        editHandler={() => (showModal(item))} />
                </td>
            </tr>
        );
    }) : <div>No data available</div>;
    return (
        <ErrorBoundary>
            {contextHolder}

            <div className="table-responsive">
                <table className="table ps-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>email</th>
                            <th>Phone No</th>

                            <th>CNIC</th>
                            <th>Username</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>{tableItemsView}</tbody>
                </table>
            </div>
            {isModalOpen && (<Modal style={{
                top: 20,
            }} title="Edit Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                <FormEditUser user={selectedItem} handleOk={handleOk} onCancel={handleCancel} />
            </Modal>)
            }
        </ErrorBoundary>



    );
};

export default TableCustomerItems;
