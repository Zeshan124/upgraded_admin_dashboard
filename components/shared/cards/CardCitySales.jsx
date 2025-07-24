import React from 'react';
import { Card, Table, Tooltip, Empty } from 'antd';
import { EnvironmentOutlined, InfoCircleOutlined} from '@ant-design/icons';
import useSWR from 'swr';
import { fetchCitySalesSap } from '~/services/OMSService';
import { convertValue, formatCurrency, getCurrencySymbol, SWROnceFetchSetting } from '~/util';
import ChangeInValuesPercent from '~/components/elements/basic/ChangeInValuesPercent';
import { useSelector } from 'react-redux';


const aggregateTotals = (cityData) => {
    if (!cityData || cityData.length === 0) return {};
    
    return cityData.reduce((acc, city) => ({
        'Total Cities': (acc['Total Cities'] || 0) + 1,
        'Total Revenue': (acc['Total Revenue'] || 0) + (city['Total Revenue'] || 0),
        'Total Downpayment': (acc['Total Downpayment'] || 0) + (city['Total Downpayment'] || 0),
        'Running Accounts': (acc['Running Accounts'] || 0) + (city['Running Accounts'] || 0),
        'Total GP': (acc['Total GP'] || 0) + (city['Total GP'] || 0),
    }), {});
};
 const NON_MONETARY_FIELDS = [
  "Running Accounts",
];  
const CardCitySales = ({ startDate, endDate, compareDates, compareEnabled }) => {
    const { selectedCurrency, exchangeRates } = useSelector(state => state.currency);
    
    const convert =(value)=> convertValue(value, selectedCurrency, exchangeRates);
    const symbol = getCurrencySymbol(selectedCurrency);

    const { compareStartDate, compareEndDate } = compareDates || {};
    
    // Fetch data using SWR
    const { data: cities, error, isLoading } = useSWR(
        ['/sap/analytics/city-sale', startDate, endDate],
        () => fetchCitySalesSap(startDate, endDate)
    );
    
    const { data: cities_compare } = useSWR(
        compareEnabled && compareStartDate && compareEndDate
            ? ["/sap/analytics/city-sale-compare", compareStartDate, compareEndDate]
            : null,
        () => fetchCitySalesSap(compareStartDate, compareEndDate),
        SWROnceFetchSetting
    );
    
    const cityData = cities || [];
    const totals = aggregateTotals(cityData);
    const totals_compare = compareEnabled ? aggregateTotals(cities_compare) : null;

    const mergedCityData = cityData.map((city) => {
        const compareCity = compareEnabled && cities_compare
            ? cities_compare.find((c) => c.City === city.City)
            : null;
            
        return {
            ...city,
            compareRunningAccounts: compareCity?.["Running Accounts"] || 0,
            compareGP: compareCity?.["Total GP"] || 0,
            compareRevenue: compareCity?.["Total Revenue"] || 0,
            compareDownpayment: compareCity?.["Total Downpayment"] || 0,
        };
    });

    const renderCell = (label, key, compareKey) => ({
        title: label,
        dataIndex: key,
        key,
        sorter: (a, b) => (a[key] || 0) - (b[key] || 0),
        render: (value, record) => {
            const isNonMonetary = NON_MONETARY_FIELDS.includes(key);
            const currentValue = !isNonMonetary ? convert(value || 0) : value || 0;
            const compareValue = !isNonMonetary ? convert(record[compareKey] || 0) : record[compareKey] || 0;
            const symbolHTML = !isNonMonetary ? <span style={{ fontSize: '12px' }}>{symbol}</span> : null;
            return (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'end' }}>
                        {symbolHTML}{formatCurrency(currentValue)}
                        {compareEnabled && (
                            <ChangeInValuesPercent 
                                previous={compareValue} 
                                current={currentValue} 
                            />
                        )}
                    </div>
                    {compareEnabled && (
                        <span style={{ fontSize: 12, color: '#8c8c8c', marginTop: '2px' }}>
                            {symbolHTML}{formatCurrency(compareValue)}
                        </span>
                    )}
                </div>
            );
        }
    });

    const columns = [
        {
            title: "City",
            dataIndex: "City",
            key: "city",
            render: (text) => (
                <span className="city-name">
                    <EnvironmentOutlined className="location-icon" /> {text || "N/A"}
                </span>
            ),
            sorter: (a, b) => (a.City || "").localeCompare(b.City || ""),
            fixed: "left",
        },
        renderCell('Accounts', 'Running Accounts', 'compareRunningAccounts'),
        renderCell('GP', 'Total GP', 'compareGP'),
        renderCell('Revenue', 'Total Revenue', 'compareRevenue'),
        renderCell('Downpayment', 'Total Downpayment', 'compareDownpayment'),
    ];

    const summary = () => {
        const summaryKeys = ['Total Cities', 'Running Accounts', 'Total GP', 'Total Revenue', 'Total Downpayment'];
        
        return (
            <Table.Summary fixed>
                <Table.Summary.Row>
                    {summaryKeys.map(key => {
                        const isCities = key === 'Total Cities';
                        const showCompare = compareEnabled && totals_compare && !isCities;
                        const currentTotal = totals[key] || 0;
                        const compareTotal = totals_compare?.[key] || 0;
                        
                        return (
                            <Table.Summary.Cell key={key}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <strong>
                                        {isCities 
                                            ? `${key} (${currentTotal})` 
                                            : formatCurrency(currentTotal)
                                        }
                                    </strong>
                                    {showCompare && (
                                        <ChangeInValuesPercent 
                                            previous={compareTotal} 
                                            current={currentTotal} 
                                        />
                                    )}
                                </div>
                                {showCompare && (
                                    <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                                        {formatCurrency(compareTotal)}
                                    </span>
                                )}
                            </Table.Summary.Cell>
                        );
                    })}
                </Table.Summary.Row>
            </Table.Summary>
        );
    };

    return (
        <Card
            className="city-sales-card my-4"
            title={
                <div className="card-header-wrapper">
                    <h4 className="card-title">
                        Sales by City
                        <Tooltip title="Shows sales distribution by city">
                            <InfoCircleOutlined className="info-icon ml-2" />
                        </Tooltip>
                    </h4>
                </div>
            }
            loading={isLoading}
        >
            {error && (
                <div className="error-container">
                    <p>Failed to load data</p>
                </div>
            )}

            {!error && !isLoading && cityData.length === 0 && (
                <Empty description="No city data available" />
            )}

            {!error && !isLoading && cityData.length > 0 && (
                <div className="table-container-sales-by-city">
                    <Table
                        dataSource={mergedCityData}
                        columns={columns}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50'],
                        }}
                        rowKey={(record, index) => record.City || `city-${index}`}
                        size="small"
                        className="city-table"
                        summary={summary}
                        scroll={{ x: 'max-content' }}
                    />
                </div>
            )}
        </Card>
    );
};

export default CardCitySales;