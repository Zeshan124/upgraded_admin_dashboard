import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Tooltip } from 'antd'; // This was missing in your import
import { CreditCheckCount } from '~/api/analyticsService';
import { fetchOrderByCreditStatus } from '~/api/OMSService';
import { toTitleCase } from '~/util';

const fetcherCC = async ([url, startDate, endDate]) => (await CreditCheckCount(url, startDate, endDate));
const fetcherCCNew = async ([
    url,
    startDate,
    endDate,
    previousStartDate,
    previousEndDate,
]) => {
    return await fetchOrderByCreditStatus(
        startDate,
        endDate,
        previousStartDate,
        previousEndDate
    );
};

const CardPortalStatus = ({ startDate, endDate, compareDates, compareEnabled }) => {
    const { data: oldCC, error: oldError } = useSWR(['/old-credit-status-change', startDate, endDate], fetcherCC);
    const { data: newCC, error: newErrorCC } = useSWR(["/new-credit-status-change", startDate, endDate, compareDates?.compareStartDate, compareDates?.compareEndDate], fetcherCCNew);
    const [dataToShow, setDataToShow] = useState(null);

    // Define the threshold date as August 1st
    const thresholdDate = new Date('2024-08-01');
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const determineClassAndIcon = (difference) => {
        // Remove the percentage sign and parse as float
        const diffValue = parseFloat(difference?.replace('%', ''));
        if (diffValue < 0) {
            return { className: "desc", icon: "icon-arrow-down" };
        } else {
            return { className: "asc", icon: "icon-arrow-up" };
        }
    };

    useEffect(() => {
        // Logic to determine which data to show based on the dates
        if (startDateObj >= thresholdDate || endDateObj >= thresholdDate) {
            // If either startDate or endDate is on or after August 1st, show newCC data
            setDataToShow(newCC);
        } else {
            // If both startDate and endDate are before August 1st, show oldCC data
            setDataToShow(oldCC);
        }
    }, [newCC, oldCC, startDateObj, endDateObj, thresholdDate]);

    // MOVED this check after all the hooks are called
    if (oldError || newErrorCC) return <div>Failed to load</div>;
    if (!dataToShow) return <div>Loading...</div>;

    const classbg = {
        expressCountInCC: 'express',
        expressCountInECIB: 'express',
        quickDeliveryBranchesCount: 'express',
        quickDeliveryOthersCount: 'express',
        superExpressCount: 'express',
        defaulterCountInCC: 'pink',
        defaulterCountINECIB: 'pink',
        normalCount: 'blue',
        totalOrderCount: 'pink',
    }
    const iconBig = {
        expressCountInCC: 'icon-checkmark-circle',
        expressCountInECIB: 'icon-checkmark-circle',
        quickDeliveryBranchesCount: 'icon-file-check',
        quickDeliveryOthersCount: 'icon-file-check',
        superExpressCount: 'icon-file-check',
        defaulterCountINECIB: 'icon-shield-cross',
        defaulterCountInCC: 'icon-shield-cross',
        normalCount: 'icon-user',
        totalOrderCount: 'icon-cart',
    }
    let datakeys = ['expressCountInCC', 'expressCountInECIB', 'quickDeliveryBranchesCount', 'quickDeliveryOthersCount', 'superExpressCount', 'normalCount',
        'defaulterCountINECIB', 'defaulterCountInCC', 'totalOrderCount']

    if (startDateObj >= thresholdDate) {
        datakeys = datakeys.filter(key => key !== 'superExpressCount');
    }

    return (
        <section className="ps-card ps-card--statics mt-2">
            <h2 className='text-section'>Credit Engine</h2>
            <h4>Portal Status</h4>

            <div className="ps-card__content">
                {(datakeys || [])?.map((key, index) => {
                    const currentValue = dataToShow?.current[key];
                    const previousValue = dataToShow?.previous?.[key];
                    const difference = dataToShow?.differences[`${key}Difference`];
                    const { className, icon } = determineClassAndIcon(difference);
                    const iconDisplay = iconBig[key]
                    return (
                        <div className={`ps-block--stat ${classbg[key]}`} key={index}>
                            <div className="ps-block__left">
                                <span>
                                    <i className={iconDisplay}></i>
                                </span>
                            </div>
                            <div className="ps-block__content ">
                                <p className='text-nowrap'>{toTitleCase(
                                    key
                                        .replace(/([A-Z])([A-Z])/g, '$1$2') // Keep consecutive uppercase letters together
                                        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before a single uppercase letter following a lowercase letter
                                        .replace(/Count/i, '') // Remove "Count"
                                        .trim()
                                        .replace(/Quick Delivery/i, 'QD') // Custom replacements for shorter labels
                                )}</p>
                                <h4>
                                    {compareEnabled && (<span className="prev-label">Curr:</span>)}
                                    {currentValue?.toLocaleString() || "..."}
                                    <small className={className}>
                                        <i className={icon}></i>
                                        <span>{difference || "00"}</span>
                                    </small>
                                </h4>
                                {compareEnabled && previousValue && (
                                    <div className="stat-prev-container">
                                        <Tooltip title={previousValue?.toLocaleString() ?? "-"}>
                                            <div className="stat-previous">
                                                <span className="prev-label">Previous:</span>
                                                <span className="prev-value">
                                                    {previousValue?.toLocaleString() ?? "-"}
                                                </span>
                                            </div>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}

export default CardPortalStatus;