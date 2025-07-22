import useSWR from "swr";
import { fetchTotalInstallementReceived, fetchUnpostedSAP, SaleRecords } from "~/api/OMSService";
import StatCard from "~/components/shared/cards/StatCard";

const intialCards = {
    "Running Accounts": '...',
    "Total Downpayment": '...',
    "Total GP": '...',
    "Total Revenue": '...',
};


export default function SalesRecord({ startDate, endDate, compareDates,compareEnabled }) {

  const { data: Revenues, error } = useSWR(
    ["/sap/analytics/total-sale", startDate, endDate, compareDates?.compareStartDate, compareDates?.compareEndDate],
    () => SaleRecords(startDate, endDate, compareDates?.compareStartDate, compareDates?.compareEndDate)
  );
  const { data: Unposted, error:errorUnpostedCount } = useSWR(
    ["/sap/analytics/unposted-order", startDate, endDate],
    () => fetchUnpostedSAP(startDate, endDate)
  );
  const { data: totalRecovery } = useSWR(
    ["/sap/analytics/total-recovery", startDate, endDate, compareDates?.compareStartDate, compareDates?.compareEndDate],
    () => fetchTotalInstallementReceived(startDate, endDate, compareDates?.compareStartDate, compareDates?.compareEndDate)
  );


  const getValue = (data, key) => data?.[key] || 0;
  const revenue = getValue(Revenues?.current, "Total Revenue");
  const downpayment = getValue(Revenues?.current, "Total Downpayment");
  const grossProfit = getValue(Revenues?.current, "Total GP");
  const installment = getValue(totalRecovery, "currentTotal");

  const prevRevenue = getValue(Revenues?.previous, "Total Revenue");
  const prevDownpayment = getValue(Revenues?.previous, "Total Downpayment");
  const prevGrossProfit = getValue(Revenues?.previous, "Total GP");
  const prevInstallment = getValue(totalRecovery, "previousTotal");
  
  const isLoading = !Revenues?.current || !totalRecovery?.currentTotal;
  // Net Investment Calculation
  const netInvestment = !isLoading && revenue - downpayment - installment - grossProfit;
  const prevNetInvestment = !isLoading &&  prevRevenue - prevDownpayment - prevInstallment - prevGrossProfit;
  const netDifference = !isLoading &&  prevNetInvestment ? ((netInvestment - prevNetInvestment) / prevNetInvestment) * 100 : 0;



  

  return (
    <>
        <h1 style={{
            fontSize: '22px',
          fontWeight: '600',
          color: '#222',
          marginBottom: 0,
        }} className="mb-4">Financial Highlights</h1>
        <div className="row justify-content-center mb-3 px-1" style={{rowGap:'20px'}}>
        {Object.keys(Revenues?.current || intialCards).map((item, i) => (
            <div className="col-6 col-lg-6 px-2" key={i}>
              {console.log(item,'item')}
            <StatCard
                value={Revenues?.current[item]}
                label={item}
                dates={{ startDate, endDate }}
                Unposted={item === "Running Accounts" ? Unposted?.unpostedForm : null}
                previous={Revenues?.previous[item]}
                diff={Revenues?.differences[`${item}Difference`]}
                compareEnabled={compareEnabled}
            />
            </div>
        ))}
        <div className="col-6 col-lg-6 px-2" >
          <StatCard
            value={totalRecovery?.currentTotal}
            label={'Total Recovery'}
            dates={{ startDate, endDate }}
            previous={totalRecovery?.previousTotal}
            diff={totalRecovery?.difference}
            compareEnabled={compareEnabled}
          />
        </div>
        <div className="col-6 col-lg-6 px-2" >
          <StatCard value={netInvestment} label="Net Investment" dates={{ startDate, endDate }} previous={prevNetInvestment} diff={`${netDifference.toFixed(2)}%`} compareEnabled={compareEnabled} />
        </div>
        </div>
    </>
  );
}



