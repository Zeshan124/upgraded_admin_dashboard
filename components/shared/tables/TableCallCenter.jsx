import React, { useState, useMemo } from 'react';
import { Table } from 'antd';
import useSWR from 'swr';
import { CallCenterOrders } from '~/api/analyticsService';
import { SWROnceFetchSetting } from '~/util';
import ChangeInValuesPercent from '~/components/elements/basic/ChangeInValuesPercent';

const TableCallCenter = ({ startDate, endDate, compareDates, compareEnabled }) => {
    const { compareStartDate, compareEndDate } = compareDates || {};
    const [visibleItems, setVisibleItems] = useState(5);

    // Fetch current and comparison data
    const { data: items, error, isLoading } = useSWR(
        ['/callcenter-orders', startDate, endDate],
        () => CallCenterOrders(startDate, endDate)
    );
    
    const { data: items_compare } = useSWR(
        compareEnabled && compareStartDate && compareEndDate
            ? ['/callcenter-orders-compare', compareStartDate, compareEndDate]
            : null,
        () => CallCenterOrders(compareStartDate, compareEndDate),
        SWROnceFetchSetting
    );

    // Transform and merge data
    const mergedData = useMemo(() => {
        if (!items?.length) return [];
        
        const rawData = items[0];
        const compareData = items_compare?.[0] || {};
        
        // Transform current data
        const transformed = Object.entries(rawData)
            .filter(([key]) => key !== 'Total_Count')
            .map(([name, orders], index) => ({
                key: index,
                name,
                orders,
                compareOrders: compareData[name] || 0
            }))
            .sort((a, b) => b.orders - a.orders);
            
        return transformed;
    }, [items, items_compare]);

    // Get total counts
    const totalCount = items?.[0]?.['Total_Count'] || 0;
    const totalCountCompare = items_compare?.[0]?.['Total_Count'] || 0;

    const columns = [
        {
            title: 'S.No',
            key: 'index',
            width: 70,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
             render: (text) => <span>{text}</span>,
        },
        {
            title: 'Orders',
            dataIndex: 'orders',
            key: 'orders',
            render: (value, record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                        {value}
                        {compareEnabled && (
                            <ChangeInValuesPercent 
                                previous={record.compareOrders} 
                                current={value} 
                            />
                        )}
                    </div>
                    {compareEnabled && (
                        <span style={{ fontSize: 12, color: '#8c8c8c', marginTop: '2px' }}>
                            {record.compareOrders}
                        </span>
                    )}
                </div>
            ),
        },
    ];

    if (error) return <div>Error getting data..</div>;

    const visibleData = mergedData.slice(0, visibleItems);
    const hasMore = visibleItems < mergedData.length;
    const canShowLess = visibleItems > 5;

    return (
        <>
            <h5 style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                Total Order Count: {totalCount}
                {compareEnabled && (
                    <>
                        <ChangeInValuesPercent 
                            previous={totalCountCompare} 
                            current={totalCount} 
                        />
                        <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '8px' }}>
                            ({totalCountCompare})
                        </span>
                    </>
                )}
            </h5>
            
            <Table
                columns={columns}
                dataSource={visibleData}
                rowKey="key"
                pagination={false}
                loading={isLoading}
                scroll={{ x: 'max-content' }}
            />
            
            <div className='d-flex align-items-center justify-content-center mt-4'>
                {hasMore && (
                    <button 
                        className="btn w-50 btn-secondary" 
                        onClick={() => setVisibleItems(prev => prev + 10)}
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
                {canShowLess && (
                    <button 
                        className="btn border w-50" 
                        onClick={() => setVisibleItems(prev => Math.max(5, prev - 10))}
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

export default TableCallCenter;