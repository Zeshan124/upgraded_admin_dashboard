import React,{useState} from "react";
import { Select } from 'antd';

const CardTotalBranchesPortalOrders = ({ data }) => {
    // console.log('data', data)
    const [filter, setFilter] = useState('total_orders_count');

    // Custom sorting function: 'digital' branches on top, then by selected filter value
    const sortedData = data
        ?.slice()
        .sort((a, b) => {
            const isADigital = a.branchName?.toLowerCase().includes("digital");
            const isBDigital = b.branchName?.toLowerCase().includes("digital");

            // Sort 'digital' branches on top
            if (isADigital && !isBDigital) return -1;
            if (!isADigital && isBDigital) return 1;

            // No sorting for the rest
            return 0;
        });

    // Total Orders Calculation based on the selected filter
    const totalOrders = sortedData?.reduce((acc, item) => acc + (item[filter] || 0), 0);

    const handleChange = (value) => {
        setFilter(value);
    };


    return (
        <section className="ps-card ps-card--statics ">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h4>Orders/Branch</h4>
                <Select
                    defaultValue="total_orders_count"
                    style={{ width: 100 }}
                    onChange={handleChange}
                    options={[
                        { value: 'total_orders_count', label: 'All' },
                        { value: 'openOrder', label: 'Open' },
                        { value: 'unOpenOrder', label: 'Unopen' },
                    ]}
                />
            </div>
            

            <div className="ps-card__content flexi-card">
                {sortedData &&
                    sortedData.map((item, i) => {
                        return (
                            <div
                                key={item.branchName} // Adding key prop
                                className={`ps-block--stat ${i % 2 === 0 ? "yellow" : "green"}`}
                            >
                                <div className="ps-block__left">
                                    <span>
                                        <i className="icon-home6"></i>
                                    </span>
                                </div>
                                <div className="ps-block__content">
                                    <p className="textie">{item.branchName || "Loading..."}</p>
                                    <h4>{item[filter] || "0"}</h4>
                                </div>
                            </div>
                        );
                    })}
                    
                <div className="ps-block--stat pink ">
                    <div className="ps-block__left">
                        <span>
                            <i className="icon-home6"></i>
                        </span>
                    </div>
                    <div className="ps-block__content">
                        <p className="textie">Total Orders</p>
                        <h4>{totalOrders || "0"} </h4>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CardTotalBranchesPortalOrders;
