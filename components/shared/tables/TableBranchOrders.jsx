import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

const TableBranchOrders = ({ items, error }) => {

    // console.log(items,'items')

    const [dataSource, setDataSource] = useState([]);

    const defaultPageSize = 5; 
    const [visibleItems, setVisibleItems] = useState(defaultPageSize);

    if (error) {
        return <div>Error getting data..</div>
    }
    useEffect(() => {

        if (items?.length > 0) {
            const rawData = items[0]; 
            // Transform and sort the data
            const transformedData = items?.map((item, index) => ({
                    key: index,
                    name: item?.branchName,
                    orders: item?.total_orders_count,
                }))
                .sort((a, b) => b.orders - a.orders); // Sort by the number of orders, descending

            setDataSource(transformedData);
        }
    }, [items]);

    const columns = [
        {
            title: 'S.No',
            key: 'index',
            render: (text, record, index) => index + 1,
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
        },
    ];



    const handleLoadMore = () => {
        // console.log('visibleItems', visibleItems)
        setVisibleItems(prevVisibleItems => prevVisibleItems + 10);

    };

    const handleLoadLess = () => {
        // console.log('visibleItems', visibleItems)
        setVisibleItems(prevVisibleItems => prevVisibleItems - 10);

    };
    const visibleData = dataSource?.slice(0, visibleItems);

    return (
        <>
          

            <Table
                columns={columns}
                dataSource={visibleData}
                rowKey="id" 
                pagination={false} 
            />
            <div className='d-flex align-items-center justify-content-center mt-4'>
                {visibleItems < dataSource?.length && ( 
                    
                    <button className="btn w-50 " onClick={handleLoadMore} style={{ background: '#8bbabb', maxWidth: '120px', fontSize: '13px', marginRight: 12, color: '#fff', borderColor: '#8bbabb', width: '49%' }} class="btn btn-secondary">See More</button>
                )}

                {visibleItems > 5 && ( 
                    <button className="btn border w-50" onClick={handleLoadLess} style={{ borderColor: '#8bbabb', maxWidth: '120px', fontSize: '13px', color: '#8bbabb' }}> Show Less</button>

                )}


            </div>
            
        </>
    );
};

export default TableBranchOrders;
