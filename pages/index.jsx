import React, { useEffect, useState } from 'react';
import CardSaleReport from '~/components/shared/cards/CardSaleReport';
import CardAnalytics from '~/components/shared/cards/CardAnalytics';
import CardEarning from '~/components/shared/cards/CardEarning';
import CardPeakHours from '~/components/shared/cards/CardPeakHours';
import CardStatics from '~/components/shared/cards/CardStatics';
import CardOrderStatus from '~/components/shared/cards/CardOrderStatus';
import CardPortalStatus from '~/components/shared/cards/CardPortalStatus';
import CardTotalBranchesPortalOrders from'~/components/shared/cards/CardTotalBranchesPortalOrders';
import ContainerDashboard from '~/components/layouts/ContainerDashboard';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDrawerMenu } from '~/store/app/action';
import CardTopAreas from '~/components/shared/cards/CardTopAreas';
import { getOrderCount } from '~/api/orderService';
import { DatePicker, Space, Tabs } from 'antd';
import moment from 'moment';
import DateRangePicker from '~/components/elements/basic/DateRangePicker';
import useSWR from 'swr';
import TableTopCategory from '~/components/shared/tables/TableTopCategory';
import TableBranchOrders from '~/components/shared/tables/TableBranchOrders';
import TableCallCenter from '~/components/shared/tables/TableCallCenter';
import TableTopProduct from '~/components/shared/tables/TableTopProduct';
import { BranchOrders, CallCenterOrders, mostPurchaseCategory, mostPurchaseProduct } from '../api/analyticsService';
const { RangePicker } = DatePicker;
import { DoubleRightOutlined } from '@ant-design/icons';
import { useWebSocket } from '~/websocketContext';
import CardCityPieChart from '~/components/shared/cards/CardCityPieChart';
import CardVendorOrders from '~/components/shared/cards/CardVendorOrders';
import { fetchDeliveredOrders } from '~/api/OMSService';
import StatCard from '~/components/shared/cards/StatCard';
import SalesRecord from '~/components/partials/dashboard/SalesRecord';
import TableRecovery from '~/components/shared/tables/TableRecovery';
import Cookies from 'js-cookie';
import ExpoRecords from '~/components/partials/dashboard/ExpoRecords';
import UpTimeRobotCard from '~/components/shared/cards/UpTimeRobotCard';
import CardCitySales from '~/components/shared/cards/CardCitySales';
import CardBranchSales from '~/components/shared/cards/CardBranchSales';
import CurrencyToggle from '~/components/elements/basic/CurrencyToggle';
import { WebSocketProvider } from "~/websocketContext";


const initalDates = {
    startDate: moment().subtract(6, 'days').startOf('day'),
    endDate: moment().endOf('day'),

}
const initialCompareDates={
    startDate: null,
    endDate: null,
}

