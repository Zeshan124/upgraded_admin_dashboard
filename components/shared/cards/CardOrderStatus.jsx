import React from "react";
import useSWR from "swr";

import { fetchOrderStatusWise } from "../../../services/OMSService";

const determineClassAndIcon = (difference) => {
    // Parse the percentage value
    const diffValue = parseFloat(difference?.replace('%', ''));
    if (diffValue < 0) {
        return { className: "desc", icon: "icon-arrow-down" };
    } else {
        return { className: "asc", icon: "icon-arrow-up" };
    }
};
const fetcher = async ([url, startDate, endDate]) => {
    return await fetchOrderStatusWise(startDate, endDate);
};
const CardOrderStatus = ({startDate, endDate}) => {
    const { data: items, error } = useSWR(['/order/branch-order', startDate, endDate], fetcher);
    // console.log(items,'items----')
    const orderStatus = items?.current;
    const differences = items?.differences;

    const data = {
        pending_count: {
            icon: 'icon-warning',
            title: 'Pending',
            value: orderStatus?.pending_count?.toLocaleString(),
            difference: differences?.pending_count_difference,
            colorClass: 'yellowish',
        },
        on_hold_count: {
            icon: 'icon-stop-circle',
            title: 'On Hold',
            value: orderStatus?.on_hold_count?.toLocaleString(),
            difference: differences?.on_hold_count_difference,
            colorClass: 'yellowish',
        },
        phone_verified_count: {
            icon: 'icon-phone-plus icon-cash-dollar',
            title: 'Phone Verified',
            value: orderStatus?.phone_verified_count?.toLocaleString(),
            difference: differences?.phone_verified_count_difference,
            colorClass: 'green',
        },
        site_verified_count: {
            icon: 'icon-home6',
            title: 'Site Verified',
            value: orderStatus?.site_verified_count?.toLocaleString(),
            difference: differences?.site_verified_count_difference,
            colorClass: 'green',
        },
        complaint_count: {
            icon: 'icon-bookmark2',
            title: 'Complaint',
            value: orderStatus?.complaint_count?.toLocaleString(),
            difference: differences?.complaint_count_difference,
            colorClass: 'pink',
        },
        rejected_count: {
            icon: 'icon-cross',
            title: 'Rejected',
            value: orderStatus?.rejected_count?.toLocaleString(),
            difference: differences?.rejected_count_difference,
            colorClass: 'pink',
        },
        selfDelivered_count: {
            icon: 'icon-bus',
            title: 'Self Delivered',
            value: orderStatus?.selfDelivered_count?.toLocaleString(),
            difference: differences?.selfDelivered_count_difference,
            colorClass: 'green',
        },
        tcsUpload_count: {
            icon: 'icon-bus',
            title: 'TCS',
            value: orderStatus?.tcsUpload_count?.toLocaleString(),
            difference: differences?.tcsUpload_count_difference,
            colorClass: 'green',
        },
        total_orders_count: {
            icon: 'icon-equalizer',
            title: 'Total Orders',
            value: orderStatus?.total_orders_count?.toLocaleString(),
            difference: differences?.total_orders_count_difference,
            colorClass: 'yellow',
        },
    };


    return (
        <section className="ps-card ps-card--statics">
            <h4>Order Status Summary </h4>
         
           
            <div className="ps-card__content">
                {Object.keys(data).map((key) => {
                    const item = data[key];
                    const { className, icon } = determineClassAndIcon(item.difference);

                    return (
                        <div key={key} className={`ps-block--stat ${item.colorClass}`}>
                            <div className="ps-block__left">
                                <span>
                                    <i className={item.icon}></i>
                                </span>
                            </div>
                            <div className="ps-block__content">
                                <p>{item.title || "Loading..."}</p>
                                <h4>
                                    {item.value || "..."}
                                    <small className={className}>
                                        <i className={icon}></i>
                                        <span>{item.difference || "0%"}</span>
                                    </small>
                                </h4>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default CardOrderStatus;
