import React, { useState, useMemo } from 'react';
import { Card, Empty, Spin, Alert, Badge } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import useSWR from 'swr';
import { getOrderArea } from '~/api/orderService';
import { toTitleCase, SWROnceFetchSetting } from '~/util';
import ChangeInValuesPercent from '~/components/elements/basic/ChangeInValuesPercent';

const GRADIENTS = [
    'linear-gradient(135deg, #FFF8E5 0%, #C2A349 100%)',
    'linear-gradient(135deg, #F0F5E7 0%, #93B25F 100%)',
    'linear-gradient(135deg, #F9ECE5 0%, #CE7855 100%)',
    'linear-gradient(135deg, #DFEEFC 0%, #589BC9 100%)',
];

const CardTopAreas = ({ startDate, endDate, compareDates, compareEnabled }) => {
    const { compareStartDate, compareEndDate } = compareDates || {};
    const [visibleCount, setVisibleCount] = useState(8);


    const { data: areaData, error, isLoading } = useSWR(
        ['orderArea', startDate, endDate],
        () => getOrderArea(startDate, endDate).then(res => res.data)
    );

 
    const { data: areaDataCompare } = useSWR(
        compareEnabled 
            ? ['orderAreaCompare', compareStartDate, compareEndDate]
            : null,
        () => getOrderArea(compareStartDate, compareEndDate).then(res => res.data),
        SWROnceFetchSetting
    );

    // Merge and sort data
    const mergedData = useMemo(() => {
        if (!areaData) return [];
        
        return areaData.map((item, index) => {
            const compareItem = areaDataCompare?.find(c => c.area === item.area);
            return {
                ...item,
                rank: index + 1,
                comparePercentage: compareItem?.percentage || 0,
            };
        }).sort((a, b) => b.percentage - a.percentage);
    }, [areaData, areaDataCompare]);

    const maxPercentage = useMemo(() => 
        Math.max(...mergedData.map(item => item.percentage), 1),
        [mergedData]
    );

    
    if (error) {
        return (
            <Card className="ps-card ps-card--top-areas mt-4">
                <Alert
                    message="Error"
                    description="Unable to load area data"
                    type="error"
                    showIcon
                />
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="ps-card ps-card--top-areas mt-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
                    <Spin size="large" />
                </div>
            </Card>
        );
    }

    if (!mergedData.length) {
        return (
            <Card className="ps-card ps-card--top-areas mt-4">
                <Empty description="No area data available" />
            </Card>
        );
    }

    const visibleData = mergedData.slice(0, visibleCount);
    const remaining = mergedData.length - visibleCount;

    return (
        <section className="ps-card ps-card--top-areas mt-4">
            <div className="ps-card__header d-flex justify-content-between align-items-center mb-4">
                <h4 className="d-flex align-items-center mb-0">
                    <TrophyOutlined style={{ fontSize: '20px', color: '#fbbf24', marginRight: '8px' }} />
                    Top Areas
                </h4>
            </div>

            <div className="ps-card__content">
                <div className="row" >
                    {visibleData.map((item, index) => (
                        <div className="col-xl-3 col-lg-3 col-md-3 col-6 mb-3 px-0 pr-2" key={item.area} >
                            <div 
                                className="card h-100 border-0 shadow-sm area-card"
                                style={{ borderRadius: '12px', cursor: 'pointer' }}
                            >
                                <div className="card-body p-3">
                                    {/* Header */}
                                    <div className="d-flex justify-content-between align-items-start mb-2 ">
                                        <Badge 
                                            count={index + 1}
                                            style={{ 
                                                background: GRADIENTS[index % GRADIENTS.length],
                                                fontWeight: '700'
                                            }}
                                        />
                                        {index === 0 && <TrophyOutlined style={{ color: '#fbbf24', fontSize: '16px' }} />}
                                    </div>

                                    {/* Area Name */}
                                    <h6 className="card-title mb-2 area-title" style={{ fontSize: '12px' }}>
                                        {toTitleCase(item.area)}
                                    </h6>

                                    {/* Percentage with change */}
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="percentage-value">
                                            {item?.percentage?.toFixed(3)}%
                                        </span>
                                        {compareEnabled && (
                                            <ChangeInValuesPercent 
                                                current={item.percentage}
                                                previous={item.comparePercentage}
                                            />
                                        )}
                                    </div>

                                    {/* Progress bar */}
                                    <div className="progress mb-2" style={{ height: '3px' }}>
                                        <div 
                                            className="progress-bar"
                                            style={{
                                                width: `${(item.percentage / maxPercentage) * 100}%`,
                                                background: GRADIENTS[index % GRADIENTS.length],
                                                transition: 'width 1s ease-out',
                                            }}
                                        />
                                    </div>

                                    {/* Comparison info */}
                                    {compareEnabled && (
                                        <div className="comparison-box">
                                            <span>Previous</span>
                                            <span className="font-weight-600">
                                                {item.comparePercentage?.toFixed(3)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Show More/Less buttons */}
                <div className="d-flex justify-content-center gap-3 mt-4">
                    {remaining > 0 && (
                        <button
                            className="btn btn-secondary"
                            onClick={() => setVisibleCount(prev => Math.min(prev + 8, mergedData.length))}
                            style={{ background: '#8BBABB', border: 'none' }}
                        >
                            Show More ({remaining} remaining)
                        </button>
                    )}
                    {visibleCount > 8 && (
                        <button
                            className="btn btn-outline-secondary ml-2"
                            onClick={() => setVisibleCount(8)}
                            style={{ borderColor: '#8BBABB', color: '#8BBABB' }}
                        >
                            Show Less
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
                .area-card {
                    transition: all 0.3s ease;
                }
                .area-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                }
                .area-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #1e293b;
                    line-height: 1.3;
                    min-height: 36px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .percentage-value {
                    font-size: 20px;
                    font-weight: 800;
                    color: #1e293b;
                }
                .comparison-box {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    background-color: #f8fafc;
                    border-radius: 6px;
                    font-size: 12px;
                }
                .comparison-box span:first-child {
                    color: #64748b;
                    font-weight: 500;
                }
                .comparison-box span:last-child {
                    color: #475569;
                    font-weight: 600;
                }
                .progress {
                    background-color: #f1f5f9;
                    border-radius: 2px;
                }
            `}</style>
        </section>
    );
};

export default CardTopAreas;