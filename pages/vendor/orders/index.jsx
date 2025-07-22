import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";


import { Select, Pagination } from "antd";

import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";


import LoadingSpinner from "~/components/shared/UI/LoadingSpinner";

import moment from "moment";
import DateRangePicker from "~/components/elements/basic/DateRangePicker";
import { serializeQuery } from "~/repositories/Repository";
import {  getAllStores, getStoreOrders } from "~/api/storeService";
import useSWR from "swr";
import TableStoreOrdersItems from "~/components/shared/tables/TableStoreOrdersItems";
import { toTitleCase } from "~/util";

const { Option } = Select;
const statusOfOrder = [{ label: 'Vendor Delivered', value: 'vendorDelivered', },{
    label: 'Confirm Delivered', value: 'confirmDelivered',
},
]

const OrdersPage = () => {
    const itemsPerPage = 15;
    const [pageIndex, setPageIndex] = useState(1);
    const [status, setStatus] = useState(statusOfOrder[0].value)
    const [store, setStore] = useState()
    const [dates, setDates] = useState({
        startDate: moment().subtract(7, 'days'),
        endDate: moment()
    });
    const startDateFormatted = moment(dates.startDate).format('YYYY-MM-DD');
    const endDateFormatted = moment(dates.endDate).format('YYYY-MM-DD');
    const dispatch = useDispatch();

    const query =serializeQuery({
        startDate: startDateFormatted, endDate: endDateFormatted, _start: pageIndex, _limit: 15, orderStatus:status,
        ...(store && { storeUrl: store })
    })
    const { data, error, isLoading, mutate } = useSWR(query, getStoreOrders);
    const { data: stores } = useSWR(`/store/get/web`, getAllStores);
    console.log(stores, 'getAllStores')
    useEffect(() => {
        dispatch(toggleDrawerMenu(false));
    }, [dispatch]);

    const handlePaginationChange = (page) => {
        setPageIndex(page);
    };

    const onDateRangeChange = (startDate, endDate) => {
        setDates({
            startDate: moment(startDate).startOf('day').toDate(),
            endDate: moment(endDate).endOf('day').toDate(),
        });
        setPageIndex(1); // Reset to the first page on date range change
    };

    const totalItems = data?.totalOrders || data?.length ||0;
    const itemsEnd = Math.min(pageIndex * itemsPerPage, totalItems);
    const itemsStart = (pageIndex - 1) * itemsPerPage + 1;
    console.log(data, 'data')
    if (error) return <div>Error fetching orders</div>;
 
    return (
        <ContainerDefault>
            <HeaderDashboard title="Orders" description="QistBazaar Orders Listing" />
            <section className="ps-items-listing">
                <div className="ps-section__header simple">
                    <Select
                        placeholder="Select Status"
                        className="ps-ant-dropdown"
                        value={status}
                        onChange={(value) => setStatus(value)}
                    >
                        {statusOfOrder.map((item) => (
                            <Option key={item.value} value={item.value}>
                                {toTitleCase(item.label)} 
                            </Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Select Store"
                        className="ps-ant-dropdown d-flex justify-content-end"
                        value={store}
                        onChange={(value) => setStore(value)}
                    >
                        {stores?.data?.map((item) => (
                            <Option key={item.shopUrl} value={item.shopUrl}>
                                {toTitleCase(item.ShopName)}
                            </Option>
                        ))}
                    </Select>
                    <div className="d-flex justify-content-end">
                        <DateRangePicker onDateRangeChange={onDateRangeChange} />
                    </div>
                </div>
                {(isLoading) ? <LoadingSpinner />:<div className="ps-section__content">
                    <TableStoreOrdersItems data={data?.data} mutate={mutate} />
                </div>}
                <div className="ps-section__footer">
                    <p>Showing {itemsStart} to {itemsEnd} of {totalItems} items.</p>
                    <Pagination
                        defaultCurrent={1}
                        total={totalItems}
                        current={pageIndex}
                        pageSize={itemsPerPage}
                        onChange={handlePaginationChange}
                    />
                </div>
            </section>
        </ContainerDefault>
    );
};



export default connect((state) => state.app)(OrdersPage);
