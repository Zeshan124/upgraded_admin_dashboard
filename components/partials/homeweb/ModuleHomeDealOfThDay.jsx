import React, { useState } from 'react'
import { Select } from 'antd';
import { Input, Space } from 'antd';
const { Search } = Input;
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getImageURL, placeHolderImage } from "~/util";
const DummyCategories = [
    {
        value: 'Haier',
        label: 'Haier',
    },
    {
        value: 'Dawlence',
        label: 'Dawlence',
    },
    {
        value: 'Pel',
        label: 'Pel',
    },
]
const DummyProduct = [
    {
        productId: 1,
        title: "Samsung A04s1 | 4GB-128GB | Limited Time Offer",
        price: "23,200",
        displayImage: "https://qistbazaar.pk/wp-content/uploads/2023/11/Redmi-12-C.jpg",
    },
    {
        productId: 2,
        title: "Samsung A04s2 | 4GB-128GB | Limited Time Offer",
        price: "23,200",
        displayImage: "https://qistbazaar.pk/wp-content/uploads/2023/11/Redmi-12-C.jpg",
    },
    {
        productId: 3,
        title: "Samsung A04s3 | 4GB-128GB | Limited Time Offer",
        price: "23,200",
        displayImage: "https://qistbazaar.pk/wp-content/uploads/2023/11/Redmi-12-C.jpg",
    },
    {
        productId: 4,
        title: "Samsung A04s4 | 4GB-128GB | Limited Time Offer",
        price: "23,200",
        displayImage: "https://qistbazaar.pk/wp-content/uploads/2023/11/Redmi-12-C.jpg",
    },
    {
        productId: 5,
        title: "Samsung A04s5 | 4GB-128GB | Limited Time Offer",
        price: "23,200",
        displayImage: "https://qistbazaar.pk/wp-content/uploads/2023/11/Redmi-12-C.jpg",
    },
]
const ModuleHomeDealOfThDay = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const onChange = (value) => {
        // console.log(`selected ${value}`);
    };

    const onSearch = (value) => {
        // console.log('search:', value);
    };

    const handleCheckboxChange = (item) => {
        const selectedItemIndex = selectedItems.findIndex((selectedItem) => selectedItem.productId === item.productId);

        if (selectedItemIndex === -1) {
            //inserting
            setSelectedItems([...selectedItems, item]);
        } else {
            //removing
            const updatedItems = [...selectedItems];
            updatedItems.splice(selectedItemIndex, 1);
            setSelectedItems(updatedItems);
        }
    };
    const onImageError = (e) => {
        e.target.src = placeHolderImage
    }
    const onDragEnd = (result) => {
        if (!result.destination) return; // dropped outside the list

        const items = [...selectedItems];
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setSelectedItems(items);
    };
    return (
        <>
            <div className='d-flex flex-wrap mb-5'>
                <div className='col-sm-12 col-md-auto px-0 mx-0'>
                    <Select
                        showSearch
                        placeholder="Select a Category"
                        optionFilterProp="children"
                        dropdownMatchSelectWidth={false}
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }

                        style={{ width: "f" }}
                        size="large"
                        className="w-100"
                        options={DummyCategories}
                    />
                </div>
                <div className='col-sm-12 col-md-auto px-0 mx-0'>
                    <Select
                        showSearch
                        placeholder="Select a Sub Category"
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        size="large"
                        className="w-100"
                        options={DummyCategories}
                    />
                </div>
                <div className='col-sm-12 col-md-auto px-0 mx-0'>
                    {/* loading */}
                    <Search placeholder="input search product" className="w-100" style={{ minWidth: "300px" }} onSearch={onSearch} enterButton size="large" />
                </div>
                <div className='ml-auto'>
                    <Select
                        showSearch
                        placeholder="Sort By"
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        size="large"
                        className="w-100"
                        options={DummyCategories}
                    />
                </div>
                <button className='btn border ml-2 btn-success'>Save</button>
            </div >
            <div className='row'>
                <div className='col-6 col-md-8'>
                    <div className='d-flex flex-wrap' >
                        {
                            DummyProduct.map((item, i) => (
                                <div key={i} className='d-flex justify-content-center align-items-start shadow p-1 mb-2 mr-2 bg-white rounded pr-2' style={{ maxWidth: "280px" }}>
                                    <img style={{ maxHeight: "70px", maxWidth: "70px" }} onError={onImageError} className="d-none d-md-block object-fit mr-2" src={item.displayImage} alt="XYZ" />
                                    <div className='d-flex flex-column justify-content-start align-items-start pt-2 h-100 p-md-0 p-1'>
                                        <h6 className='m-0 p-0'>{item.title}</h6>
                                        <div className="price text-danger " style={{ fontSize: "12px", color: "#a3a3a3" }}><span className='text-primary'>Adv. Amount</span>  ${item.price}</div>
                                        <input type="checkbox"
                                            onChange={() => handleCheckboxChange(item)}
                                            checked={selectedItems.some((selectedItem) => selectedItem.productId === item.productId)}
                                            style={{ width: "15px", height: "15px" }} className="mt-auto ml-auto" />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='col-6 col-md-4 border-left'>
                    <h4>Selected Items</h4>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="selectedItems">
                            {(provided, snapshot) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className='selectedItems d-flex flex-column w-100'>
                                    {
                                        selectedItems.map((item, index) => {
                                            return (
                                                <Draggable key={item.productId.toString()} draggableId={item.productId.toString()} index={index}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='prevent-select d-flex justify-content-center px-2 align-items-start shadow p-1 mb-2 mr-2 bg-white rounded'>
                                                            <div className='d-flex flex-column justify-content-start align-items-start pt-2 h-100'>
                                                                <h6 className='m-0 p-0'>{item.title}</h6>
                                                                <div className="price text-danger " style={{ fontSize: "12px", color: "#a3a3a3" }}><span className='text-primary'>Adv. Amount</span>  $85.99</div>
                                                                <input type="checkbox" checked
                                                                    onChange={() => handleCheckboxChange(item)} style={{ width: "15px", height: "15px" }} className="mt-auto ml-auto" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                    {provided.placeholder}
                                </div>
                            )}</Droppable>
                    </DragDropContext>
                </div>

            </div>


        </>
    )
}

export default ModuleHomeDealOfThDay