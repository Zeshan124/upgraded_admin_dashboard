import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetchOrdersReport } from "~/api/orderService";
import moment from "moment";
import { Space, DatePicker } from "antd";
import { CreditCheckCount } from "~/api/analyticsService";
import { toTitleCase } from "~/util";
const { RangePicker } = DatePicker;

const fetcher = async ([startDate, endDate, previousStartDate,previousEndDate,]) =>
  await fetchOrdersReport(startDate, endDate, previousStartDate,previousEndDate);

const CardStatics = ({ startDate, endDate, compareDates,
  compareEnabled  }) => {
  const {
    data: orderReport,
    error,
    isLoading,
  } = useSWR(
    [startDate, endDate, compareDates?.compareStartDate, compareDates?.compareEndDate],
    fetcher
  );
  console.log(error, startDate, endDate, compareDates?.compareStartDate, compareDates?.compareEndDate,'duck u' )
  if (error) return <div>Failed to load</div>;
  const determineClassAndIcon = (difference) => {
    const diffValue = parseFloat(difference?.replace("%", ""));
    if (diffValue < 0) {
      return { className: "desc", icon: "icon-arrow-down" };
    } else {
      return { className: "asc", icon: "icon-arrow-up" };
    }
  };
    const data = {
      callCenterOrders: {
        icon: 'icon-phone-plus', title: <>Call Center <span className="d-none d-sm-inline">Orders</span> </>, value: orderReport?.current?.callCenterOrders?.toLocaleString(), colorClass: 'yellow' },
        branchOrders: { icon: 'icon-home6', title: 'Branch Orders', value: orderReport?.current?.branchOrders?.toLocaleString(), colorClass: 'yellowish' },
        SEOorders: { icon: 'icon-magnifier', title: 'SEO Orders', value: orderReport?.current?.SEOorders?.toLocaleString(), colorClass: 'green' },
        paidOrders: { icon: 'icon-cash-dollar', title: 'Paid Orders', value: orderReport?.current?.paidOrders?.toLocaleString(), colorClass: 'green' },
        directOrders: { icon: 'icon-user', title: 'Direct Orders', value: orderReport?.current?.directOrders?.toLocaleString(), colorClass: 'green' },
        otherOrders: { icon: 'icon-user', title: 'Other Orders', value: orderReport?.current?.otherOrders?.toLocaleString(), colorClass: 'green' },
        deletedOrders: { icon: 'icon-trash', title: 'Deleted Orders', value: orderReport?.current?.deletedOrders?.toLocaleString(), colorClass: 'yellowish' },
        totalOrderCount: { icon: 'icon-cart', title: 'Total Orders', value: orderReport?.current?.totalOrderCount?.toLocaleString(), colorClass: 'pink' },
    }

  return (
    <section className="ps-card ps-card--statics">
      <h2 className='text-section'>Website & Mobile App</h2>
      <h4>Order Count</h4>

      {/* {!orderReport && <div>Loading...</div>} */}

      <div className="ps-card__content">
        {Object.keys(data)?.map((key) => {
          const currentValue = orderReport?.current?.[key];
          const difference = orderReport?.differences[key];
          const previousValue = orderReport?.previous?.[key];
          const { className, icon } = determineClassAndIcon(difference);
          const item = data[key];
          return (
            <div className={`ps-block--stat  ${item?.colorClass}`}>
              <div className="ps-block__left">
                <span>
                  <i className={item?.icon}></i>
                </span>
              </div>
              <div className="ps-block__content">
                <p className="text-nowrap">{item?.title || "Loading..."}</p>
                <h4>
                  {currentValue?.toLocaleString() ?? "-"}
                  <small className={className}>
                    <i className={icon}></i>
                    <span>{difference || "00"}</span>
                  </small>
                </h4>
                {compareEnabled && previousValue && (
                <div className="stat-prev-container">
      
                    <div className="stat-previous">
                      <span className="prev-label">Previous:</span>
                      <span className="prev-value">
                        {previousValue?.toLocaleString() || "-"}
                      </span>
                    </div>
               
                </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CardStatics;
