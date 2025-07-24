import React, { useState, useEffect } from 'react';
import { toTitleCase } from '~/util';
import { Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { addCategory } from '~/services/categoryService';
import { addSubCategory } from '~/services/subCategoryService';
import useCategories from '~/components/hooks/useCategories';
import ErrorBoundary from '~/components/utils/ErrorBoundary';
import useMessageHandler from '~/components/hooks/useMessageHandler';
import useSubCategories from '~/components/hooks/useSubCategories';
import Editor from '../UI/Editor';


const FormCreateCategory = () => {
    const initialState = {
        name: '',
        selectedCategory: '',
        catIcon:'',
        description:'',
        metaDescription:'',
        metaName:'',
        fileList: [],
    };
    const { categoryData: categoryItems, categoryError: error, categoryLoading: isLoading, mutate } = useCategories();
    const { showSuccess, showError, contextHolder } = useMessageHandler();
    const { mutate: mutateSubCategory } = useSubCategories();

    const [inputs, setInputs] = useState(initialState);

    const [editorLoaded, setEditorLoaded] = useState(false);
    const [detailedDescription, setDetailedDescription] = useState("");

    useEffect(() => {
        setEditorLoaded(true);
    }, []);
    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setInputs({
            ...inputs,
            [name]: value,
        });

    };

    const handleImageChange = (info) => {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1); // Limit to a single image
        setInputs({
            ...inputs,
            fileList,
        });
    };

    const resetFormData = () => {
        setInputs(initialState);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const submitForm = async (event) => {
        event.preventDefault();

        const { name, selectedCategory, description, fileList, catIcon, metaDescription, metaName } = inputs;
        
        const formData = new FormData();
        if (!name || (!selectedCategory && fileList.length === 0) || (!selectedCategory && catIcon.trim()==="")) {
            showError('Please fill all required fields');
            return;
        }

        formData.append('name', name);
        formData.append('createdBy', 11);
        formData.append('metaDescription', metaDescription);
        formData.append('metaName', metaName);
        formData.append('description', detailedDescription);
        try {
            let response;
            if (!selectedCategory) {
                formData.append('categoryImage', fileList[0].originFileObj);
                formData.append('catIcon', catIcon);
                response = await addCategory(formData);
                await mutate();
            } else {
                formData.append('subCategoryImage', fileList[0].originFileObj);
                formData.append('categoryID', selectedCategory);
          
                response = await addSubCategory(formData);
                await mutateSubCategory();
            }
            if (response.status === 200) {
                showSuccess(response.data.message || "Added SuccesFully")
            }
   
        } catch (error) {
            showError(error.message || "Error Inserting Data")
            console.error('Error submitting form data:', error);
        }
        resetFormData(); // Reset form after submission
    };

    return (
        <ErrorBoundary>
            {contextHolder}
            <form onSubmit={submitForm} className="ps-form ps-form--new" action="index.html" method="get">
                <div className="ps-form__content">
                    <div className="form-group">
                        <label>
                            Name<sup>*</sup>
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter category/Sub Category"
                            name="name"
                            onChange={handleFormChange}
                            value={inputs.name}
                        />
                    </div>
                    <div className="form-group">
                        <label>Select Parent Category</label>
                        <select
                            className="form-control"
                            defaultValue={''}
                            value={inputs.selectedCategory}
                            name="selectedCategory"
                            onChange={handleFormChange}
                        >
                            <option value="" disabled hidden>
                                Select Categories...
                            </option>
                            {categoryItems?.map((item) => (
                                <option value={item.categoryID} key={item.categoryID}>
                                    {toTitleCase(item.name)}
                                </option>
                            ))}
                        </select>
                    </div>
                    {!inputs.selectedCategory &&<div className="form-group">
                        <label>
                            Category Icon<sup>*</sup>
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter category Icon"
                            name="catIcon"
                            onChange={handleFormChange}
                            value={inputs.catIcon}
                        />
                    </div>}
                    {/* <div className="form-group">
                        <label>
                            Description<sup>*</sup>
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Description"
                            name="description"
                            onChange={handleFormChange}
                            value={inputs.description}
                        />
                    </div> */}
                    <div className="form-group">
                        <label>
                            Description:<sup>*</sup>
                        </label>
                        <div className="w-100 mw-100">
                            <Editor
                                name="detailedDescription"
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setDetailedDescription(data);
                                }}
                                value={detailedDescription}
                                editorLoaded={editorLoaded}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>
                            Meta Description<sup>*</sup>
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter metaDescription"
                            name="metaDescription"
                            onChange={handleFormChange}
                            value={inputs.metaDescription}
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            Meta Title<sup>*</sup>
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter metaName"
                            name="metaName"
                            onChange={handleFormChange}
                            value={inputs.metaName}
                        />
                    </div>
                    <div className="form-group">
                        <label>IMAGE<sup>*</sup></label>
                        <Upload
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            listType="picture-card"
                            fileList={inputs.fileList}
                            onChange={handleImageChange}
                            maxCount={1}
                        >
                            {inputs.fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </div>
                </div>
                <div className="ps-form__bottom">
                    <button className="ps-btn ps-btn--gray" onClick={resetFormData}>
                        Reset
                    </button>
                    <button className="ps-btn ps-btn--submit success px-4 w-100" type="submit">
                        Add new
                    </button>
                </div>
            </form>
        </ErrorBoundary>
    );
};

export default FormCreateCategory;
