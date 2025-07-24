import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import TableOrdersItems from "~/components/shared/tables/TableOrdersItems";
// import Pagination from "~/components/elements/basic/Pagination";
import { Select, Pagination } from "antd";
// import Link from "next/link";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { getAllOrdersPaginate, searchOrder } from "~/api/orderService";
// import useSWR from 'swr';
import useSearch from "~/components/hooks/useSearch";
import LoadingSpinner from "~/components/shared/UI/LoadingSpinner";
import FormExportOrder from "~/components/shared/forms/FormExportOrder";



const { Option } = Select;
const OrdersPage = ({ orders: initialOrder }) => {
  const itemsPerPage = 15;
  const [pageIndex, setPageIndex] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [orderItems, setOrderItems] = useState(initialOrder);
  const { searchKeyword, setSearchKeyword, searchedData, handleSearch, } = useSearch(searchOrder);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(initialOrder?.totalOrders);

  useEffect(() => {
    setisLoading(true);
    async function fetchData() {
      try {
        const data = await getAllOrdersPaginate(pageIndex, itemsPerPage);

        setOrderItems(data.data);
        setTotalItems(data.totalOrders);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error)
      }
      setisLoading(false);
    }
    fetchData();
  }, [pageIndex]);


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const handlePaginationChange = (page, pageSize) => {

    setPageIndex(page);
  };
  const showModal = () => {
    setModalOpen(true)
  };



  const itemsEnd = (pageIndex * itemsPerPage) < totalItems ? (pageIndex * itemsPerPage) : totalItems;
  const toDisplay = searchKeyword.trim() !== "" ? searchedData : orderItems;
  if (error) return <div>Error</div>
  if (isLoading) return <LoadingSpinner/>
  if (!orderItems) return <LoadingSpinner />
  return (
    <ContainerDefault>
      <HeaderDashboard title="Orders" description="QistBazaar Orders Listing" />
      
      <section className="ps-items-listing">
        <div className="ps-section__header simple">
          <div className="ps-section__filter">
            <form className="ps-form--filter" action="index.html" method="get">
              <div className="ps-form__left">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onBlur={() => handleSearch(searchKeyword)}
                  />
                </div>
                {/* <div className="form-group">
                  <Select
                    placeholder="Status"
                    className="ps-ant-dropdown"
                    listItemHeight={20}
                  >
                    <Option value="active">Active</Option>
                    <Option value="in-active">InActive</Option>
                  </Select>
                </div>
              </div>
              <div className="ps-form__right">
                <button className="ps-btn ps-btn--gray">
                  <i className="icon icon-funnel mr-2"></i>
                  Filter
                </button>
              </div> */}
              </div>
            </form>
          </div>
           <div className="ps-section__actions"> 
            {/* <Link href="/products/create-product">
              <a className="ps-btn success">
                <i className="icon icon-plus mr-2"></i>New Order
              </a>
            </Link> */}
            <div className="ps-btn ps-btn success" onClick={showModal}>
              <i className="icon icon-download2 mr-2"></i>Export
            </div>
            {modalOpen && <FormExportOrder open={modalOpen} setOpen={setModalOpen} />}
          </div>
        </div>
        <div className="ps-section__content">
          <TableOrdersItems orderItems={toDisplay} />
        </div>
        <div className="ps-section__footer">
          <p>Showing from {(pageIndex - 1) * itemsPerPage} to {itemsEnd} items of {totalItems} Total items.</p>
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


// export async function getStaticProps() {
//   try {
//     const ordersData = await getAllOrdersPaginate(1, 15);
//     // Check if ordersData is undefined or if ordersData.data is undefined
//     if (!ordersData || !ordersData.data) {
//       // Return null or an empty array to ensure all values are serializable
//       return { props: { orders: [] } }; // Using an empty array for consistency
//     }
//     return {
//       props: {
//         orders: ordersData.data,
//       },
//       revalidate: 1, // Consider adding this if your data updates periodically
//     };
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return {
//       props: {
//         orders: [],
//       },
//     };
//   }
// }


export default connect((state) => state.app)(OrdersPage);
