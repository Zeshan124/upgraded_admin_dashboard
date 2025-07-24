import React, { useState } from 'react';
import { Card, Table, Empty, Tooltip, Input } from 'antd';
import { ShopOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useSWR from 'swr';
import { fetchBranchSalesSap } from '~/services/OMSService';
import { convertValue, formatCurrency, getCurrencySymbol, SWROnceFetchSetting } from '~/util';
import ChangeInValuesPercent from '~/components/elements/basic/ChangeInValuesPercent';
import { useSelector } from 'react-redux';

const { Search } = Input;

const aggregateTotals = (branchData) => {
    if (!branchData || branchData.length === 0) return {};
    
    return branchData.reduce((acc, branch) => ({
        'Total Branches': (acc['Total Branches'] || 0) + 1,
        'Total Revenue': (acc['Total Revenue'] || 0) + (branch['Total Revenue'] || 0),
        'Total Downpayment': (acc['Total Downpayment'] || 0) + (branch['Total Downpayment'] || 0),
        'Running Accounts': (acc['Running Accounts'] || 0) + (branch['Running Accounts'] || 0),
        'Total GP': (acc['Total GP'] || 0) + (branch['Total GP'] || 0),
    }), {});
};
 const NON_MONETARY_FIELDS = [
  "Running Accounts",
];  
const CardBranchSales = ({ startDate, endDate, compareDates, compareEnabled }) => {
    const { selectedCurrency, exchangeRates } = useSelector(state => state.currency);    
    const convert =(value)=> convertValue(value, selectedCurrency, exchangeRates);
    const symbol = getCurrencySymbol(selectedCurrency);

    const [searchText, setSearchText] = useState('');
    const { compareStartDate, compareEndDate } = compareDates || {};
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });

    // Fetch data using SWR
    const { data: branches, error, isLoading } = useSWR(
        ['/sap/analytics/branch-sale', startDate, endDate],
        () => fetchBranchSalesSap(startDate, endDate)
    );
    
    const { data: branches_compare } = useSWR(
        compareEnabled && compareStartDate && compareEndDate
            ? ['/sap/analytics/branch-sale-compare', compareStartDate, compareEndDate]
            : null,
        () => fetchBranchSalesSap(compareStartDate, compareEndDate),
        SWROnceFetchSetting
    );

    const branchData = branches || [];
    const totals = aggregateTotals(branchData);
    const totals_compare = compareEnabled ? aggregateTotals(branches_compare) : null;

    // Merge branch data with comparison data
    const mergedBranchData = branchData.map((branch) => {
        const compareBranch = compareEnabled && branches_compare
            ? branches_compare.find((b) => b.BranchCode === branch.BranchCode)
            : null;
            
        return {
            ...branch,
            compareRunningAccounts: compareBranch?.["Running Accounts"] || 0,
            compareGP: compareBranch?.["Total GP"] || 0,
            compareRevenue: compareBranch?.["Total Revenue"] || 0,
            compareDownpayment: compareBranch?.["Total Downpayment"] || 0,
        };
    });

    // Filter data based on search
    const filteredData = searchText
        ? mergedBranchData.filter(
            item =>
                item['BranchName']?.toLowerCase().includes(searchText.toLowerCase()) ||
                item['BranchCode']?.toLowerCase().includes(searchText.toLowerCase())
        )
        : mergedBranchData;

    // Handle branch click
    const handleBranchClick = (branch) => {
        setSelectedBranch(branch);
        console.log('Branch clicked:', branch);
    };

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
                    <div style={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                        {symbolHTML}{key === 'Running Accounts' 
                            ? currentValue.toLocaleString() 
                            : formatCurrency(currentValue)
                        }
                        {compareEnabled && (
                            <ChangeInValuesPercent 
                                previous={compareValue} 
                                current={currentValue} 
                            />
                        )}
                    </div>
                    {compareEnabled && (
                        <span style={{ fontSize: 12, color: '#8c8c8c', marginTop: '2px' }}>
                            {symbolHTML}{key === 'Running Accounts' 
                                ? compareValue.toLocaleString()
                                : formatCurrency(compareValue)
                            }
                        </span>
                    )}
                </div>
            );
        }
    });

    // Table columns
    const columns = [
        {
            title: 'Branch',
            dataIndex: 'BranchCode',
            key: 'BranchCode',
            sorter: (a, b) => (a['BranchCode'] || '').localeCompare(b['BranchCode'] || ''),
            fixed: 'left',
            render: (text) => (
                <span className="branch-name">
                    <ShopOutlined className="branch-icon" /> {text || "N/A"}
                </span>
            ),
        },
        renderCell('Accounts', 'Running Accounts', 'compareRunningAccounts'),
        renderCell('GP', 'Total GP', 'compareGP'),
        renderCell('Revenue', 'Total Revenue', 'compareRevenue'),
        renderCell('Downpayment', 'Total Downpayment', 'compareDownpayment'),
    ];

    // Summary row
    const summary = () => {
        const summaryKeys = ['Total Branches', 'Running Accounts', 'Total GP', 'Total Revenue', 'Total Downpayment'];
        
        return (
            <Table.Summary fixed>
                <Table.Summary.Row className="summary-row">
                    {summaryKeys.map(key => {
                        const isBranches = key === 'Total Branches';
                        const showCompare = compareEnabled && totals_compare && !isBranches;
                        const currentTotal = totals[key] || 0;
                        const compareTotal = totals_compare?.[key] || 0;
                        
                        return (
                            <Table.Summary.Cell key={key}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <strong>
                                        {isBranches 
                                            ? `Total (${currentTotal})` 
                                            : key === 'Running Accounts'
                                                ? currentTotal.toLocaleString()
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
                                        {key === 'Running Accounts'
                                            ? compareTotal.toLocaleString()
                                            : formatCurrency(compareTotal)
                                        }
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
            className="branch-sales-card my-4"
            title={
                <div className="card-header-wrapper">
                    <h4 className="card-title">
                        Sales by Branch
                        <Tooltip title="Shows sales distribution by branch">
                            <InfoCircleOutlined className="info-icon ml-2" />
                        </Tooltip>
                    </h4>
                </div>
            }
            loading={isLoading}
            extra={
                <Search
                    placeholder="Search branches..."
                    allowClear
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                    prefix={<SearchOutlined />}
                />
            }
        >
            {error && (
                <div className="error-container">
                    <p>Failed to load branch data</p>
                </div>
            )}

            {!error && !isLoading && branchData.length === 0 && (
                <Empty description="No branch data available" />
            )}

            {!error && !isLoading && branchData.length > 0 && (
                <div className="table-container-branch-sales">
                    {filteredData.length === 0 ? (
                        <Empty description="No branches match your search" />
                    ) : (
                        <Table
                            dataSource={filteredData}
                            columns={columns}
                            pagination={{
                                ...pagination,
                                showSizeChanger: true,
                                pageSizeOptions: ['15', '30', '60'],
                                onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                            }}
                            rowKey={(record, index) => record['BranchCode'] || `branch-${index}`}
                            size="small"
                            className="branch-table"
                            scroll={{ x: 'max-content' }}
                            summary={summary}
                            onRow={(record) => ({
                                onClick: () => handleBranchClick(record),
                                className: selectedBranch && selectedBranch['BranchCode'] === record['BranchCode'] ? 'selected-row' : ''
                            })}
                        />
                    )}
                </div>
            )}
        </Card>
    );
};

export default CardBranchSales;