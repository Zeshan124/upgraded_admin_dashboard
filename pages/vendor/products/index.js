import React, { useEffect, useState } from "react";
import useSWR from 'swr';
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { Select } from "antd";


import ContainerDefault from "~/components/layouts/ContainerDefault";
import { Pagination } from 'antd';

import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import LoadingSpinner from "~/components/shared/UI/LoadingSpinner";
import TableVendorProductItems from "~/components/shared/tables/TableVendorProductItems";
import CardTabs from "~/components/shared/UI/CardTabs";
import { serializeQuery } from "~/repositories/Repository";
import { getStoresProducts, getStoresProductsCount } from "~/api/storeService";
import { status, toTitleCase } from "~/util";
const { Option } = Select;


const VendorProductPage = () => {
  const dispatch = useDispatch();
  const [storeStatus, setStoreStatus] = useState('1');
  const [pageIndex, setPageIndex] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStore, setSelectedStore] = useState(null);
  const itemsPerPage = 15;

  const storesCountQuery = useSWR(
    "/store-products/counts",
    getStoresProductsCount
  );
  const { data: storesCount } = storesCountQuery;

  const query = serializeQuery({
    _start: pageIndex,
    _limit: itemsPerPage,
    slug: selectedStore,
    status: storeStatus,
  });
  const storesProductsQuery = useSWR(query, getStoresProducts);
  const {data: storesProducts,error,isLoading,mutate,} = storesProductsQuery;

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);
  console.log(storesProducts, "storesProducts?.data");
  useEffect(() => {
    if (storesCount)
      setSelectedStore(storesCount?.data?.data[0]?.shopUrl || null);
  }, [storesCount]);

  useEffect(() => {
    if (storesProducts) setTotalItems(storesProducts?.data?.totalItems || 0);
  }, [storesProducts]);



  const handleStoreChange = (value) => {
    setSelectedStore(value);
    setPageIndex(1);
  };

  const handleStatusChange = (value) => {
    setStoreStatus(value);
    setPageIndex(1);
  };
  const handlePaginationChange = (page) => setPageIndex(page);

  //  const handleTabClick = () => {}
   if (error) return <div>Error Fetching Data</div>;
  

   const itemsEnd = Math.min(pageIndex * itemsPerPage, totalItems);
   const itemsStart = (pageIndex - 1) * itemsPerPage + 1;
  return (
    <ContainerDefault>
      <HeaderDashboard
        title="Stores Products"
        description="QistBazaar Stores Products Listing"
      />
      <ErrorBoundary>
        <section className="ps-dashboard ps-items-listing">
          <div className="ps-section__left pr-0">
            <div className="ps-section__header">
              <div className="pl-2">{/* <FormSearchSimple /> */}</div>
              <Select
                placeholder="Select Store"
                className="ps-ant-dropdown"
                value={selectedStore}
                onChange={handleStoreChange}
                showSearch
                filterOption={(input, option) => {
                  // Fixed for Ant Design 4 - access children instead of label
                  return option.children
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase());
                }}
              >
                {storesCount?.data?.data?.map((item) => (
                  <Option key={item.shopUrl} value={item.shopUrl}>
                    {toTitleCase(item.ShopName)} ({item.productCount})
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Select Status"
                className="ps-ant-dropdown ml-2"
                value={storeStatus}
                onChange={handleStatusChange}
              >
                {status.slice(0, -1).map((item) => (
                  <Option key={item.value} value={item.value}>
                    {toTitleCase(item.label)}
                  </Option>
                ))}
              </Select>
            </div>
            {(!isLoading || storesProducts) && (
              <div className="ps-section__content">
                <TableVendorProductItems
                  data={storesProducts?.data?.data || []}
                  mutate={mutate}
                />
              </div>
            )}
            {(isLoading || !storesProducts) && <LoadingSpinner />}
            <div className="ps-section__footer">
              <p>
                Showing {itemsStart} to {itemsEnd} of {totalItems} items.
              </p>
              <Pagination
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



export default connect((state) => state.app)(VendorProductPage);
