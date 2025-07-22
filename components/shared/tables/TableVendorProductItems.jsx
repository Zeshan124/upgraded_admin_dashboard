import { Dropdown, Menu, Modal, Select } from "antd";
import React, { useState } from "react";
import Link from "next/link";

import { formatDate, getImageURL, placeHolderImage, toTitleCase } from "~/util";

import useMessageHandler from "~/components/hooks/useMessageHandler";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import DeleteButton from "../UI/DeleteButton";
import { deleteStore, updateStoreProductStatus } from "~/api/storeService";
import { deleteProduct } from "~/api/productService";

const onImageError = (e) => {
    e.target.src = placeHolderImage
}
const TableVendorProductItems = ({ data, mutate }) => {
    const { showSuccess, showError, contextHolder } = useMessageHandler();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null); // Store being edited
    const [newStatus, setNewStatus] = useState(null); // New status value
    const [confirmLoading, setConfirmLoading] = useState(false); // New status value
    const deleteHandler = async (id) => {
        try {
            const response = await deleteProduct(id);

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
        setSelectedRow(item);
        setNewStatus(String(item.productConfirmationStatus));
        setIsModalVisible(true);
    };
    const handleOk = async () => {
        setConfirmLoading(true);
        try {
            if (selectedRow) {
                await updateStoreProductStatus({productID:selectedRow.productID, status:newStatus});
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
                    onConfirm={() => (deleteHandler(item?.productID))}
                >   <span className="dropdown-item">
                        <i className="icon-trash2 mr-2"></i>
                        Delete
                    </span>
                </DeleteButton>
            </Menu.Item>
        </Menu>
    );





    if (data && data.length === 0) return <div>No Data</div>
    if (!data) return <div>No data Here</div>

    const tableItems = data && data?.map((item, index) => {
        let badgeView;
        if (item?.status) {
            badgeView = <span className="ps-badge success text-center" style={{ minWidth: "106px" }}>In Stock</span>;
        } else {
            badgeView = <span className="ps-badge gray text-center" style={{ minWidth: "106px" }}>Out of stock</span>;
        }


        return (
            <tr key={index}>
                <td>{item.productID}</td>
                <td><img src={getImageURL(item?.productImage) ? getImageURL(item?.productImage) : placeHolderImage} onError={onImageError} style={{ minWidth: "50px", maxWidth: "90px" }} /></td>
                <td>
                    <Link href={`/products/${item?.productID}`}>
                        <span href={`/products/${item?.productID}`}><strong>{item?.deleteStatus === 1 ? <del className="text-danger">{item?.title}</del> : (toTitleCase(item?.title))}</strong></span>

                    </Link>
                </td>

                <td>{badgeView}</td>
                <td>
                    {
                        item?.categories && item.categories.some(cat => cat !== null) && (
                            item.categories.map(obj => obj?.name).join(', ')
                        )
                    }

                    {
                        item?.subcategories && item?.subcategories?.some(subCat => subCat !== null) && item.subcategories.length > 0 && (
                            <p className="ps-item-categories">
                                {"( "}
                                {item.subcategories.map((cat) => (
                                    cat && <a href="#" key={cat?.subCategoryID}>{cat.name}</a>
                                ))}
                                {" )"}
                            </p>
                        )
                    }
                </td>
                <td>{formatDate(item?.modifiedAt)}</td>
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


export default TableVendorProductItems;
