import React, { useEffect } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import Pagination from "~/components/elements/basic/Pagination";
import TableCustomerItems from "~/components/shared/tables/TableCustomerItems";
import FormSearchSimple from "~/components/shared/forms/FormSearchSimple";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import TableCouponItems from "~/components/shared/tables/TableCouponItems";
import Link from "next/link";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";

const CouponPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  return (
    <ContainerDefault title="Coupon">
      <HeaderDashboard title="Coupon" description="QistBazaar Coupon Listing" />
      <ErrorBoundary>
        <section className="ps-items-listing">
          <div className="ps-section__header simple">
            <div className="ps-section__filter">
              <FormSearchSimple />
            </div>
            <div className="ps-section__actions">
              <Link href="/coupon/create-coupon">
                <span className="ps-btn success" href="#">
                  <i className="icon icon-plus mr-2"></i>Add Coupon
                </span>
              </Link>
            </div>
          </div>
          <div className="ps-section__content">
            <TableCouponItems />
          </div>
          {/* <div className="ps-section__footer">
            <p>Show 10 in 30 items.</p>
            <Pagination />
          </div> */}
        </section>
      </ErrorBoundary>
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(CouponPage);
