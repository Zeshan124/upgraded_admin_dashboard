import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import Fuse from 'fuse.js';
import { TopCategory } from '~/api/OMSService';
import useSWR from 'swr';
import DifferenceBadge from '../UI/DifferenceBadge';




const matchkeys = [
    { CategoryName: 'Mobiles', ItemClass: "MOBILE & TABLETS" },
    { CategoryName: 'Bikes', ItemClass: "Bike General" },
    { CategoryName: 'Laptops', ItemClass: "CL-Laptops & Desktops" },
    { CategoryName: 'Washing Machine', ItemClass: "W-MACHINE" },
    { CategoryName: 'LED TV', ItemClass: "LED" },
    { CategoryName: 'Refrigerator', ItemClass: "REFRIGRATOR" },
    { CategoryName: 'Small Appliances', ItemClass: 'Imported Home Appliances' },
    { CategoryName: 'Microwave Oven', ItemClass: "MICROWAVE" },
    { CategoryName: 'Water Dispenser', ItemClass: "DISPENSER" },
    { CategoryName: 'Solar', ItemClass: "CL-Solar System" },
    { CategoryName: 'Instant Delivery', ItemClass: "" },
    { CategoryName: 'Batteries', ItemClass: "Batteries" },
    { CategoryName: 'General Items', ItemClass: "General Item" },
    { CategoryName: 'Mattress', ItemClass: "Mattresses" },
    { CategoryName: 'Tablet', ItemClass: "" },
    { CategoryName: 'Smart Watches', ItemClass: "" },
    { CategoryName: 'Geyser', ItemClass: "Geyser" },
    { CategoryName: 'Air Conditioner', ItemClass: "AC" },
    { CategoryName: 'Zabardast Mobile Offer', ItemClass: "" },
    { CategoryName: 'Tyres', ItemClass: "" },
    { CategoryName: 'Fans', ItemClass: "Fans A/c & D/c" },
    { CategoryName: 'Deep Freezer', ItemClass: "D-FREEZER" },
    { CategoryName: 'Uncategorized', ItemClass: "" },
];

const columns = [
    {
        title: 'S.No',
        key: 'index',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'Category Name',
        dataIndex: 'CategoryName',
        key: 'CategoryName',
         render: (text) => <span>{text}</span>,
    },
    {
        title: 'Leads',
        dataIndex: 'TotalPurchases',
        key: 'TotalPurchases',
    },
    {
        title: 'Sold',
        dataIndex: 'CurrentCount',
        key: 'CurrentCount',
        render: (text, record, index) => <div className='w-100'><span style={{minWidth:'60px'}}>{text}</span><DifferenceBadge diff={record.Difference}/></div>,
    },

];
const TableTopCategory = ({ items, error, startDate , endDate }) => {
    const { data: CategorySalesRecord, isLoading } = useSWR(["/sap/analytics/item-sale", startDate, endDate], () => TopCategory(startDate, endDate));
    const [visibleItems, setVisibleItems] = useState(5);
    const [mergedData, setMergedData] = useState([]);






    useEffect(() => {
        if (!CategorySalesRecord?.differences?.length) return;

        const itemSaleData = CategorySalesRecord.differences;

        const fuse = new Fuse(itemSaleData, { keys: ['ItemClass'], threshold: 0.3 });
        const combinedData = items.reduce((acc, item) => {
            if (item.CategoryName === "Mobiles" || item.CategoryName === "Tablet") {
                const existing = acc.find((i) => i.CategoryName === "Mobiles & Tablets");
                if (existing) {
                    existing.TotalPurchases += item.TotalPurchases;
                } else {
                    acc.push({ CategoryName: "Mobiles & Tablets", TotalPurchases: item.TotalPurchases });
                }
            } else {
                acc.push(item);
            }
            return acc;
        }, []);

        // Map through the items to merge data
        const updatedItems = combinedData.map((item) => {
            const matchFromKeys = matchkeys.find((key) => key.CategoryName.trim() === item.CategoryName.trim());
            const itemClass = matchFromKeys ? matchFromKeys.ItemClass : null;

            let match = null;

            if (itemClass) {
                // Direct match using ItemClass
                match = itemSaleData.find((sale) => sale.ItemClass === itemClass);
            }

            if (!match) {
                // Fallback to Fuse.js search if no direct match
                const fuseMatch = fuse.search(item.CategoryName)?.[0];
                match = fuseMatch ? fuseMatch.item : null;
            }

            if (match) {
                const { CurrentCount, Difference, ItemClass } = match;
                return {
                    ...item,
                    ItemClass: ItemClass || "N/A",
                    CurrentCount: CurrentCount || "N/A",
                    Difference: Difference || "N/A",
                };
            }

            return item; // If no match is found, return the original item
        });

        // Append unmatched data from CategorySalesRecord
        const unmatchedItems = itemSaleData
            .filter((sale) => !updatedItems.some((item) => item.ItemClass === sale.ItemClass))
            .map((sale) => ({
                CategoryName: sale.ItemClass, // Using ItemClass as the CategoryName for unmatched data
                TotalPurchases: "N/A",
                CurrentCount: sale.CurrentCount || "N/A",
                Difference: sale.Difference || "N/A",
            }));

        setMergedData([...updatedItems, ...unmatchedItems]);
    }, [items, CategorySalesRecord?.differences]);

    console.log(mergedData,'mergedData')


    const handleLoadMore = () =>  setVisibleItems(prevVisibleItems => prevVisibleItems + 10);
    const handleLoadLess = () => setVisibleItems(prevVisibleItems => prevVisibleItems - 10);
    const visibleData = mergedData?.slice(0, visibleItems);
 
    if (error) return <div>Error getting data..</div>


    return (

        <>
            <Table
                columns={columns}
                dataSource={visibleData}
                rowKey="id" 
                loading={isLoading}
                pagination={false} 
            />
            <div className='d-flex align-items-center justify-content-center mt-4'>
                {visibleItems < items?.length && ( 
                  
                    <button className="btn w-50 " onClick={handleLoadMore} style={{ background: '#8bbabb', maxWidth: '120px', fontSize: '13px', marginRight: 12, color: '#fff', borderColor: '#8bbabb', width: '49%' }} class="btn btn-secondary">See More</button>
                )}

                {visibleItems > 5 && ( 
                   
                    <button className="btn border w-50" onClick={handleLoadLess} style={{ borderColor: '#8bbabb', maxWidth: '120px', fontSize: '13px', color: '#8bbabb' }}> Show Less</button>

                )}


            </div>

        </>
    );
};

export default TableTopCategory;
