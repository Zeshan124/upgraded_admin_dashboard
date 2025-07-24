import React, { useEffect, useState } from "react";
import useSWR from 'swr';
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { Select } from "antd";


import ContainerDefault from "~/components/layouts/ContainerDefault";
import { Pagination } from 'antd';

import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";


import { status, toTitleCase } from "~/util";



import ErrorBoundary from "~/components/utils/ErrorBoundary";
import LoadingSpinner from "~/components/shared/UI/LoadingSpinner";
import { fetchStores } from "~/services/storeService";
import TableStoreItems from "~/components/shared/tables/TableStoreItems";

const { Option } = Select;


const VendorStoresPage = () => {
    const [storeStatus, setStoreStatus] = useState(null);
    const itemsPerPage = 15;  
    const [pageIndex, setPageIndex] = useState(1);
    const query = storeStatus === null ?
        `/get?_start=${pageIndex}&_limit=${itemsPerPage}` :
        `/get?_start=${pageIndex}&_limit=${itemsPerPage}&status=${storeStatus}`;
    const { data: stores, error, isLoading, mutate } = useSWR(query,fetchStores);
    const [totalItems, setTotalItems] = useState(0);//change

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(toggleDrawerMenu(false));
    }, []);
    useEffect(() => {
        if (stores) {
            setTotalItems(stores?.totalStore || 0);
        }
    }, [stores]);
    const handlePaginationChange = (page) => {
        setPageIndex(page);
    };

    
    const handleChange = (value) => {
        setStoreStatus(value);
        setPageIndex(1); 
    };

    // if (error) return <div>Error Fetching Data</div>;
    if (isLoading) return <LoadingSpinner />;
    const itemsEnd = Math.min(pageIndex * itemsPerPage, totalItems);
    const itemsStart = (pageIndex - 1) * itemsPerPage + 1;
    return (
        <ContainerDefault>
            <HeaderDashboard
                title="Stores"
                description="QistBazaar Stores Listing"
            />
            <ErrorBoundary>
                <section className="ps-dashboard ps-items-listing">
                    <div className="ps-section__left pr-0">
                        <div className="ps-section__header">
                            <div className="pl-2">
                                {/* <FormSearchSimple /> */}
                            </div>
                            <div className="pb-3 pl-2" style={{ maxWidth: "365px" }}>
                                <Select
                                    placeholder="Select City"
                                    className="ps-ant-dropdown"
                                    listItemHeight={20}
                                    onChange={handleChange}
                                    value={storeStatus}
                                >
                                    {status.map((item) => (
                                        <Option key={item.value} value={item.value}>
                                            {toTitleCase(item.label)}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        {error&&<div>Error Fetching Data</div>}
                        <div className="ps-section__content">
                            <TableStoreItems storeData={stores?.data} mutate={mutate}/>
                            
                        </div>
                        <div className="ps-section__footer">
                            <p>Showing {itemsStart} to {itemsEnd} of {totalItems} items.</p>
                            <Pagination
                                defaultCurrent={1}
                                total={totalItems}
                                current={pageIndex}
                                pageSize={itemsPerPage}
                                onChange={handlePaginationChange}
                                showSizeChanger={false}
                            />
                        </div>
                    </div>

                </section>
            </ErrorBoundary>
        </ContainerDefault>
    );
};



export default connect((state) => state.app)(VendorStoresPage);
