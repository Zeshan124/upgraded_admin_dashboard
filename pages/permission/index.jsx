import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { Select } from "antd";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import Pagination from "~/components/elements/basic/Pagination";
import FormSearchSimple from "~/components/shared/forms/FormSearchSimple";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import TablePermissionItems from "~/components/shared/tables/TablePermissionItems";
const { Option } = Select;

const RolePage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);
  return (
    <ContainerDefault title="Role/RB Permissions">
      <HeaderDashboard
        title="Permissions"
        description="Permissions Listing"
      />
      <section className="ps-items-listing">
        <div className="ps-section__header simple">
          <div className="ps-section__filter">
            <FormSearchSimple />
          </div>
          <div className="ps-section__actions">
            <a className="ps-btn success px-4" href="#">
              <i className="icon icon-plus mr-2 "></i>Add Role
            </a>
            <a className="ps-btn success px-4" href="#">
              <i className="icon icon-plus mr-2"></i>Add Permission
            </a>
            <Select
              placeholder="Select Role"
              className="ps-ant-dropdown"
              listItemHeight={20}
              style={{ maxWidth: "130px" }}
            >
              <Option value="clothing-and-apparel">
                Admin
              </Option>
              <Option value="garden-and-kitchen">Shop Manager</Option>
            </Select>
          </div>

        </div>
        <div className="ps-section__content">
          <TablePermissionItems />
        </div>
        <div className="ps-section__footer">
          <p>Show 10 in 30 items.</p>
          <Pagination />
        </div>
      </section>
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(RolePage);
