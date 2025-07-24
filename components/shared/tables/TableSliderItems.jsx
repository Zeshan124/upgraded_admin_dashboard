import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { deleteSlider, fetchSliders } from '~/services/sliderService';
import { getImageURL, placeHolderImage } from "~/util";
import LoadingSpinner from '../UI/LoadingSpinner';
import useMessageHandler from '~/components/hooks/useMessageHandler';
import DeleteButton from '../UI/DeleteButton';
import { Modal } from 'antd';
import FormUpdateSlider from '../forms/Edit/FormUpdateSlider';


const errorImage = "https://via.placeholder.com/150";

const TableSliderItems = ({ slider: initialSlider=[] }) => {
    const { showSuccess, showError, contextHolder } = useMessageHandler();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editData, setEditData] = useState(null);
    const { data: sliderData, error, isLoading, mutate } = useSWR(
        '/slider/get',
        fetchSliders,
        { initialData: initialSlider },
        {
            revalidateOnFocus: true,
        }
    );
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (sliderData) {
            setImages(sliderData);
        }
    }, [sliderData]);

    const showModal = (item) => {
        setEditData(item);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleDelete = async (sliderID) => {

        try {
            const updatedSliderData = images.filter((img) => img.sliderID !== sliderID);
            await mutate(updatedSliderData, false);
            const response = await deleteSlider(sliderID);
            if (response.status === 200) {
                showSuccess(response.data.message || "Successfully Deleted.");
            }
        } catch (error) {
            showError(error.message || 'Error Deleting Item');
        }
    };
    const onImageError = (e) => {
        e.target.src = placeHolderImage
    }

    if (error) return <div>Error loading data</div>;
    if (isLoading || !sliderData) return <LoadingSpinner />;
    const editModal = (
        <Modal
            title="Update Slider"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
        >
            {editData && <FormUpdateSlider data={editData} onCancel={handleCancel} mutate={mutate}/>}
            {/* <FormCreateSlider onCancel={handleCancel} /> */}

        </Modal>
    )
    return (
        <>
            {editModal}
            {contextHolder}
            <div className="table-responsive">
                <table className="table ps-table">
                    <thead>
                        <tr>
                            <th>Web Image</th>
                            <th>Mobile Image</th>
                            <th>Order Position</th>
                            <th>URL</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {images && images?.map((item, index) => (
                            <tr key={index}>
                                {/* Image */}
                                <td>
                                    <img
                                        src={item.sliderImagePath ? getImageURL(item?.sliderImagePath) : errorImage}
                                        style={{ objectFit: "cover", width: "250px", height: "100px" }}
                                        alt={`upload-${index}`}
                                        onError={onImageError}
                                    />
                                </td>
                                {/* API-KEY */}
                                <td>
                                    <img
                                        src={item.sliderImagePath ? getImageURL(item?.mobSlider) : errorImage}
                                        style={{ objectFit: "cover", width: "250px", height: "100px" }}
                                        alt={`upload-${index}`}
                                        onError={onImageError}
                                    />
                                </td>
                                {/* URL ORDER */}
                                <td>
                                    {item?.order_position || "NULL"}
                                </td>
                                {/* URL input */}
                                <td style={{ maxWidth: "200px" }}>
                                    <a href={item?.sliderurl || "#"}>{item?.sliderurl || "No URL"}</a>
                                </td>
                                {/* Actions */}
                                <td className='d-flex justify-content-center' >
                                    <li className="list-inline-item" onClick={() => (showModal(item))}>
                                        <button className="btn btn-success btn-lg rounded-0" style={{ fontSize: "14px" }} type="button" data-toggle="tooltip" data-placement="top" title="Edit">
                                            <i className="fa fa-edit"></i>
                                        </button>
                                    </li>

                                    <DeleteButton
                                        title="Are you sure to delete this item?"
                                        onConfirm={() => handleDelete(item.sliderID)}
                                    >
                                        <button
                                            className="btn btn-danger btn-lg rounded-0" style={{ fontSize: "14px" }} type="button"
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </DeleteButton>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

// export async function getServerSideProps() {
//     try {
//         const sliderData = await fetchSliders();
//         return {
//             props: {
//                 slider: sliderData,
//             },
//         };
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return {
//             props: {
//                 slider: [],
//             },
//         };
//     }
// }

export default TableSliderItems;
