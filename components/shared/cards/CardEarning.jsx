import React, { useState,useMemo } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import moment from 'moment';
import useSWR from 'swr';
import { OrderSource } from '~/services/analyticsService';
import { DatePicker, Space } from 'antd';
import ChangeInValuesPercent from '~/components/elements/basic/ChangeInValuesPercent';
const { RangePicker } = DatePicker;

const fetcher = async (start, end) => {
    const response = await OrderSource(start, end);
    return response[0]
}
const CardEarning = ({ startDate , endDate, compareDates, compareEnabled }) => {

    const { data: orderSources, error: orderSourcesError } = useSWR(['/api/order-source', startDate, endDate], () => fetcher(startDate, endDate));
     const { compareStartDate, compareEndDate } = compareDates || {};
    const { data: compareData } = useSWR(
        compareEnabled ? ['/api/order-source-compare', compareStartDate, compareEndDate] : null,
        () => compareEnabled ? fetcher(compareStartDate, compareEndDate)   :null
    );
    console.log(orderSources, 'orderSources');

    const chartData = useMemo(() => {
        const data = orderSources || { WebOrders: 0, MobileOrders: 0, AppOrders: 0 };
       return{ 
        series: [data?.WebOrders || 1, data?.MobileOrders|| 0, data?.AppOrders|| 0],
        options: {
            chart: {
                height: 500,
                type: 'donut',
            },
            dataLabels: {enabled: true},

            legend: {show: false, },
            tooltip: { enabled: false},
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: '100%',
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        },
    }}, [orderSources])

   
    
    return (
        <div className="ps-card ps-card--earning">
            <div className="ps-card__header d-flex justify-content-between align-items-center">
                <h4>Devices</h4>
                {/* {dateView} */}
            </div>
            <div className="ps-card__content ps-card__PIE">
                
                <div className="ps-card__chart">
                    {orderSources && <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="donut"
                    />}
                    <div className="ps-card__information">
                        <i className="icon icon-wallet"></i>
                        <strong>Order </strong>
                        <small>Source</small>
                    </div>
                </div>
                <div className="ps-card__status">
                   
                    <Values title='Website Desktop' value={orderSources?.WebOrders || 0} previous={compareData?.WebOrders} compareEnabled={compareEnabled} className={'blue'} />
                    <Values title='Website Mobile' value={orderSources?.MobileOrders || 0} previous={compareData?.MobileOrders} compareEnabled={compareEnabled} className={'mayBeGreen'} />
                    <Values title='Mobile App' value={orderSources?.AppOrders || 0} previous={compareData?.AppOrders} compareEnabled={compareEnabled} className={'yellowish'} />
                   
                </div>
            </div>
        </div>
    );
};

export default CardEarning;

function Values({ title,value, previous, compareEnabled, className }) {
    if (value === null || value === undefined) return null;
    return (
        <p className={`${className} d-flex ${compareEnabled &&'flex-column'}`} >
            <strong >{title}</strong>
            <span className='d-flex align-items-center'>
                {value ?? 'Loading...'}
                {compareEnabled && <ChangeInValuesPercent current={value} previous={previous} />}
            </span>
           {compareEnabled&& <span style={{ fontSize: '12px', color: '#8c8c8c', marginRight: '8px' }}>
                {previous|| 0}
            </span>}
        </p>
    );
}
