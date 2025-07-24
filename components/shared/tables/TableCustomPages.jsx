import { Dropdown, Menu } from 'antd';

import React from 'react';
import useSWR from 'swr';

import ErrorBoundary from '~/components/utils/ErrorBoundary';
import Link from 'next/link'
import { fetchAllPages } from '~/services/PagesServices';
import LoadingSpinner from "../UI/LoadingSpinner";
const TableCustomPagesItems = () => {
  
    const { data: pageItems, error, isLoading} = useSWR(
        '/page/get',
        fetchAllPages);

    // console.log(pageItems)
    const menuView = (item)=>(
        <Menu>
            <Menu.Item key={0}>

                <Link href={`/custom-pages/edit/${item?.slug}`}>
                    <span className="dropdown-item" href="#">
                        <i className="icon-pencil mr-2"></i>
                        Edit
                    </span>
                </Link>
            </Menu.Item>
        </Menu>
    )

  
    if (error) return <div>{error.message || error || "Error loading data"}</div>;
    if (isLoading) return <LoadingSpinner />;
    const tableItemsView = pageItems?.length > 0 ? pageItems?.map((item, index) => {
        return (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.index}</td>
                <td>
                    <strong>{item?.name}</strong>
                </td>
                <td>
                    <strong>{item?.slug}</strong>
                </td>
                <td>
                    <Dropdown overlay={menuView(item)} className="ps-dropdown">
                        <a className="ps-dropdown__toggle">
                            <i className="icon-ellipsis"></i>
                        </a>
                    </Dropdown>
                    
                </td>
            </tr>
        );
    }) : <div>No data available</div>;
    return (
        <ErrorBoundary>
           

            <div className="table-responsive">
                <table className="table ps-table">
                    <thead>
                        <tr>
                            <th>S.NO</th>
                            <th>Index</th>
                            <th>Name</th>
                            <th>Slug</th>

                    
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>{tableItemsView}</tbody>
                </table>
            </div>
           
        </ErrorBoundary>



    );
};

export default TableCustomPagesItems;
