import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";

import TableCustomerItems from "~/components/shared/tables/TableCustomerItems";
import FormSearchSimple from "~/components/shared/forms/FormSearchSimple";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch, useSelector } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { Select, Pagination } from "antd";
import Link from "next/link";
const { Option } = Select;

import useSWR from "swr";
import { getAllUsersPagination, searchUser } from "~/services/userService";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import LoadingSpinner from "~/components/shared/UI/LoadingSpinner";
import useSearch from "~/components/hooks/useSearch";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [pageIndex, setPageIndex] = useState(1);
  const {
    data: userData,
    error,
    isLoading,
    mutate,
  } = useSWR(`?_start=${pageIndex}&_limit=15`, (url) =>
    getAllUsersPagination(url, token)
  );
  const [totalItems, setTotalItems] = useState(
    userData ? userData.totalUser : 2000
  ); //change

  const itemsPerPage = 15;

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const { searchKeyword, setSearchKeyword, searchedData, handleSearch } =
    useSearch(searchUser, token);
  const uniqueRoles = userData && [
    ...new Set(userData?.data?.map((item) => item.role)),
  ];

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));

    if (userData) {
      setTotalItems(userData?.totalUser);
    }
  }, [userData]);
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const handlePaginationChange = (page, pageSize) => {
    setPageIndex(page);
  };

  let displayData = searchKeyword.trim() !== "" ? searchedData : userData?.data;
  const itemsEnd =
    pageIndex * itemsPerPage < totalItems
      ? pageIndex * itemsPerPage
      : totalItems;

  return (
    <ContainerDefault title="Users">
      <HeaderDashboard title="Users" description="QistBazaar Users Listing" />
      {isLoading && <LoadingSpinner />}
      {error && <div>{error || error.message || "Error Message"}</div>}
      {userData && (
        <ErrorBoundary>
          <section className="ps-items-listing">
            <div className="ps-section__header simple">
              <div className="ps-section__filter">
                <form
                  className="ps-form--filter"
                  action="index.html"
                  method="get"
                >
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
                        {
                          uniqueRoles.map((role, index) => (
                            <Option value={role} key={index}>{toTitleCase(role)}</Option>
                          ))
                        }

                      </Select> */}
                    {/* </div> */}
                  </div>
                  {/* <div className="ps-form__right">
                    <button className="ps-btn ps-btn--gray">
                      <i className="icon icon-funnel mr-2"></i>
                      Filter
                    </button>
                  </div> */}
                </form>
              </div>
              <div className="ps-section__actions">
                <Link href={`/users/create-user`}>
                  <span className="ps-btn success">
                    <i className="icon icon-plus mr-2"></i>New User
                  </span>
                </Link>
              </div>
            </div>
            {/* Display the searched user data */}
            {
              <div className="ps-section__content">
                <TableCustomerItems userData={displayData} mutate={mutate} />
              </div>
            }
            {/* <div className="ps-section__content">
            <TableCustomerItems userData={userData} mutate={mutate} />
          </div> */}
            <div className="ps-section__footer">
              <p>
                Showing from {(pageIndex - 1) * itemsPerPage} to {itemsEnd}{" "}
                items of {totalItems} Total items.
              </p>
              <Pagination
                defaultCurrent={1}
                total={totalItems}
                current={pageIndex}
                pageSize={itemsPerPage}
                onChange={handlePaginationChange}
                showSizeChanger={false}
              />
            </div>
          </section>
        </ErrorBoundary>
      )}
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(UsersPage);
