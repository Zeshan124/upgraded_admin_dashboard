import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import TableBlogAndPress from "~/components/shared/tables/TableBlogAndPress";
import { Select } from "antd";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import Link from "next/link";

const WebPagesPage = () => {
  const dispatch = useDispatch();
  const [blog, setBlog] = useState(1);
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);
  const handleChange = (value) => {
    setBlog(value);
    // console.log(`selected ${value}`);
  };
  return (
    <ContainerDefault title="Web Pages">
      <HeaderDashboard
        title="Blog & Press Pages"
        description="QistBazaar Blog & Press Pages"
      />
      <section className="ps-items-listing">
        <div className="ps-section__header simple">
          <div className="ps-section__filter">
            <form className="ps-form--filter" action="index.html" method="get">
              <div className="ps-form__left"></div>
              <div className="ps-form__right"></div>
            </form>
          </div>

          <div className="ps-section__actions">
            <Select
              className="ps-ant-dropdown"
              listItemHeight={20}
              style={{
                width: 120,
                marginRight: "12px",
                height: "40px",
              }}
              value={blog}
              onChange={handleChange}
              options={[
                {
                  value: 1,
                  label: "Blog",
                },
                {
                  value: 0,
                  label: "Press",
                },
              ]}
            />
            <Link href="/blog-and-press/create">
              <span className="ps-btn success">
                <i className="icon icon-plus mr-2"></i>New Page
              </span>
            </Link>
          </div>
        </div>
        <div className="ps-section__content">
          <TableBlogAndPress blog={blog} />
        </div>
      </section>
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(WebPagesPage);
