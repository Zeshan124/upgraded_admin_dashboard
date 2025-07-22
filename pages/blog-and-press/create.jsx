import React, { useEffect } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";

import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { Select } from "antd";

import FormBlogPress from "~/components/shared/forms/FormBlogPress";
const { Option } = Select;

const CreateWebPagesPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);
  return (
    <ContainerDefault title="Web Pages">
      <HeaderDashboard
        title="Blog and Press"
        description="QistBazaar Website Blog and Press"
      />

      <FormBlogPress />
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(CreateWebPagesPage);
