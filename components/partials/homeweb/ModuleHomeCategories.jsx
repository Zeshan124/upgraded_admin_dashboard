import React, { useEffect, useState } from 'react'
import { Select } from 'antd';
import { Input, Space } from 'antd';
const { Search } = Input;
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal, Button, Upload } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { addProductFeature, fetchProductFeatureCategories, getFeaturedProductsBySlug, searchProducts, updateProductFeature } from '~/services/productService';
import useSearch from '~/components/hooks/useSearch';
import LoadingSpinner from '~/components/shared/UI/LoadingSpinner';
import useMessageHandler from '~/components/hooks/useMessageHandler';
import useCategories from '~/components/hooks/useCategories';

const sortBY = [
    {
        label  : 'Custom',
        value : 'custom',
    },
    {
        label : 'Price:HighToLow',
        value: 'highToLow',
    },
    {
        label : 'Price:LowToHigh',
        value : 'lowtoHigh',
    },

]

const ModuleHomeCategories = ({ category, mutate:mutateFeatureCategory }) => {
    const [sortOption, setSortOption] = useState('custom');
    const [selectedItems, setSelectedItems] = useState([]);
    const { showSuccess, showError, contextHolder } = useMessageHandler();
    const [image, setImage] = useState([]);
    //Adding
    const [newCategory, setNewCategory] = useState(undefined);
    // const { showSuccess, showError, contextHolder } = useMessageHandler();
    const { categoryData: categoryOptions, categoryError, categoryLoading } = useCategories();
    const [modalVisible, setModalVisible] = useState(false);
    const { searchKeyword, setSearchKeyword, searchedData, handleSearch, handleCategoryChange } = useSearch(searchProducts);
    useEffect(()=>{
        const getFeaturedProducts = async(slug)=>{
            const items = await getFeaturedProductsBySlug(slug)
            setSelectedItems(items)
        
        }
        
        
        if (category.slug){
        
            getFeaturedProducts(category.slug)
            handleCategoryChange(category.slug)
        }
        
    }, [category.slug])


    

    const onChange = (event) => {


        if (event.target.value.trim() === "" || !event.target.value) {
            setSearchKeyword('')

            handleCategoryChange(category.slug);
        }
    };
    const sortItems = (option) => {
        const sortedItems = [...selectedItems].sort((a, b) => {
            // Ensure DisplayAmount is treated as a string before replacing non-numeric characters
            const priceA = parseInt(a.DisplayAmount.toString().replace(/[^0-9.-]+/g, ""));
            const priceB = parseInt(b.DisplayAmount.toString().replace(/[^0-9.-]+/g, ""));

            if (option === 'highToLow') {
                return priceB - priceA;
            } else if (option === 'lowtoHigh') {
                return priceA - priceB;
            }
            return 0;
        });

        if (option !== 'custom') {
            setSelectedItems(sortedItems);
        }
    };
    const handleSortChange = (value) => {
        setSortOption(value);
        sortItems(value);
    };
    // ----------------------------------------------------
    const imageUploadHandler = ({ fileList }) => {
        setImage(fileList); // Update file list state on change
    }
    const imageHandleRemove = (file) => {
        const updatedFileList = image.filter((item) => item.uid !== file.uid);
        setImage(updatedFileList);
    };

    const onSearch = (value) => {
        handleSearch(value, category.slug);
    };

    const handleCheckboxChange = (item) => {
        const selectedItemIndex = selectedItems.findIndex((selectedItem) => selectedItem.productID === item.productID);

        if (selectedItemIndex === -1) {
            setSelectedItems([...selectedItems, item]);
        } else {
            const updatedItems = [...selectedItems];
            updatedItems.splice(selectedItemIndex, 1);
            setSelectedItems(updatedItems);
        }
    };
    const submitHandler = async()=>{
        
        const items = selectedItems.map((item)=>{
            return item.productID
        })
        // console.log(category.categoryID)
        try{
            const response =  await updateProductFeature(category.categoryID, items)
        
            if(response.status === 200){
                showSuccess(response?.data?.message || 'Successfully Updated')
                await mutateFeatureCategory();
            }else{
                showError(response?.data?.message || 'Error Inserting Data')
                
            }
            // console.log(response)
        }catch(e){
            showError(error.message || 'Error Inserting Data')
        }
        
    }
    const onDragEnd = (result) => {
        if (!result.destination) return; // dropped outside the list

        const items = [...selectedItems];
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        // console.log(items,'SORTED items')
        setSelectedItems(items);
    };

    if(!category){
        return <LoadingSpinner />
    }
    const handleAddNewCategory = async () => {
        try {
            const response = await addProductFeature(newCategory, []);
            // console.log('handleAddNewCategory', response);
            if (response.status === 200) {
                showSuccess('Category added successfully');
                setModalVisible(false);
            } else {
                showError('Failed to add category');
            }
        } catch (error) {
            showError('Failed to add category');
        }
    };
    const modalAddView = (
        <Modal
            title="Add New Category"
            visible={modalVisible}
            onOk={handleAddNewCategory}
            onCancel={() => setModalVisible(false)}
            okText="Add"
            cancelText="Cancel"
        >
            <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Select a category"
                optionFilterProp="children"
                onChange={value => setNewCategory(value)}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {categoryOptions?.map(option => (
                    <Select.Option key={option?.categoryID} value={option?.categoryID}>{option?.name}</Select.Option>
                ))}
            </Select>
        </Modal>
    )
    const addBtn = (
        <div className="card rounded mx-1 mb-1 ml-auto" style={{ maxWidth: "200px" }} onClick={() => setModalVisible(true)}>
            <div className="card-body" >
                <div className="media d-flex">
                    <div className="align-self-center">
                        <i className="icon-plus primary font-large-2 float-left"></i>
                    </div>
                    <div className="media-body text-center">
                        <span role="button">Add New Category</span>
                    </div>
                </div>
            </div>
        </div>
    )
    return (
        <>
            {contextHolder}
            {modalAddView}

            <div className='w-100 d-flex justify-content-end align-items-center mb-3'>
                {addBtn}
                {/* <button className='btn border ml-2 btn-outline-primary border-primary px-3 py-2' onClick={() => setModalVisible(true)} style={{ fontSize: '14px', background: '' }} >Add New Category</button> */}
            </div>
            

            <div className='d-flex flex-wrap mb-5' style={{ rowGap: "10px" }}>
                <div className='col-sm-12 col-md-auto px-0 mx-0'>
                    <Select
                        showSearch
                        placeholder="Select a Category"
                        optionFilterProp="children"
                        dropdownMatchSelectWidth={false}
                        
                        
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input?.toLowerCase())
                        }
                        
                        value={category.slug}
                        style={{ width: "f" }}
                        size="large"
                        className="w-100"
                        options={[{ value: category.slug, label: category.name }]}
                    />
                </div>
                <div className='col-sm-12 col-md-auto px-0 mx-0'>
                    {/* loading */}
                    <Search placeholder="Search product" onChange={onChange}  className="w-100" style={{ minWidth: "300px" }} onSearch={onSearch} enterButton size="large" />
                </div>
                <div className='ml-auto'>
                    <Select
                        showSearch
                        placeholder="Sort By"
                        optionFilterProp="children"
                        value={sortOption}
                        onChange={handleSortChange}
                        
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        size="large"
                        className="w-100"
                        options={sortBY}
                    />
                </div>
                <button className='btn border ml-2 btn-success' onClick={submitHandler}>Save</button>
            </div >
            {/* Products */}

            <div className='row'>
                <div className='col-6 col-md-8'>
                    <div className='d-flex flex-wrap' >
                        {
                            searchedData ?  searchedData?.map((item, i) => (
                                <div key={i} className=' d-flex justify-content-start align-items-start  border p-1 pl-2  mb-2 mr-2 bg-white rounded pr-2' style={{ maxWidth: "230px", minWidth:'230px' }}>
                                    <div className='w-100 d-flex flex-column justify-content-start align-items-start pt-2 h-100 p-md-0 p-1'>
                                        <h6 className='m-0 p-0'>{item.title}</h6>
                                        <div className="price text-danger " style={{ fontSize: "12px", color: "#a3a3a3" }}><span className='text-primary'>Adv. Amount</span>  Rs. {item?.DisplayAmount}</div>
                                        <input type="checkbox"
                                            onChange={() => handleCheckboxChange(item)}
                                            checked={selectedItems.some((selectedItem) => selectedItem.productID === item.productID)}
                                            style={{ width: "15px", height: "15px" }} className="mt-auto ml-auto" />
                                    </div>
                                </div>
                            )) : <LoadingSpinner/>
                        
                        }
                    </div>
                </div>
                <div className='col-6 col-md-4 border-left'>
                    {/* Form Input */}

                    {/* {category.slug !== "deal-of-the-day" &&<Upload
                        accept="image/*"
                        multiple={false}
                        action=""
                        listType="picture"
                        maxCount={1}
                        fileList={image}
                        onChange={imageUploadHandler}
                        showUploadList={{
                            showPreviewIcon: true,
                            // showRemoveIcon: true,
                            showDownloadIcon: false,
                            // removeIcon: <DeleteOutlined onClick={(e) => imageHandleRemove(e)} />,
                        }}
                    >
                        {image.length < 1 && <Button icon={<UploadOutlined />}>Upload</Button>}
                    </Upload>}
 */}

                    <Input placeholder="Title " className='mt-4' value={category?.name}/>


                    <h4 className='mt-4'>Selected Items({selectedItems.length})</h4>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="selectedItemsDroppable">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className='d-flex flex-column mw-100 overflow-auto w-100'
                                >
                                    {selectedItems.map((item, index) => (
                                        
                                        <Draggable
                                            key={item?.productID?.toString()}
                                            draggableId={item?.productID?.toString()}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className='d-flex justify-content-start align-items-start border p-1 pl-2 mb-2 mr-2 bg-white rounded pr-2'

                                                >
                                                    <div className='w-100 d-flex flex-column justify-content-start align-items-start pt-2 h-100'>
                                                        <h6 className='m-0 p-0 text-left'>{`${index+1}. ${item.title}`}</h6>
                                                        <div className="price text-danger " style={{ fontSize: "12px", color: "#a3a3a3" }}>
                                                            <span className='text-primary'>Adv. Amount</span> Rs. {item.DisplayAmount}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            checked
                                                            onChange={() => handleCheckboxChange(item)}
                                                            style={{ width: "15px", height: "15px" }}
                                                            className="mt-auto ml-auto"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>


                </div>

            </div >


        </>
    )
}

export default ModuleHomeCategories