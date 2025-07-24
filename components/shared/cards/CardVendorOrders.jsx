import axios from 'axios';
import { useState } from 'react';
import { Select, Button } from 'antd';
import useSWR from 'swr';
import { fetchStores } from '~/services/storeService';
import { MarketPlaceVendorOrders } from '~/services/analyticsService';
import { fetchVendorOrdersExport } from '~/services/OMSService';
import ChangeInValuesPercent from '~/components/elements/basic/ChangeInValuesPercent';

const { Option } = Select;

// Fetcher functions
const fetcher = async (start, end, storeURL) => {
    const response = await MarketPlaceVendorOrders(start, end, storeURL);
    return response?.data;
};

const initialData = [
    { title: 'Total Orders', icon: 'fa-users', value: '...', key: 'totalOrderCount' },
    { title: 'Oms Verified', icon: 'fa-file', value: '...', key: 'OMSConfirmedOrderCount' },
    { title: 'Vendor Delivered', icon: 'fa-line-chart', value: '...', key: 'vendorDeliveredCount' },
    { title: 'Confirm Delivered', icon: 'fa-line-chart', value: '...', key: 'ConfirmVendorDeliveredCount' },
    { title: 'Revenue Delivered', icon: 'fa-line-chart', value: '...', key: 'Revenue' },
];

const Card = ({ data, compareData, compareEnabled }) => {
    return(
    <div className="ps-card__content flexi-card" >
        {data?.map((item, index) => {
            const compareItem = compareData?.[index]?.value || 0;
            return (
            <div className={`ps-block--stat  ${index % 2 === 0 ? "yellow" : "green"}`} key={index}>
                <div className="ps-block__left">
                    <span>
                        <i className="icon-home6"></i>
                    </span>
                </div>
                <div className="ps-block__content">
                    <p className="textie">{item?.title}</p>
                    <h4 className='d-flex align-items-center'>{item?.value?.toLocaleString()} {compareEnabled && <ChangeInValuesPercent current={item.value} previous={compareItem}/>}</h4>
                    <small style={{ color: '#8c8c8c', fontSize: '12px' ,     background: `rgba(245, 245, 250, 0.8)`,padding: '4px 8px',borderRadius: '4px'}} className='stat-previous'>
                        prev: {compareItem.toLocaleString()} 
                    </small>
                </div>
            </div>
        )})}
    </div>
)};

// Main component
const CardVendorOrders = ({ startDate, endDate ,compareDates,compareEnabled,}) => {
      const { compareStartDate, compareEndDate } = compareDates;
    const [storeURL, setStoreURL] = useState('alltech');
    const [loading, setLoading] = useState(false);
    const url = `/get/web?_start=${1}&_limit=1000`;
    const { data: stores } = useSWR(url, fetchStores);
    const { data: marketplaceData, error } = useSWR(
        ['/marketplace', startDate, endDate, storeURL],
        () => fetcher(startDate, endDate, storeURL)
    );
    const { data: marketplaceCompare } = useSWR(
        compareEnabled
        ? ["/marketplace-compare", compareStartDate, compareEndDate, storeURL]
        : null,
        () => fetcher(compareStartDate, compareEndDate, storeURL)
    );
    // Map data into card format
    const cardData = marketplaceData
        ? initialData.map((item) => ({
            ...item,
            value: marketplaceData[item.key] || 0,
        }))
        : initialData;

    const cardCompareData = marketplaceCompare
        ? initialData.map((item) => ({
        ...item,
        value: marketplaceCompare[item.key] || 0,
      }))
    : [];
    const handleExport = async () => {
        try {
            setLoading(true);
            const blob = await fetchVendorOrdersExport(
                startDate,
                endDate,

            );
            const excelBlob = new Blob([blob], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(excelBlob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `All_vendor_orders_${startDate}_${endDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            console.log("Export successful!");
        } catch (error) {
            console.error("Export failed:", error);
        }finally{
            setLoading(false);
        }
    };
    return (
        <>
            {/* Dropdown for store selection */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Select
                    defaultValue={storeURL}
                    style={{ width: 200 }}
                    onChange={setStoreURL}
                >
                    {stores?.data?.map((store, index) => (
                        <Option key={index} value={store?.shopUrl}>
                            {store?.ShopName || store?.shopUrl}
                        </Option>
                    ))}
                </Select>
                <Button
                    onClick={handleExport}
                    type="primary"
                    loading={loading}
                    style={{ background: "#8BBABB", border: "none" }}
                >
                    Export All
                </Button>
            </div>

            {/* Cards displaying data */}
            <section className="ps-card ps-card--statics ">
                <Card data={cardData} compareData={cardCompareData}
                         compareEnabled={compareEnabled}/>
           </section>
        </>
    );
};

export default CardVendorOrders;
