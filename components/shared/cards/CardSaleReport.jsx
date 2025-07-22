import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { DatePicker, Space, Spin } from 'antd';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import useSWR from 'swr';
import { getOrderCount } from '~/api/orderService';
import { fetchDeliveredOrders } from '~/api/OMSService';
import Cookies from 'js-cookie';


const CardSaleReport = ({ startDate, endDate }) => {
    const { data: orderCount, error: orderCountError } = useSWR(['/api/orderCount', startDate, endDate], () => getOrderCount(startDate, endDate));
    const { data: orderDeliveredCount, error: orderDeliveredError, isLoading } = useSWR(['/api/sales', startDate, endDate], () => fetchDeliveredOrders(startDate, endDate));
    const showfinancialDetail = parseInt(Cookies.get('fdetail')) === 1;
    const [chartData, setChartData] = useState({ dates: [], counts: [] });
    const [deliveredCount, setDeliveredCount] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (orderCount && orderCount?.length > 0) {
            // Handle multiple days normally
            console.log(orderCount, 'orderCount')
            const formattedDates = orderCount.map(item => item['order date']);
            const counts = orderCount.map(item => Number(item['order count']));
            setChartData({ dates: formattedDates, counts: counts });
            // console.log('orderCount',orderCount)
            setLoading(false);
        }else if (orderCount && orderCount.length === 0) {
            // Handle empty data case
            setChartData({ dates: [], counts: [] });
        }
    }, [orderCount]);
    useEffect(() => {
        setLoading(true);
        console.log(orderDeliveredCount,'orderDeliveredCount')
        if (orderDeliveredCount && orderDeliveredCount?.length > 0) {
            // Handle multiple days normally
            const counts = orderDeliveredCount.map(item => Number(item['TotalCount']));
            setDeliveredCount(counts);
            setLoading(false);
        }
        if (!isLoading && orderDeliveredCount?.length === 0) {
            setDeliveredCount([0]);
            setLoading(false);
        }
        if (isLoading && !orderDeliveredCount){
            setDeliveredCount([]);
        }
    }, [orderDeliveredCount]);
    
    
    //console.log(orderCount, orderDeliveredCount,'orderCount, orderDeliveredCount,')
    const state = {
        series: [
            {
                name: 'Order Count',
                data: chartData?.counts || [],
            },
            ...(showfinancialDetail ? [{
                name: `Delivered Orders ${isLoading ? '(Loading...)' : ''}`,
                data: deliveredCount || [],
            }] : []),
        ],

        options: {
            chart: {
                height: '100%',
                type: 'area',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            colors: ['#fcb800', '#00BCD4', '#9C27B0', '#00BCD4', '#8BC34A'],
            stroke: {
                curve: 'smooth',
            },
            xaxis: {
                type: 'datetime',
                categories: chartData?.dates || [],
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy',
                },
            },
            markers: {
                size: 5
            },
            responsive: [
                {
                    breakpoint: 1680,
                    options: {
                        chart: {
                            width: '100%',
                            height: 320,
                        },
                    },
                },
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
    };
    if (orderCountError){
        <div>{orderCountError.message || "An error occurred"}</div>
    }   
    return (
        <div className="ps-card ps-card--sale-report">
           

            <div className="ps-card__content">
                {loading ? (
                    <div style={{height:'200px', margin:"0 auto"}} className='d-flex align-items-center justify-content-center'><Spin size="large" /></div>
                ) : (
                    orderCount && <Chart options={state.options} series={state.series} type="area" /> 
                )}
            </div>
            <div className='text-center text-danger'>{(orderDeliveredError && isLoading)  && `Error in Order Deliver Count`}</div>
        </div>)
    
};

export default CardSaleReport;
