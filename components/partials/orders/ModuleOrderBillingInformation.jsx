import React from 'react';
import { toTitleCase } from '~/util';



// const orders = [
//     {
//         address: "Hussainabad, Hyderabad",
//         area: "Hussainabad",
//         city: "Hyderabad",
//         cnic: "4130497879741",
//         creditCheck: "Express", //
//         discountTotal: 1000, //
//         email: "abrobilal135@gmail.com",
//         ipAddress: "12345678901",
//         name: "Bilal Sohail",
//         orderID: 12,
//         orderStatus: "Processing", //
//         phoneNo: "03223930381",
//         productNames: "Washing Machine, Washing Machine", //
//         totalAmount: 29000 //
//     },
// ];
const ModuleOrderBillingInformation = ({ creditCheck, discountTotal, orderStatus, productNames, totalAmount }) => {
    return (
        <div className="ps-card ps-card--order-information ps-card--small">
            <div className="ps-card__header">
                <h4>Order Information</h4>
            </div>
            <div className="ps-card__content">
                <p>
                    <strong>Credit Check:</strong> {creditCheck}
                </p>
                <p>
                    <strong>Discount Total:</strong> {discountTotal}
                </p>
                <p >
                    <strong>Order Status:</strong> <span style={{color:' blue', padding:'5px'}}>{toTitleCase(orderStatus)}</span>
                </p>
                <p>
                    <strong>TotalDealValue:</strong> {totalAmount}
                </p>
            </div>
        </div>
    );
};

export default ModuleOrderBillingInformation;
