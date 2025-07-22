import React from "react";
import { toTitleCase } from '~/util'
const ModuleOrderShippingInformation = ({ name, address, area, city, cnic, email, phoneNo }) => {
  return (
    <div className="ps-card ps-card--order-information ps-card--small">
      <div className="ps-card__header">
        <h4>Personal Information</h4>
      </div>
      <div className="ps-card__content">
        <h5>{toTitleCase(name)}</h5>
        <p>
          <strong>Address:</strong> {address}
        </p>
        <p>
          <strong>Area:</strong> {toTitleCase(area)}
        </p>
        <p>
          <strong>City:</strong>{toTitleCase( city )}
        </p>
        <p>
          <strong>Phone No.:</strong> {phoneNo}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>CNIC:</strong> {cnic}
        </p>
      </div>
    </div>
  );
};

export default ModuleOrderShippingInformation;
