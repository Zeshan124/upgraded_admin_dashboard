import React, { useEffect, useState } from "react";
import { Tabs, Modal, Select } from "antd";
import { connect, useDispatch } from "react-redux";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { toggleDrawerMenu } from "~/store/app/action";

import ModuleHomeDealOfThDay from "~/components/partials/homeweb/ModuleHomeDealOfThDay";
import ModuleHomeCategories from "~/components/partials/homeweb/ModuleHomeCategories";

import TableSliderItems from "~/components/shared/tables/TableSliderItems";
import FormCreateSlider from "~/components/shared/forms/FormCreateSlider";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import { getCategoryById } from "~/services/categoryService";
import { fetchProductFeatureCategories } from "~/services/productService";
import LoadingSpinner from "~/components/shared/UI/LoadingSpinner";
import useSWR from "swr";
import useCategories from "~/components/hooks/useCategories";
import useMessageHandler from "~/components/hooks/useMessageHandler";
import { addProductFeature } from "~/services/productService";

const HomePage = () => {
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    "/api/product-feature/categories",
    fetchProductFeatureCategories
  );

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <ContainerDefault title="Website Home Edit">
      <HeaderDashboard title="Home Editor" description="Home Editor" />
      {/* <section className="ps-items-listing"> */}

      <div className="header" style={{ marginTop: "-30px" }}>
        <ErrorBoundary>
          <Tabs defaultActiveKey="1">
            {/* ---------------------------------------- */}
            <Tabs.TabPane tab="Slider Images" key="1">
              <div
                className="card rounded mx-1 mb-1 ml-auto"
                style={{ maxWidth: "200px" }}
                onClick={showModal}
              >
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <i className="icon-plus primary font-large-2 float-left"></i>
                    </div>
                    <div className="media-body text-center">
                      <span role="button">Upload Slider Image</span>
                    </div>
                  </div>
                </div>
              </div>

              <TableSliderItems />
              <Modal
                title="Create Slider"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
              >
                <FormCreateSlider onCancel={handleCancel} />
              </Modal>
            </Tabs.TabPane>
            {/* ---------------------------------------- */}
            {/* <Tabs.TabPane tab="Deal of the Day" key="2">
              <ModuleHomeDealOfThDay />
            </Tabs.TabPane> */}
            {/* {!data && <LoadingSpinner />} */}
            {/* ---------------------------------------- */}
            <Tabs.TabPane tab="Home Categories" key="3">
              <Tabs
                tabPosition={"left"}
                items={data?.map((item, i) => {
                  return {
                    label: `${i + 1}. ${item.categoryDetail[0].name}`,
                    key: item.categoryID,
                    children: (
                      <ModuleHomeCategories
                        category={item.categoryDetail[0]}
                        mutate={mutate}
                      />
                    ),
                  };
                })}
              />
            </Tabs.TabPane>
            {/* ---------------------------------------- */}
          </Tabs>
        </ErrorBoundary>
      </div>

      {/* </section> */}
    </ContainerDefault>
  );
};

export default connect((state) => state.app)(HomePage);
