import { Dropdown, Menu, Modal, Select } from "antd";
import React, { useState } from "react";
import Link from "next/link";
import { deleteProduct } from "~/api/productService";
import { formatDate, getImageURL, placeHolderImage, toTitleCase } from "~/util";
import LoadingSpinner from "../UI/LoadingSpinner";
import useMessageHandler from "~/components/hooks/useMessageHandler";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import DeleteButton from "../UI/DeleteButton";
import { deleteStore, updateStoreStatus } from "~/api/storeService";

const onImageError = (e) => {
    e.target.src = placeHolderImage
}
const TableStoreItems = ({ storeData, mutate}) => {
    const { showSuccess, showError, contextHolder } = useMessageHandler();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingStore, setEditingStore] = useState(null); // Store being edited
    const [newStatus, setNewStatus] = useState(null); // New status value
    const [confirmLoading, setConfirmLoading] = useState(false); // New status value
    const deleteHandler = async (id) => {
        try {
            const response = await deleteStore(id);

            if (response.status === 200) {
                showSuccess(response.data.message || "SuccessFully Deleted");
                alert("SuccessFully Deleted");
                mutate()
            } else {
                alert(response.data.message || "SuccessFully Deleted");
            }
        } catch (error) {
            showError(error.message || "Error!!!")
        }
    };
    const handleStatusChange = (value) => {
        setNewStatus(value);
    };
    
    const showEditModal = (item) => {
        setEditingStore(item);
        setNewStatus(String(item.status));
        setIsModalVisible(true);
    };
    const handleOk = async () => {
        setConfirmLoading(true);
        try {
            if (editingStore) {
                await updateStoreStatus(editingStore.storeID, newStatus);
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
            <Menu.Item key={1}>
                <DeleteButton
                    title="Are you sure you want to delete?"
                    onConfirm={() => (deleteHandler(item?.storeID))}
                >   <span className="dropdown-item">
                        <i className="icon-trash2 mr-2"></i>
                        Delete
                    </span>
                </DeleteButton>
            </Menu.Item>
        </Menu>
    );





    if (storeData && storeData.length === 0) return <div>No Data</div>
    if (!storeData) return <div>No data Here</div>

    const tableItems = storeData && storeData?.map((item, index) => {
        let badgeView;
        if (item.status === 0) badgeView = <span className="ps-badge success text-center">Approved</span>;
        if (item.status === 2) badgeView = <span className="ps-badge danger text-center">Rejected</span>;
        if (item.status === 1) badgeView = <span className="ps-badge gray text-center">In Review</span>;




        return (
            <tr key={index}>
                <td>{item.storeID}</td>
                <td><img src={getImageURL(item?.shopIcon) ? getImageURL(item?.shopIcon) : placeHolderImage} onError={onImageError} style={{ minWidth: "50px", maxWidth: "90px" }} /></td>
                <td>
                    <Link href={`/vendor/store/${item?.shopUrl}`}>
                        <span href={`/vendor/store/${item?.shopUrl}`}><strong>{(toTitleCase(item?.ShopName))}</strong></span>
                    </Link>
                </td>

                <td>{badgeView}</td>

                <td>
                    <Link href={`https://qistbazaar.pk/store/${item?.shopUrl}`}>
                        <span href={`https://qistbazaar.pk/store/${item?.shopUrl}`}><strong>{(toTitleCase(item?.shopUrl))}</strong></span>
                    </Link>
                </td>
                <td>{formatDate(item?.createdAt)}</td>
                <td>
                    <Dropdown overlay={menuView(item)} className="ps-dropdown">
                        <a className="ps-dropdown__toggle">
                            <i className="icon-ellipsis"></i>
                        </a>
                    </Dropdown>
                </td>
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
                                <th>S.No</th>
                                <th>Icon</th>
                                <th>Shop Name</th>
                                <th>Status</th>
                                <th>URL</th>
                                <th>Created At</th>
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
                        <Option value="0">Approved</Option>
                        <Option value="1">Under Review</Option>
                        <Option value="2">Rejected</Option>
                    </Select>
                </Modal>
            </ErrorBoundary>
        </>
    );
};


export default TableStoreItems;
