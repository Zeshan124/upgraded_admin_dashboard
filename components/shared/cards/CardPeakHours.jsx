import { Alert, Progress, Table, Collapse } from 'antd';
import React, { useMemo } from 'react';
import useSWR from 'swr';
import { peakHours } from '~/api/analyticsService';

const { Panel } = Collapse;


const fetcher = async ([url, start, end]) => {
    // console.log('peakHours', start, end);
    const response = await peakHours(start, end);
    return response;
};
const colors = [
    '#FF4560', '#FEB019', '#52c41a', '#008FFB', '#008FFB', '#008FFB', '#008FFB', '#008FFB', '#008FFB', '#008FFB', '#008FFB',
];

const Heading = ({title}) => (
    <div className=" d-flex justify-content-between align-items-center " style={{fontSize:'18px', marginTop:'3px'}}>
        <h4 className='m-0 p-0'>{title}</h4>
    </div>
)
const dummyData = Array.from({ length: 8 }).map((_, index) => ({
    TimeBlock: "12:00 PM - 02:59 PM",
    NumberOfOrders: '00',
    Status: "Early Afternoon",
    Percentage: '...',
}));
const CardPeakHours = ({ startDate, endDate }) => {
    const { data, error } = useSWR(['/analytics/hourly-peak-orders', startDate, endDate], fetcher);

    const sortedData = useMemo(() => {
        return data ? data.slice().sort((a, b) => b.NumberOfOrders - a.NumberOfOrders) : [];
    }, [data]);



    const columns = [
        {
            title: 'Time',
            key: 'TimeBlock',
            render: (text, record) => <>
                <div className='d-sm-block d-none'>{record.TimeBlock}</div>
                <div className='d-sm-none d-block'>
                    <div>{record?.TimeBlock?.split('-')[0]}</div>
                    <div>{record?.TimeBlock?.split('-')[1]}</div>
                </div>
            </>,
        },
        {
            title: 'Status',
            key: 'Status',
            responsive: ['md'],
            render: (text, record) => <div >{record.Status}</div>,
        },
        {
            title: 'Orders',
            dataIndex: 'NumberOfOrders',
            key: 'NumberOfOrders',
            className: 'noOfOrders',
            sorter: (a, b) => a.NumberOfOrders - b.NumberOfOrders,
            render: (text) => <div>{text}</div>,
        },
        {
            title: 'Percentage',
            dataIndex: 'Percentage',
            key: 'Percentage',
            className:'percentageBar',
            render: (text, record, index) => (
                <div style={{ width: '100%' }}>
                    <Progress percent={Math.round(text)} strokeColor={colors[index]}/>
                </div>
            ),
        },
    ];

    if (error) return <Alert message="Error" description="Error loading data." type="error" showIcon />;
    if (!data) return <Table
        columns={columns}
        dataSource={dummyData}
        rowKey={(record, index) => `${record.Status}-${record.TimeBlock}-${index}`}
        pagination={false} 
    />;

    const listView = (
        <Table
            columns={columns}
            dataSource={sortedData}
            rowKey={(record) => `${record.Status}-${record.TimeBlock}`}
            pagination={false} // Disable pagination
        />
    )

    return (
        <>
            <div className="ps-card ps-card--earning">
                {/* <div className="ps-card__header d-flex justify-content-between align-items-center pb-2">
                    <h4>Order Peak Hours</h4>
                </div> */}
                <Collapse defaultActiveKey={['0']}>
                    <Panel header={<Heading title="Order Peak Hours"/>} key="1">
                        {listView}
                    </Panel>
                </Collapse>
            </div>

            
        </>
    );
};

export default CardPeakHours;