const Index = () => {
    const dispatch = useDispatch();
    const { isDrawerMenuWeb } = useSelector(state => state.app);
    const socket = useWebSocket();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        branchStatusWiseCount: [],
        branchWiseOpenOrders: [],
    });
    const showfinancialDetail = parseInt(Cookies.get('fdetail')) === 1;
 
    const [isSticky, setIsSticky] = useState(false);
    const [compareEnabled, setCompareEnabled] = useState(false);
    const [dates, setDates] = useState(initalDates);
    const [comparisonDates, setComparisonDates] = useState(initialCompareDates);

    const startDateFormatted = moment(dates.startDate).format('YYYY-MM-DD');
    const endDateFormatted = moment(dates.endDate).format('YYYY-MM-DD');
    const compareStartDateFormatted = comparisonDates?.startDate ?  moment(comparisonDates?.startDate).format("YYYY-MM-DD") : null
    const compareEndDateFormatted = comparisonDates?.startDate ?moment(comparisonDates?.endDate).format("YYYY-MM-DD") : null
    console.log(startDateFormatted, endDateFormatted, 'startDateFormatted, endDateFormatted',compareStartDateFormatted, compareEndDateFormatted, 'compareStartDateFormatted, compareEndDateFormatted');


   
    const { data: purchaseCategory, error: purchaseCategoryError } = useSWR(['/purchase-category', startDateFormatted, endDateFormatted], () => mostPurchaseCategory(startDateFormatted, endDateFormatted));
    
   

    const emitAllRequests = (socket, dateRange, withCompare) => {
        const query = {
            startDate: moment(dateRange.startDate).format('YYYY-MM-DD'),
            endDate: moment(dateRange.endDate).format('YYYY-MM-DD'),
        };
        socket.emit('getBranchStatusWiseCount', query);
        socket.emit('getBranchOpenUnopenOrders', query);
    }
    const handleData = (key, data, filter = false) => {
        const result = data.data;
       // console.log(data,'--infunc:handleData')

        setData(prev => ({ ...prev, [key]: result }));
        key === 'portalStatusWiseBranchCount' && setLoading(false)
    };
    useEffect(() => {

        if (socket) {
            console.time('dashboardDATA')
            const events = [
                { event: 'branchStatusWiseCountResponse', key: 'branchStatusWiseCount' },
                { event: 'branchOpenUnopenOrdersResponse', key: 'branchWiseOpenOrders'},

            ];
            socket.on('connect', () => {
                emitAllRequests(socket, dates);
            });
            events.forEach(({ event, key, filter }) => {
                socket.on(event, data => handleData(key, data, filter));
            });
            socket.on('order-status-updated', () => {
                emitAllRequests(socket, dates);
            });
            console.timeEnd('dashboardDATA')
            return () => {
                events.forEach(({ event }) => socket.off(event));
                socket.off('connect')
                socket.off('order-status-updated')
            };
        }
    }, [socket, dates, compareEnabled]);

    useEffect(() => {
        if (!socket || !socket.connected) return;
        // console.log("Date range changed, re-fetching data.");
        emitAllRequests(socket, dates);
    }, [dates, compareEnabled]);



    ///SOCKETS END
    useEffect(() => {
        dispatch(toggleDrawerMenu(false));

    }, [dispatch]);
    useEffect(()=>{

        const handleScroll = () => {
            if (window.scrollY > 100) { // Adjust scroll position threshold
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    },[]);




    const onDateRangeChange = (startDate, endDate) => {
        setDates({
            startDate: startDate,
            endDate: endDate,
        });
    };
    const onComparisonDateRangeChange = (startDate, endDate) => {
        setComparisonDates({
            startDate: startDate,
            endDate: endDate,
        });
    };
    const toggleComparison = () => {
        setCompareEnabled(!compareEnabled);


        if (compareEnabled) {
            setComparisonDates(initalDates);
        }
    };

    let dateView = (
        <div className="date-range-container d-flex align-items-center justify-content-end justify-content-sm-start " style={{ columnGap: '6px', rowGap:'10px' }}>
            <DateRangePicker
                id="primary-date-range"
                onDateRangeChange={onDateRangeChange}
            />
            <div className="d-flex justify-content-end align-items-center" >
                <div
                    className="compare-icon-container ms-2 d-flex align-items-center justify-content- mr-2"
                    style={{
                        cursor: 'pointer',
                        backgroundColor: compareEnabled ? '#e6f7ff' : 'transparent',
                        borderRadius: '5px',
                  
                       
                        height: '35px',
                        transition: 'all 0.3s',
                        border: '1px solid ' + (compareEnabled ? '#1890ff' : 'transparent')
                    }}
                    onClick={toggleComparison}
                    title="Compare with another period"
                >
                    <i
                        className="fa fa-exchange"
                        aria-hidden="true"
                        style={{
                            color: compareEnabled ? '#1890ff' : '#555',
                          
                        }}
                    ></i>
                </div>

                {compareEnabled && (
                    <DateRangePicker
                        id="comparison-date-range"
                        onDateRangeChange={onComparisonDateRangeChange}
                    />
                )}
            </div>
        </div>
      );

    const compareDates = { compareStartDate: compareStartDateFormatted, compareEndDate: compareEndDateFormatted }
    const props = {
        startDate: startDateFormatted,  
        endDate: endDateFormatted,
        compareDates: compareDates,
        compareEnabled: compareEnabled,
    };
    const items = [
        ...(showfinancialDetail ? [{ label: 'Recovery', key: 'item-0', children: <TableRecovery {...props}/> }] : []),
        { label: 'Most Purchase Product', key: 'item-1', children: <TableTopProduct {...props}  /> },
        { label: 'Most Purchase Category', key: 'item-2', children: <TableTopCategory error={purchaseCategoryError} items={purchaseCategory} startDate={startDateFormatted} endDate={endDateFormatted} title="Most Purchase Category" /> },
        { label: 'Call Center', key: 'item-3', children: <TableCallCenter {...props} /> },
        { label: 'Branch Orders', key: 'item-4', children: <TableBranchOrders items={data.branchWiseOpenOrders} title="Branch Orders" /> },
    ];

    const OrderCountCard = <CardStatics startDate={startDateFormatted} endDate={endDateFormatted} compareDates={compareDates} compareEnabled={compareEnabled} />
    const BranchesOrders = <CardTotalBranchesPortalOrders data={data.branchWiseOpenOrders}/>
   return (
  
        <ContainerDashboard title="Dashboard">
           
            {/* Render UI based on the fetched data */}
                <div className='d-flex d-md-none justify-content-end mr-2ml-auto mb-3'>
                    
                            <CurrencyToggle />
                </div>
                <div className={`ps-card__header  pl-0 pl-md-2 pr-2 d-flex align-items-center justify-content-between header-content ${isSticky && (isDrawerMenuWeb ? 'widthOpenMenu' : 'widthCloseMenu')} ${isSticky ? 'sticky-date-range' : ''}`}>
                <h4 className='d-md-block d-none mb-0'>Sales Reports</h4>

                <h4 className='d-md-none d-block mb-0'>{!compareEnabled ? 'Date' : ''}</h4>
                {/* <div className={`d-flex position-relative justify-content-end float-right ${!isSticky ? 'mb-2 mb-md-4' : ''}`}>
                    
                </div> */}
                
                    <div className={`d-flex position-relative justify-content-end float-right ${!isSticky ? 'mb-2 mb-md-4' : ''} `}>
                        <div className='d-none d-md-flex mr-2'>
                            <CurrencyToggle />
                        </div>
                        
                        {dateView}
                    </div>
                </div>
            <section className="ps-dashboard" id="homepage">
                    <div className="ps-section__left max-width">
                        <div className="row">
                            <div className="col-xl-12 col-12">
                        
                                
                                <CardSaleReport startDate={startDateFormatted} endDate={endDateFormatted} />
                                <ExpoRecords startDate={startDateFormatted} endDate={endDateFormatted} />
                                <div className='d-block d-md-none'>
                                {OrderCountCard}
                                </div>
                            {showfinancialDetail && <SalesRecord startDate={startDateFormatted} endDate={endDateFormatted} compareDates={compareDates} compareEnabled={compareEnabled} />}
        
                        
                            </div>
                        </div>
                    {showfinancialDetail &&  (<>
                        <CardCitySales {...props}/>
                        <CardBranchSales {...props}/>
                        </>)}
                        <CardEarning {...props}/>
                        <CardPeakHours startDate={startDateFormatted} endDate={endDateFormatted} />
                        <CardAnalytics {...props} />
                        <Tabs items={items} moreIcon={<DoubleRightOutlined />} />

                        <CardCityPieChart {...props} />
                        <CardVendorOrders {...props} />
                        <div className='d-lg-block d-none'>
                            {BranchesOrders}
                        </div>
                        <UpTimeRobotCard/>
                        <CardTopAreas {...props}  />
                    </div>
                    <div className="ps-section__right">
                        <div className='d-md-block d-none'>
                        {OrderCountCard}
                        </div>
                        <CardPortalStatus startDate={startDateFormatted} endDate={endDateFormatted} compareDates={compareDates} compareEnabled={compareEnabled} />
                        {/* ORDER */}
                        <h2 className='text-section'>Order Management System</h2>
                            <CardOrderStatus startDate={startDateFormatted} endDate={endDateFormatted} ompareDates={compareDates} compareEnabled={compareEnabled} />
                        <div className='d-lg-none d-block'>
                            {BranchesOrders}
                        </div>
                    </div>
                </section> 
          
        </ContainerDashboard>

    );
};
const IndexPage=()=>{
    return(
           <WebSocketProvider>
                <Index/>
           </WebSocketProvider>
    )
}
export default IndexPage;
