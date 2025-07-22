import React from 'react';
import useSWR from 'swr';
// import './ExpoStatusCard.scss';
import { fetchExpodetails } from "~/api/OMSService";
export default function ExpoRecords({ startDate, endDate }) {

  // const data = null
  const { data, error, isLoading } = useSWR(
    ["/pre-approved/expo-status", startDate, endDate],
    () => fetchExpodetails(startDate, endDate)
  );
  

  if (isLoading) return <div className="text-center p-4">Loading expo data...</div>;
  if (error) return <div className="text-center text-danger p-4">Error loading data</div>;
  console.log(data,'data')
  // intial data for preview - until client sie fetching occurs
  const expoData =  data?.data || {
    productDeliveredCount: "...",
    productDeliveredAmount: "...",
    bookingCount: "...",
    bookingAmount: "..."
  };

  const {
    productDeliveredCount,
    productDeliveredAmount,
    productDeliveredDealValue,
    bookingCount,
    bookingAmount,
    bookingDealAmount
  } = expoData;

  const totalCount = productDeliveredCount + bookingCount;
  const totalAmount = productDeliveredAmount + bookingAmount;

  // Function to format currency
  const formatCurrency = (amount) => {
    return  amount.toLocaleString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  if (productDeliveredCount === 0 && bookingCount===0){
    return null
  }

  return (
    <div className="container py-4">
      <div className="expo-card">

        <div className="card-body py-2">
          <div className="row">
            {/* First Column - Delivery Stats */}
            <div className="col-md-6 pr-sm-1 pr-0 pl-0 mb-2 mb-sm-0">
              <div className="stats-group delivery-stats">
                <div className="stats-icon">
                  <i className="fa fa-gift"></i>
                </div>
                <div className="stats-data">
                  <h6>Product Delivered</h6>
                  <div className="data-row">
                    <div className="data-item">
                      <span className="data-value">{productDeliveredCount}</span>
                      <span className="data-label">Count</span>
                    </div>

                    <div className="data-item">
                      <span className="data-value">{formatCurrency(productDeliveredAmount)}</span>
                      <span className="data-label">Advance</span>
                    </div>
                    <div className="data-item">
                      <span className="data-value">{formatCurrency(productDeliveredDealValue)}</span>
                      <span className="data-label">Deal Amount</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Second Column - Booking Stats */}
            <div className="col-md-6 pl-sm-1 pl-0 pr-0 align-items-center">
              <div className="stats-group booking-stats">
                <div className="stats-icon">
                  <i className="fa fa-calendar-check-o"></i>
                </div>
                <div className="stats-data">
                  <h6>Bookings</h6>
                  <div className="data-row">
                    <div className="data-item">
                      <span className="data-value">{bookingCount}</span>
                      <span className="data-label">Count</span>
                    </div>
                    <div className="data-item">
                      <span className="data-value">{formatCurrency(bookingAmount)}</span>
                      <span className="data-label">Amount</span>
                    </div>
                    <div className="data-item">
                      <span className="data-value">{formatCurrency(bookingDealAmount)}</span>
                      <span className="data-label">Deal Amount</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer flex justify-content-between">
          <h1 className='heading mb-0'>Expo 2025</h1>
          <div className="total-stats">
            <div className="total-item">
              <span className="total-label">Total Count:</span>
              <span className="total-value">{totalCount}</span>
            </div>
            <div className="total-item">
              <span className="total-label">Received Amt:</span>
              <span className="total-value">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}