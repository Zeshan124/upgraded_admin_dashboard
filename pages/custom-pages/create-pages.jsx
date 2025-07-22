import React, { useEffect } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import Pagination from "~/components/elements/basic/Pagination";
// import TableCustomerItems from "~/components/shared/tables/TableCustomerItems";
// import FormSearchSimple from "~/components/shared/forms/FormSearchSimple";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { Select } from "antd";
import Link from "next/link";
import FormPage from '~/components/shared/forms/FormPage'
const { Option } = Select;


const CustomPagesPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(toggleDrawerMenu(false));
    }, []);
    return (
        <ContainerDefault title="Custom Pages">
            <HeaderDashboard title="Create Page" description="QistBazaar Create Custom Pages" />

            <FormPage />
        </ContainerDefault>
    );
};
export default connect((state) => state.app)(CustomPagesPage);
