import React, { useState, useMemo } from 'react';
import { Table } from 'antd';
import { mostPurchaseProduct } from '~/api/analyticsService';
import useSWR from 'swr';
import { SWROnceFetchSetting } from '~/util';
import ChangeInValuesPercent from '~/components/elements/basic/ChangeInValuesPercent';
const defaultPageSize = 5;
const TableTopProduct = ({ startDate, endDate, compareDates, compareEnabled }) => {
    const { compareStartDate, compareEndDate } = compareDates || {};
    
    const { data: items, error, isLoading } = useSWR( ['/purchase-item', startDate, endDate],  () => mostPurchaseProduct(startDate, endDate) );
    
    const { data: items_compare } = useSWR( compareEnabled ? ['/purchase-item-compare', compareStartDate, compareEndDate] : null,
        () => mostPurchaseProduct(compareStartDate, compareEndDate),
        SWROnceFetchSetting
    );

    
    const [visibleItems, setVisibleItems] = useState(defaultPageSize);

    const handleLoadMore = () => { setVisibleItems(prevVisibleItems => prevVisibleItems + 10) };

    const handleLoadLess = () => {  setVisibleItems(prevVisibleItems => Math.max(prevVisibleItems - 10, defaultPageSize)) };

   
    const mergedData = useMemo(() => {
        if (!items) return [];
        
        return items?.map((item) => {
            const compareItem = compareEnabled && items_compare
                ? items_compare.find((c) => c.productName === item.productName)
                : null;
                
            return {
                ...item,
                comparePurchaseCount: compareItem?.purchase_count || 0,
            };
        });
    }, [items, items_compare, compareEnabled]);

    const columns = [
        {
            title: 'S.No',
            key: 'index',
            width: 70,
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
             render: (text) => <span>{text}</span>,
        },
        {
            title: 'Purchase Count',
            dataIndex: 'purchase_count',
            key: 'purchase_count',
            render: (value, record) => {
                const currentValue = value || 0;
                const compareValue = record.comparePurchaseCount || 0;
                
                return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                            {currentValue}
                            {compareEnabled && (
                                <ChangeInValuesPercent 
                                    previous={compareValue} 
                                    current={currentValue} 
                                />
                            )}
                        </div>
                        {compareEnabled && (
                            <span style={{ fontSize: 12, color: '#8c8c8c', marginTop: '2px' }}>
                               {compareValue}
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];

    if (error) {
        return <div>Error getting data..</div>
    }

    const visibleData = mergedData.slice(0, visibleItems);

    return (
        <>
            <Table
                columns={columns}
                dataSource={visibleData}
                rowKey={(record, index) => record.id || `product-${index}`}
                pagination={false}
                loading={isLoading}
                scroll={{ x: 'max-content' }}
            />
            
            <div className='d-flex align-items-center justify-content-center mt-4'>
                {visibleItems < mergedData.length && (
                    <button 
                        className="btn w-50 btn-secondary" 
                        onClick={handleLoadMore} 
                        style={{ 
                            background: '#8bbabb', 
                            maxWidth: '120px',
                            fontSize: '13px',  
                            marginRight: 12, 
                            color: '#fff', 
                            borderColor: '#8bbabb'
                        }}
                    >
                        See More
                    </button>
                )}

                {visibleItems > defaultPageSize && (
                    <button 
                        className="btn border w-50" 
                        onClick={handleLoadLess} 
                        style={{ 
                            borderColor: '#8bbabb', 
                            maxWidth: '120px', 
                            fontSize: '13px', 
                            color: '#8bbabb' 
                        }}
                    > 
                        Show Less
                    </button>
                )}
            </div>
        </>
    );
};

export default TableTopProduct;