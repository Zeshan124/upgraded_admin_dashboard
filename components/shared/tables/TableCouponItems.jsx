import React, { useState } from 'react';
import { Modal } from 'antd';
import useSWR from 'swr';
import { deleteCoupon, getAllCoupons } from '~/api/couponService';
import { useRouter } from 'next/router';
import ErrorBoundary from '~/components/utils/ErrorBoundary';
import useMessageHandler from '~/components/hooks/useMessageHandler';
import { formatDate } from '~/util';
import LoadingSpinner from '../UI/LoadingSpinner';
import DropdownAction from '~/components/elements/basic/DropdownAction';
import ModuleCouponDetailedView from '~/components/partials/coupon/ModuleCouponDetailedView';

const TableCouponItems = ({ coupon: initialCoupon }) => {
    const router = useRouter();
    const { data: couponData, error, isLoading, mutate } = useSWR('/coupon/get', getAllCoupons, {
        initialData: initialCoupon,
        revalidateOnFocus: false,
    });

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { showSuccess, showError, contextHolder } = useMessageHandler();

    const dateFormat = (value) => new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const showModal = (item) => {
        const { expiryDate, startDate, createdBy, modifiedBy, createdAt, modifiedAt, ...rest } = item;

        const modifiedItem = {
            ...rest,
            expiryDate: dateFormat(expiryDate),
            startDate: dateFormat(startDate),
            createdBy,
            modifiedBy,
            createdAt: dateFormat(createdAt),
            modifiedAt: dateFormat(modifiedAt),
        };

        setSelectedItem(modifiedItem);
        setIsModalVisible(true);
    };


    const handleOk = () => setIsModalVisible(false);
    const handleCancel = () => setIsModalVisible(false);

    const couponEditHandler = (code) => router.push(`/coupon/${code}/edit-coupon`);

    const couponDeleteHandler = async (couponID) => {
        try {
            const newData = couponData && couponData?.filter((item) => item.couponID !== couponID);
            await mutate(newData, false);
            const response = await deleteCoupon(couponID);
            if (response.status === 200) {
                showSuccess(response.data.message || 'Successfully Deleted');
            }
        } catch (error) {
            showError(error.message || 'Error Deleting');
        }
    };

    if (error) return <div>Error Fetching Data</div>;
    if (isLoading || !couponData) return <LoadingSpinner />;

    const tableItemsView = couponData && couponData?.map((item, index) => (
        <tr key={index}>
            <td>{item.couponID}</td>
            <td>
                <span className="ps-badge success" onClick={() => showModal(item)}>
                    {item?.couponCode}
                </span>
            </td>
            <td>
                <strong>{item?.limitused}</strong>
            </td>
            <td>{item?.usedInOrder}</td>
            <td>{item?.appliedTo}</td>
            <td>{formatDate(item?.expiryDate)}</td>
            <td>
                <DropdownAction
                    deleteHandler={() => couponDeleteHandler(item?.couponID)}
                    editHandler={() => couponEditHandler(item?.couponCode)}
                />
            </td>
        </tr>
    ));

    return (
        <ErrorBoundary>
            {contextHolder}
            <div className="table-responsive">
                <table className="table ps-table">
                    <thead>
                        <tr>
                            <th>Coupon ID</th>
                            <th>Coupon Code</th>
                            <th>Limit Used</th>
                            <th>Used In Order</th>
                            <th>Applied To</th>
                            <th>Expiry Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>{tableItemsView}</tbody>
                </table>
                <Modal title="Coupon Details" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    {selectedItem && <ModuleCouponDetailedView coupon={selectedItem} />}
                </Modal>
            </div>
        </ErrorBoundary>
    );
};

export default TableCouponItems;

export async function getServerSideProps() {
    try {
        const couponData = await getAllCoupons();
        return {
            props: {
                coupon: couponData,
            },
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            props: {
                coupon: [],
            },
        };
    }
}
