import { Dropdown, Menu, Modal, Select } from "antd";
import React, { useState } from "react";
import Link from "next/link";

import useMessageHandler from "~/components/hooks/useMessageHandler";
import ErrorBoundary from "~/components/utils/ErrorBoundary";

import {  updateStoreOrdersStatus, updateStoreProductStatus } from "~/api/storeService";



const statusOfOrder = [{
    label: 'Confirm Delivered', value: 'confirmDelivered',
},
{label: 'Vendor Delivered', value: 'vendorDelivered',}]

const TableStoreOrdersItems = ({ data, mutate }) => {
    const { showSuccess, showError, contextHolder } = useMessageHandler();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null); // Store being edited
    const [newStatus, setNewStatus] = useState(null); // New status value
    const [confirmLoading, setConfirmLoading] = useState(false); // New status value

    const handleStatusChange = (value) => {
        setNewStatus(value);
    };

    const showEditModal = (item) => {
        setSelectedRow(item);
        setNewStatus(String(item.orderStatus));
        setIsModalVisible(true);
    };
    const handleOk = async () => {
        setConfirmLoading(true);
        try {
            if (selectedRow) {
                await updateStoreOrdersStatus({ orderID: selectedRow.orderID, statusDescription:'', status: newStatus });
                showSuccess("Status updated successfully");
                mutate();
            }
        } catch (error) {
            showError(error.message || "Error updating status");
        } finally {
            setConfirmLoading(false);
            setIsModalVisible(false);
        }
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const menuView = (item) => (
        <Menu>
            <Menu.Item key={0}>

                <a className="dropdown-item" href="#" onClick={() => (showEditModal(item))}>
                    <i className="icon-pencil mr-2"></i>
                    Edit
                </a>

            </Menu.Item>

        </Menu>
    );





    if (data && data.length === 0) return <div>No Data</div>
    if (!data) return <div>No data Here</div>

    const tableItems = data && data?.map((item, i) => {

        return (
            <tr key={i}>
                <td>#{item?.orderID}</td>

                <td>
                    <Link href={`/orders/${item?.orderID}/order-detail`} style={{color:"blue"}}>
                   
                            <strong>{item?.customerName}</strong>
                  
                    </Link>
                </td>

                <td>
                    <strong> {item?.phoneNo}</strong>
                </td>
                <td>
                    <strong> {item?.productNames}</strong>
                </td>
                <td>
                    <strong> {item?.city}</strong>
                </td>
                <td>
                    <strong> Rs {item?.totalAmount?.toLocaleString()}</strong>
                </td>
                <td>
                    <Dropdown overlay={menuView(item)} className="ps-dropdown">
                        <a className="ps-dropdown__toggle">
                            <i className="icon-ellipsis"></i>
                        </a>
                    </Dropdown></td>
            </tr>
        );
    });
    return (
        <>
            <ErrorBoundary>
                {contextHolder}
                <div className="table-responsive">
                    <table className="table ps-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Name</th>
                                <th>phoneNo</th>
                                <th>productNames</th>
                                <th>City</th>
                                <th>totalAmount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>{tableItems}</tbody>
                    </table>
                </div>
                <Modal
                    title="Edit Status"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    confirmLoading={confirmLoading}
                >
                    <Select
                        style={{ width: "100%" }}
                        value={newStatus}
                        onChange={handleStatusChange}

                    >
                        {statusOfOrder.map((item) => (
                            <Select.Option key={item.value} value={item.value}>
                                {item.label}
                            </Select.Option>
                        ))}

                    </Select>
                </Modal>
            </ErrorBoundary>
        </>
    );
};


export default TableStoreOrdersItems;
