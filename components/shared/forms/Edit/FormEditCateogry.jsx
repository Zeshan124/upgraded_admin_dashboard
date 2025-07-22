import React, { useEffect, useState } from 'react'
import { Upload, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getImageURL } from "~/util";
import ErrorBoundary from '~/components/utils/ErrorBoundary';
import Editor from '../../UI/Editor';
const { Option } = Select;

const FormEditCateogry = ({ selectedItem, handleImageChange, handleInputChange, isLoading,  categories = [] }) => {
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [detailedDescription, setDetailedDescription] = useState("");

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Edit/Upload</div>
        </div>
    );
    let image = selectedItem.categoryImage || selectedItem.subCategoryImage;
    const defaultFileList = image
        ? [{
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: getImageURL(image), // Get the image URL from the item data
        },] : [];

    return (
        <>
            <ErrorBoundary>
                <div className='d-flex align-items-center' style={{columnGap:'10px'}}>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1">Category Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={selectedItem.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                        {/* Add more input fields for other properties if needed */}
                    </div>
                    {!selectedItem.subCategoryID && (<div className="form-group">
                        <label htmlFor="exampleFormControlSelect1">Cat Icon</label>
                        <input
                            type="text"
                            className="form-control"
                            value={selectedItem.catIcon}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                        {/* Add more input fields for other properties if needed */}
                    </div>)}
                </div>

                {selectedItem.subCategoryID && (
                    <div className="form-group">
                        <label htmlFor="Parent Name" className='mr-2'>Parent Category:{" "}</label>

                        <Select
                            value={selectedItem.categoryID}
                            onChange={(value) => handleInputChange('categoryID', value)}
                            className="w-100"
                        >
                            {categories.map((category) => (
                                <Option key={category.categoryID} value={category.categoryID}>
                                    {category.name}
                                </Option>
                            ))}
                        </Select>
                    </div>)}
                
               
                    <div className="form-group">
                        <label htmlFor="description" className='mr-2'>Description:{" "}</label>

                        {/* <input
                            type="text"
                            className="form-control"
                            value={selectedItem.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                        /> */}
                                <Editor
                                    name="detailedDescription"
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        handleInputChange("description", data)
                                        setDetailedDescription(data);
                                    }}
                                    value={detailedDescription}
                                    editorLoaded={editorLoaded}
                                />
                    </div>
                    <div className="form-group">
                    <label htmlFor="metaName" className='mr-2'>metaName:{" "}</label>

                        <input
                            type="text"
                            className="form-control"
                        value={selectedItem.metaName}
                        onChange={(e) => handleInputChange("metaName", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                    <label htmlFor="metaDescription" className='mr-2'>metaDescription:{" "}</label>

                        <input
                            type="text"
                            className="form-control"
                        value={selectedItem.metaDescription}
                        onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                        />
                    </div>
                <div className="form-group">
                    <label>IMAGE<sup>*</sup></label>
                    <Upload
                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        listType="picture-card"
                        fileList={selectedItem.fileList || defaultFileList}
                        onChange={handleImageChange}
                        maxCount={1}
                    >
                        {(uploadButton)}
                    </Upload>
                </div>
            </ErrorBoundary>
        </>
    )
}

export default FormEditCateogry