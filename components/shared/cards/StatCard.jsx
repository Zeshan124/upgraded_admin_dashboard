// import DateLabel from "~/components/utils/DateLabel";
import { convertValue, getCurrencySymbol, NumbertoAbbreviatedForms } from "~/util";
import { Tooltip } from 'antd';
import { useSelector } from "react-redux";



const loadingDots = <span className="loading-dots"></span>


const title = {
    "Running Accounts": 'No of Loans (Unposted)',
    "Total Downpayment": 'Down payment',
    "Total GP": 'Gross Profit',
    "Total Revenue": 'Revenue',

}


const NON_MONETARY_FIELDS = [
  "Running Accounts",
];

export default function StatCard({ value = loadingDots, label = loadingDots,Unposted,  dates, diff = loadingDots, previous = loadingDots, compareEnabled }) {
    const { selectedCurrency, exchangeRates } = useSelector(state => state.currency);
    const isNonMonetary = NON_MONETARY_FIELDS.includes(label);
    const isNumber = typeof value === "number";
    const convert =(value)=>  convertValue(value, selectedCurrency, exchangeRates);
    const symbol = getCurrencySymbol(selectedCurrency);
  
    const formattedValue = isNumber ? !isNonMonetary  ? NumbertoAbbreviatedForms(convert(value)) : value?.toLocaleString('en-US') : value;
    const badgeClass = parseFloat(diff) < 0 ? "badge--red" : "badge--green";
    const formattedTitle = isNumber && !isNonMonetary ? convert(value).toLocaleString(undefined, { maximumFractionDigits: 0 }): value;

    const diffValue = parseFloat(diff) > 0 ? `+${diff}` : diff;
    console.log(previous, 'previous', compareEnabled)
    const formattedPrevious = !isNonMonetary  ? NumbertoAbbreviatedForms(convert(previous)) : previous?.toLocaleString('en-US');

  


    console.log()
    return (
        <div className="analytics-card">
            <div className="analytics-card-info">
                <p>{title[label] || label}</p>
                <Tooltip placement="bottom" title={formattedTitle}>
                    <h1 style={{ width: 'fit-content' }} >{!isNonMonetary && symbol}{formattedValue || 0}
                        {/* {Unposted && `(${Unposted})`} */}
                        <span className="unposted-count">
                            {Unposted != null && `(${Unposted})`}
                        </span>
                    </h1>
                </Tooltip>

                {compareEnabled && (
                    <div className="comparison-data">
                        <Tooltip placement="bottom" title={typeof previous === "number" ? previous.toLocaleString() : previous}>
                            <div className="prev-value-container">
                                <span className="prev-label">Previous:</span>
                                <span className="prev-values">{formattedPrevious || 0}</span>
                            </div>
                        </Tooltip>
                    </div>
                )}
            </div>
            <h2>
            <div className={`analytics-badge ${badgeClass}`}>
                <Tooltip placement="bottom" title={previous?.toLocaleString()}>{diffValue}</Tooltip>
            </div>
             {/* {DateLabel(dates) || 'Loading...'} */}
             </h2>
        </div>
    )
}


