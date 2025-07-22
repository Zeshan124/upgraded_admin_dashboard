import React from 'react'
import Link from "next/link";
import { Menu } from "antd";
import DropdownAction from "~/components/elements/basic/DropdownAction";

const TablePermissionItems = () => {
    const orderItems = [
        {
            tableName: "Customer",
            add: true,
            delete: true,
            update: true,
            view: false,
        },
        {
            tableName: "Customer",
            add: true,
            delete: true,
            update: true,
            view: false,
        },
        {
            tableName: "Customer",
            add: true,
            delete: true,
            update: true,
            view: false,
        },
        {
            tableName: "Customer",
            add: true,
            delete: true,
            update: true,
            view: false,
        },
    ];


    const tableItemsView = orderItems?.map((item, index) => {
        return (
            <tr key={item?.tableName} className='align-center'>
                <td>#{index + 1}</td>
                <td>{item?.tableName}</td>
                <td><input className=" py-0 my-0 " checked={item?.Add} type="checkbox" value="" style={{ height: "18px", width: "18px" }} id="flexCheckDefault" /></td>
                <td><input className=" py-0 my-0 " checked={item?.delete} type="checkbox" value="" style={{ height: "18px", width: "18px" }} id="flexCheckDefault" /></td>
                <td><input className=" py-0 my-0 " checked={item?.update} type="checkbox" value="" style={{ height: "18px", width: "18px" }} id="flexCheckDefault" /></td >
                <td><input className=" py-0 my-0 " checked={item?.view} type="checkbox" value="" style={{ height: "18px", width: "18px" }} id="flexCheckDefault" /></td >
                <td><button type="button" className="btn mr-md-2 mb-md-0 mb-2 btn-success d-block text-center">Save</button></td>
            </tr >
        );
    });
    return (
        <div className="table-responsive">
            <table className="table ps-table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Table</th>
                        <th>Add</th>
                        <th>Delete</th>
                        <th>Update</th>
                        <th>View</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{tableItemsView}</tbody>
            </table>
        </div>
    );
}

export default TablePermissionItems