import React, { useEffect, useState } from 'react';
import ContainerDefault from '~/components/layouts/ContainerDefault';
import ModuleOrderShippingInformation from '~/components/partials/orders/ModuleOrderShippingInformation';
import ModuleOrderBillingInformation from '~/components/partials/orders/ModuleOrderBillingInformation';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';
import { connect, useDispatch } from 'react-redux';
import { toggleDrawerMenu } from '~/store/app/action';
import useSWR from "swr";
import { useRouter } from 'next/router';
import { getOrderById } from '~/services/orderService';
import LoadingSpinner from '~/components/shared/UI/LoadingSpinner';

// const orders = [
//   {
//     address: "Hussainabad, Hyderabad",
//     area: "Hussainabad",
//     city: "Hyderabad",
//     cnic: "4130497879741",
//     creditCheck: "Express",
//     discountTotal: 1000,
//     email: "abrobilal135@gmail.com",
//     ipAddress: "12345678901",
//     name: "Bilal Sohail",
//     orderID: 12,
//     orderStatus: "Processing",
//     phoneNo: "03223930381",
//     productNames: "Washing Machine, Washing Machine",
//     totalAmount: 29000
//   },
// ];
const OrderDetailPage = () => {
  const { query } = useRouter();

  const url = `/orders/getbyid/`;
  const [orderID, setOrderID] = useState();

  useEffect(() => {
    if (query?.oid) {
      setOrderID(query?.oid)
    }
  }, [query?.oid]);
  const { data: orderItem, error, isLoading} = useSWR(orderID ? url : null,
    orderID ? () => getOrderById(orderID) : null);


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);
  if (isLoading) return <LoadingSpinner/>
  if(error) return <div> {error.message || "Error"}</div>
  return (

    <ContainerDefault title="Order Detail">
      <HeaderDashboard
        title="Order Detail"
        description="Qistbazaar Order Detail"
      />
      <section className="ps-dashboard">
        <div className="ps-section__left">
          <div className="row">
            <div className="col-md-6">
              <ModuleOrderShippingInformation {...orderItem} />
            </div>
            <div className="col-md-6">
              <ModuleOrderBillingInformation {...orderItem} />
            </div>

          </div>
          <div className="ps-card ps-card--track-order">
            <div className="ps-card__header">
              <h4>#{orderItem?.orderID}</h4>
            </div>
            <div className="ps-card__content">
              <div className="table-responsive">
                <table className="table ps-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Monthly</th>
                      <th>No.of Months</th>
                      <th>Advance Amount</th>

                    </tr>
                  </thead>
                  <tbody>
                    {<tr>
                      <td>
                        <a href="#">
                          {orderItem?.productNames}
                        </a>
                      </td>
                      <td>{orderItem?.installmentAmount}</td>
                      <td>{orderItem?.month}</td>
                      <td>{orderItem?.advanceAmount}</td>
                    </tr>}

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="ps-section__right">
          <div className="ps-card ps-card--track-order">
            <div className="ps-card__header">
              <h4>Track Order</h4>
            </div>
            <div className="ps-card__content">
              <div className="ps-block--track-order">
                <div className="ps-block__header">
                  <div className="row">
                    <div className="col-6">
                      <figure>
                        <figcaption>Order ID:</figcaption>
                        <p>#ABD-235711</p>
                      </figure>
                    </div>
                    <div className="col-6">
                      <figure>
                        <figcaption>Tracking ID:</figcaption>
                        <p>21191818abs1</p>
                      </figure>
                    </div>
                  </div>
                </div>
                <div className="ps-block__content">
                  <div className="ps-block__timeline">
                    <figure className="active">
                      <figcaption>Order Placed</figcaption>
                      <p>
                        Sep 19, 2020 <small>7:00am</small>
                      </p>
                    </figure>
                    <figure className="active">
                      <figcaption>Packed</figcaption>
                      <p>
                        Sep 19, 2020 <small>10:00am</small>
                      </p>
                    </figure>
                    <figure className="active">
                      <figcaption>Shipped</figcaption>
                      <p>
                        Sep 19, 2020 <small>4:00pm</small>
                      </p>
                    </figure>
                    <figure>
                      <figcaption>Delivered</figcaption>
                      <p>Estimated delivery within 1 day</p>
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </section>
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(OrderDetailPage);
