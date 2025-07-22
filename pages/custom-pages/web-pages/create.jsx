import React, { useEffect } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
// import TableCustomerItems from "~/components/shared/tables/TableCustomerItems";
// import FormSearchSimple from "~/components/shared/forms/FormSearchSimple";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { Select } from "antd";

import FormWebPage from '~/components/shared/forms/FormWebPage'
const { Option } = Select;


const CreateWebPagesPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(toggleDrawerMenu(false));
    }, []);
    return (
        <ContainerDefault title="Web Pages">
            <HeaderDashboard title="Web Pages" description="QistBazaar Website Pages" />

            <FormWebPage />
        </ContainerDefault>
    );
};
export default connect((state) => state.app)(CreateWebPagesPage);
