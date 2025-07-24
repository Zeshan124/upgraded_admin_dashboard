import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import TableCategoryItems from "~/components/shared/tables/TableCategoryItems";
import Pagination from "~/components/elements/basic/Pagination";
import FormCreateCategory from "~/components/shared/forms/FormCreateCategory";
import FormSearchSimple from "~/components/shared/forms/FormSearchSimple";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { Select } from "antd";
import useSWR from "swr";
import { fetchAllCategories } from "~/api/categoryService";
import { toTitleCase } from "~/util";
import { fetchAllSubCategories } from "~/api/subCategoryService";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
const { Option } = Select;

const CategoriesPage = () => {
  const [addCategory, setAddCategory] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  return (
    <ContainerDefault>
      <HeaderDashboard
        title="Categories"
        description="QistBazaar Category Listing"
      />
      <ErrorBoundary>
        <div className="d-flex justify-content-end">
          <button
            className={`ml-auto ps-btn ${addCategory ? "ps-btn--gray" : "success"} px-4 mb-3 mb-md-0`}
            style={{ fontSize: "1.3rem" }}
            onClick={() => setAddCategory((prev) => !prev)}
          >
            {addCategory && "Hide"} Add Category
          </button>
        </div>
        <section className="ps-dashboard ps-items-listing">
          <div className="ps-section__left">
            <div className="ps-section__header ml-auto">
              {/* <div className="pl-2">
                <FormSearchSimple />
              </div> */}
            </div>

            <div className="ps-section__content">
              <TableCategoryItems />
              {/* <div className="ps-section__footer">
                <p>Show 5 in 30 items.</p>
                <Pagination />
              </div> */}
            </div>
          </div>
          {addCategory && (
            <div className="right-sided">
              <FormCreateCategory />
            </div>
          )}
        </section>
      </ErrorBoundary>
    </ContainerDefault>
  );
};

export default connect((state) => state.app)(CategoriesPage);
