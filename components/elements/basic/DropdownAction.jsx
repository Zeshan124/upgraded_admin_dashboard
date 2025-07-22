import React, { useState } from "react";
import { Dropdown, Menu, } from "antd";
import Link from "next/link";
import DeleteButton from "~/components/shared/UI/DeleteButton";
import ErrorBoundary from "~/components/utils/ErrorBoundary";

const DropdownAction = ({ deleteHandler = () => { }, editHandler = () => { } }) => {

    const menuView = () => (
        <Menu>
            <Menu.Item key={0}>
                <button className="dropdown-item" href="#" onClick={editHandler}>
                    <i className="icon-pencil mr-2"></i>
                    Edit
                </button>
            </Menu.Item>
            <Menu.Item key={1}>
                <DeleteButton
                    title="Are you sure you want to delete?"
                    onConfirm={deleteHandler}
                >   <span className="dropdown-item">
                        <i className="icon-trash2 mr-2"></i>
                        Delete
                    </span>
                </DeleteButton>

            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <ErrorBoundary>
                <Dropdown overlay={menuView} className="ps-dropdown">
                    <span className="ps-dropdown__toggle">
                        <i className="icon-ellipsis"></i>
                    </span>
                </Dropdown>
            </ErrorBoundary>
        </>
    );
};

export default DropdownAction;
