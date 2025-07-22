import React, { useState } from "react";
import { Badge, Dropdown, Table, Modal } from 'antd';
import useSWR, { mutate } from "swr";
import { deleteCategory, fetchAllCategories, updateCategory } from "~/api/categoryService";
import { deleteSubCategory, fetchAllSubCategories, updateSubCategory } from "~/api/subCategoryService";
import { getImageURL, placeHolderImage } from "~/util";
import DropdownAction from "~/components/elements/basic/DropdownAction";

import useCategories from "~/components/hooks/useCategories";
import useMessageHandler from "~/components/hooks/useMessageHandler";
import useSubCategories from "~/components/hooks/useSubCategories";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import FormEditCateogry from "../forms/Edit/FormEditCateogry";


const TableCategoryItems = ({ category: initialCategory, subCategory: initialSubcategory }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState();
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const { showSuccess, showError, contextHolder } = useMessageHandler();
    const { categoryData: categories, categoryError: error, categoryLoading: isLoading, mutate: mutateCategory } = useCategories(initialCategory);
    const { subCategoryData: subCategories, subCategoryError: errorSubcategory, subCategoryLoading: isLoadingSubcategory, mutate: mutateSubCategory } = useSubCategories(initialSubcategory);
    // console.log('categories: ', categories, subCategories);
    const showModal = (item) => {
        setSelectedItem({ ...item });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = async () => {
        setIsLoadingForm(true)
        let response;
        try {
            const formData = new FormData();
            formData.append("name", selectedItem.name);
            formData.append("modifiedBy", 11);
            formData.append("categoryID", selectedItem.categoryID);
            formData.append("metaName", selectedItem.metaName);
            formData.append("metaDescription", selectedItem.metaDescription);
            formData.append("description", selectedItem?.description);
            if (selectedItem.subCategoryID) {

                selectedItem.fileList && formData.append('subCategoryImage', selectedItem.fileList[0].originFileObj)
                formData.append("subCategoryID", selectedItem?.subCategoryID);
              
                response = await updateSubCategory(formData);
                await mutateSubCategory();
            } else {
                formData.append("catIcon", selectedItem.catIcon);
                selectedItem.fileList && formData.append("categoryImage", selectedItem?.fileList[0].originFileObj);
                response = await updateCategory(formData);
                await mutateCategory();
            }

            if (response.status === 200) {
                showSuccess(response.data.message || "Successfully Added");
            }
        } catch (error) {
            showError(error.message || "Editing Error");
        }finally{
            setIsLoadingForm(false);
        }

        setIsModalVisible(false); // Close the modal after delete/update
    };

    const deleteHandler = async (record) => {
        let response;
        try {
            const data = record.subCategoryID ? subCategories : categories;
            const idKey = record.subCategoryID ? "subCategoryID" : "categoryID";

            const newData = data.filter((item) => item[idKey] !== record[idKey]);
            await (record?.subCategoryID ? mutateSubCategory(newData, false) : mutateCategory(newData, false));

            response = record.subCategoryID
                ? await deleteSubCategory(record.subCategoryID)
                : await deleteCategory(record.categoryID);

            if (response.status === 200) {
                showSuccess(response.data.message || "Successfully Deleted");
            }
        } catch (error) {
            showError(error.message || "Editing Error");
        }
    };

    const handleInputChange = (key, value) => {
        setSelectedItem({ ...selectedItem, [key]: value });
    };

    const handleImageChange = (info) => {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1); // Limit to a single image
        setSelectedItem({ ...selectedItem, fileList });
    };
    const onImageError = (e) => {
        e.target.src = placeHolderImage
    }

    const modalContent = isModalVisible && (
        <Modal
            title={`Edit Modal`}
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <FormEditCateogry
                selectedItem={selectedItem}
                handleImageChange={handleImageChange}
                handleInputChange={handleInputChange}
                confirmLoading={isLoadingForm}
                categories={selectedItem.subCategoryID ? categories : []}
            />
        </Modal>
    );
    const columns = [
        {
            title: 'ID',
            dataIndex: 'categoryID',
            key: 'categoryID',
        },
        {
            title: 'Category Image',
            dataIndex: 'categoryImage',
            key: 'categoryImage',
            responsive: ['md'],
            render: (image) => image ? <img src={getImageURL(image)} alt="Category"  onError={onImageError} style={{ width: '70px', height: '70px', objectFit: 'cover' }} /> : null,
        },
        {
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: 'Category Slug',
            dataIndex: 'slug',
            key: 'slug',
            responsive: ['md'],
        },
        {
            title: 'Count',
            dataIndex: 'productCount',
            key: 'productCount',
            responsive: ['md'],
        },
        // {
        //     title: 'metaName',
        //     dataIndex: 'metaName',
        //     key: 'metaName',
        //     responsive: ['md'],
        // },
        // {
        //     title: 'metaDescription',
        //     dataIndex: 'metaDescription',
        //     key: 'metaDescription',
        //     responsive: ['md'],
        // },

        // {
        //     title: 'catIcon',
        //     dataIndex: 'catIcon',
        //     key: 'catIcon',
        //     responsive: ['md'],
        // },
        {
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => (
                <DropdownAction
                    deleteHandler={() => deleteHandler(record)}
                    editHandler={() => showModal(record)}
                />

            ),
        },
    ];

    const mergedData = categories?.map(category => {
        const matchingSubCategories = subCategories?.filter(subCategory => subCategory.categoryID === category.categoryID);
        return {
            ...category,
            subCategories: matchingSubCategories || [], // Assign the filtered subcategories or an empty array
        };
    });

    const expandedRowRender = (record) => {
        const subCategoryColumns = [
            {
                title: 'ID',
                dataIndex: 'subCategoryID',
                key: 'subCategoryID',
            },
            {
                title: 'Image',
                dataIndex: 'subCategoryImage',
                key: 'subCategoryImage',
                render: (image) => image ? <img src={getImageURL(image)} onError={onImageError} alt="Sub Category" style={{ width: '80px', height: '80px', objectFit: 'cover' }} /> : null,
            },
            {
                title: 'Sub-Category Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: ' Slug',
                dataIndex: 'slug',
                key: 'slug',
            },

            {
                title: 'Count',
                dataIndex: 'productCount',
                key: 'productCount',
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                key: 'operation',
                render: (text, subRecord) => (
                    <DropdownAction
                        deleteHandler={() => deleteHandler(subRecord)}
                        editHandler={() => showModal(subRecord, "EDIT")}
                    />

                ),
            },
        ];

        return (

                <Table
                    columns={subCategoryColumns}
                    dataSource={record.subCategories}
                    pagination={false}
                    bordered
                    rowKey="subCategoryID"
                    rowClassName={"tableColorSubCat"}
                />

        );
    };

    return (
        <>
            <ErrorBoundary>
                {contextHolder}
                {modalContent}
                <Table
                    bordered
                    columns={columns}
                  
                    dataSource={mergedData}
                    expandable={{
                        expandedRowRender,
                        // defaultExpandedRowKeys: mergedData?.map((record, index) => index.toString()),

                    }}
                    rowKey="categoryID"
                />
            </ErrorBoundary>
        </>
    );
};

export default TableCategoryItems;

export async function getServerSideProps() {
    try {
        const categoryData = await fetchAllCategories();
        const subCategory = await fetchAllSubCategories();
        return {
            props: {
                category: categoryData,
                subCategory: subCategory
            },
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            props: {
                category: [],
                subCategory: []
            },
        };
    }
}
