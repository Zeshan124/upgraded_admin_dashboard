import React, { useState, useMemo } from 'react';
import { Table } from 'antd';
import { fetchInstallementReceived } from '~/api/OMSService';
import useSWR from 'swr';
import { convertValue, formatCurrency, getCurrencySymbol, SWROnceFetchSetting } from '~/util';
import ChangeInValuesPercent from '~/components/elements/basic/ChangeInValuesPercent';
import { useSelector } from 'react-redux';

const TableRecovery = ({ startDate, endDate, compareDates, compareEnabled }) => {
    const { compareStartDate, compareEndDate } = compareDates || {};
    const { selectedCurrency, exchangeRates } = useSelector(state => state.currency);
    console.log(startDate, endDate,'startDate, endDate');
    const convert =(value)=> convertValue(value, selectedCurrency, exchangeRates);
    const symbol = getCurrencySymbol(selectedCurrency);
    
    const { data: items, error, isLoading } = useSWR(
        ['/analytics/recovery', startDate, endDate],
        () => fetchInstallementReceived(startDate, endDate)
    );
    
    const { data: items_compare } = useSWR(
        compareEnabled 
            ? ['/analytics/recovery-compare', compareStartDate, compareEndDate]
            : null,
        () => fetchInstallementReceived(compareStartDate, compareEndDate),
        SWROnceFetchSetting
    );
    
    const defaultPageSize = 5;
    const [visibleItems, setVisibleItems] = useState(defaultPageSize);
    const [sorter, setSorter] = useState({ field: null, order: null });

    const handleLoadMore = () => setVisibleItems(prev => prev + 10);
    const handleLoadLess = () => setVisibleItems(prev => Math.max(prev - 10, defaultPageSize));

    // Merge current and comparison data

    const mergedData = useMemo(() => {
        if (!items || !Array.isArray(items) || items.length === 0) {
            return [];
        }

        return items.map((item) => {
            let compareItem = null;
            
            // Only proceed if items_compare is actually an array
            if (compareEnabled && Array.isArray(items_compare) && items_compare.length > 0) {
                compareItem = items_compare.find((c) => c?.LocationCode === item?.LocationCode);
            }
            
            return {
                ...item,
                compareTotalAmount: compareItem?.TotalAmount || 0,
            };
        });
    }, [items, items_compare, compareEnabled]);
    
    // Sorting Logic
    const sortedData = useMemo(() => {
        if (!mergedData.length) return [];
        if (!sorter.field) return mergedData;

        return [...mergedData].sort((a, b) => {
            if (sorter.field === 'LocationCode') {
                return sorter.order === 'ascend'
                    ? a.LocationCode.localeCompare(b.LocationCode)
                    : b.LocationCode.localeCompare(a.LocationCode);
            } else if (sorter.field === 'TotalAmount') {
                return sorter.order === 'ascend'
                    ? a.TotalAmount - b.TotalAmount
                    : b.TotalAmount - a.TotalAmount;
            }
            return 0;
        });
    }, [mergedData, sorter]);

    // Paginate After Sorting
    const visibleData = sortedData.slice(0, visibleItems);



    const columns = [
        {
            title: 'S.No',
            key: 'index',
            width: 70,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Branch',
            dataIndex: 'LocationCode',
            key: 'LocationCode',
            sorter: true,
             render: (text) => <span>{text}</span>,
        },
        {
            title: 'Amount Received',
            dataIndex: 'TotalAmount',
            key: 'TotalAmount',
            sorter: true,
            render: (value, record) => {
                const currentValue = value || 0;
                const compareValue = record.compareTotalAmount || 0;
                 const symbolHTML =  <span >{symbol}</span> ;
                return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                            {symbolHTML}{formatCurrency(convert(currentValue))}
                            {compareEnabled && (
                                <ChangeInValuesPercent 
                                    previous={compareValue} 
                                    current={currentValue} 
                                />
                            )}
                        </div>
                        {compareEnabled && (
                            <span style={{ fontSize: 12, color: '#8c8c8c', marginTop: '2px' }}>
                                {symbolHTML}{formatCurrency(convert(compareValue))}
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];

    if (error) return <div>Error getting data..</div>;

    return (
        <>
            <Table
                columns={columns}
                dataSource={visibleData}
                rowKey={(record, index) => record.id || `recovery-${index}`}
                pagination={false}
                loading={isLoading}
                onChange={(pagination, filters, sorter) => {
                    setSorter({
                        field: sorter.field,
                        order: sorter.order,
                    });
                }}
                scroll={{ x: 'max-content' }}
            />

         
            

            <div className="d-flex align-items-center justify-content-center mt-4">
                {visibleItems < sortedData.length && (
                    <button
                        className="btn w-50 btn-secondary"
                        onClick={handleLoadMore}
                        style={{
                            background: '#8bbabb',
                            maxWidth: '120px',
                            fontSize: '13px',
                            marginRight: 12,
                            color: '#fff',
                            borderColor: '#8bbabb',
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
                            color: '#8bbabb',
                        }}
                    >
                        Show Less
                    </button>
                )}
            </div>
        </>
    );
};

export default TableRecovery;