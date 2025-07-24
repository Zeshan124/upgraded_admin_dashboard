import React, { useEffect, useState } from 'react';
import { formatDate, toTitleCase } from '~/util';
import DropdownAction from '~/components/elements/basic/DropdownAction';
import { Modal, Select } from 'antd';
import { deleteArea, fetchAllAreas, updateArea } from '~/services/areaService';
import useSWR from 'swr';
import useMessageHandler from '~/components/hooks/useMessageHandler';
import ErrorBoundary from '~/components/utils/ErrorBoundary';
import LoadingSpinner from '../UI/LoadingSpinner';

const { Option } = Select;





const EditAreaModal = ({ selectedItem, isEditModalVisible, handleOk, handleCancel, cityData, setSelectedItem }) => (
    <Modal
        title="Edit Modal"
        visible={isEditModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
    >
        <div className="form-group">
            <label htmlFor="exampleFormControlSelect1">Area Name</label>
            <input
                type="text"
                className="form-control"
                value={selectedItem.areaName}
                onChange={(e) => setSelectedItem(prevState => ({ ...prevState, areaName: e.target.value }))}
            />
        </div>
        <div className="form-group">
            <label htmlFor="exampleFormControlSelect1">Select City</label>
            <Select
                placeholder="Select City"
                className="ps-ant-dropdown"
                listItemHeight={20}
                onChange={(value) => setSelectedItem(prevState => ({ ...prevState, cityID: value }))}
                value={selectedItem.cityID}
            >
                <Option value="">Select City</Option>
                {cityData?.map((item) => (
                    <Option value={item?.cityID} key={item?.cityID}>
                        {toTitleCase(item?.cityName)}
                    </Option>
                ))}
            </Select>
        </div>
    </Modal>
);





//Main
const TableAreaItems = ({ initialAreas=[], cityData=[], selectedCity }) => {
    const { data: areas, error: areaDataError, isLoading: isLoadingAreaData, mutate } = useSWR(
        '/areas/get',
        fetchAllAreas,
        { initialData: initialAreas },
    );

    const [filteredAreas, setFilteredAreas] = useState([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const { showSuccess, showError, contextHolder } = useMessageHandler();

    useEffect(() => {
        if (areas) {
            const filtered = areas ? areas.filter((area) => area.cityID === selectedCity) : [];
            setFilteredAreas(filtered);
        }
    }, [areas, selectedCity]);

    const showModal = (item) => {
        setSelectedItem({ ...item });
        setIsEditModalVisible(true);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleDelete = async (item) => {
        try {
            const newAreaData = areas.filter((area) => area.areaID !== item.areaID);
            await mutate(newAreaData, false);
            const response = await deleteArea(item.areaID.toString());
            if (response.status === 200) {
                showSuccess(response.data.message || "Deleted Successfully");
            }
        } catch (error) {
            showError(error.message || "Error Deleting Data");
            console.error('Error deleting area:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const updatedAreas = areas.map((area) => (area.areaID === selectedItem.areaID ? { ...area, ...selectedItem } : area));
            await mutate(updatedAreas, false);
            const response = await updateArea(selectedItem);
            if (response.status === 200) {
                showSuccess(response.data.message || "Successfully Inserted");
            }
            setIsEditModalVisible(false);
        } catch (error) {
            showError(error.message || "Error Updating Data");
            console.error('Error updating area:', error);
        }
    };

    if (areaDataError) return <div>Error Fetching Data</div>;
    if (isLoadingAreaData || !areas) return <LoadingSpinner />;

    return (
        <>
            <ErrorBoundary>
                {contextHolder}
                <EditAreaModal
                    selectedItem={selectedItem}
                    isEditModalVisible={isEditModalVisible}
                    handleOk={handleUpdate}
                    handleCancel={handleCancel}
                    cityData={cityData}
                    setSelectedItem={setSelectedItem}
                />

                <div className="table-responsive">
                    <table className="table ps-table">
                        <thead>
                            <tr>
                                <th>Area name</th>
                                <th>createdBy</th>
                                <th>Modified at</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAreas?.map((item, i) => (
                                <tr key={i}>
                                    <td><strong>{toTitleCase(item?.areaName)}</strong></td>
                                    <td>{JSON.stringify(item?.createdBy)}</td>
                                    <td>{formatDate(item?.modifiedAt)}</td>
                                    <td>
                                        <DropdownAction
                                            deleteHandler={() => handleDelete(item)}
                                            editHandler={() => showModal(item)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ErrorBoundary>
        </>
    );
};

export default TableAreaItems
// export async function getStaticProps() {
//     try {
//         const areasData = await fetchAllAreas();
//         return {
//             props: {
//                 areas: areasData,
//             },
//         };
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return {
//             props: {
//                 areas: [],
//             },
//         };
//     }
// }