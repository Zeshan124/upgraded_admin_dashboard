import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { CitySource } from "~/services/analyticsService";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const fetcher = async (start, end, prevStart, prevEnd) => {
  const response = await CitySource(start, end, prevStart, prevEnd);
  return response?.differences || [];
};

const CardCityPieChart = ({
  startDate,
  endDate,
  compareDates,
  compareEnabled,
}) => {
  const { compareStartDate, compareEndDate } = compareDates || {};
  const { data, error } = useSWR(
    [
      "/api/analytics/citiesCount",
      startDate,
      endDate,
      compareStartDate,
      compareEndDate,
    ],
    () => fetcher(startDate, endDate, compareStartDate, compareEndDate)
  );

  const chartData = useMemo(() => {
    // Enhanced data validation
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        series: [],
        options: {
          chart: {
            height: 500,
            type: "bar",
            toolbar: { show: false },
          },
          noData: {
            text: "No data available",
            align: "center",
            verticalAlign: "middle",
          },
        },
      };
    }

    // Filter out invalid data entries
    const validData = data.filter(
      (city) =>
        city &&
        typeof city === "object" &&
        city.cityName &&
        typeof city.currentOrderCount === "number" &&
        !isNaN(city.currentOrderCount)
    );

    if (validData.length === 0) {
      return {
        series: [],
        options: {
          chart: {
            height: 500,
            type: "bar",
            toolbar: { show: false },
          },
          noData: {
            text: "No valid data available",
            align: "center",
            verticalAlign: "middle",
          },
        },
      };
    }

    const categories = validData.map((city) => city.cityName || "Unknown");
    const series = [];

    // Current period data
    series.push({
      name: "Current Period",
      data: validData.map((city) => Number(city.currentOrderCount) || 0),
      color: "#26A0FC",
    });

    // Previous period data (only if compare is enabled)
    if (compareEnabled) {
      series.push({
        name: "Previous Period",
        data: validData.map((city) => Number(city.previousOrderCount) || 0),
        color: "#a0aec0",
      });
    }

    return {
      series,
      options: {
        chart: {
          height: 500,
          type: "bar",
          toolbar: { show: false },
          stacked: false,
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: "end",
            horizontal: true,
            dataLabels: { position: "center" },
            barHeight: "80%",
          },
        },
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          formatter: function (val, opts) {
            try {
              const dataPoint = validData[opts.dataPointIndex];
              if (compareEnabled && opts.seriesIndex === 0 && dataPoint) {
                const change = dataPoint.percentageChange;
                if (change !== undefined && change !== null) {
                  const changeValue = parseFloat(change);
                  if (!isNaN(changeValue)) {
                    const changeFormatted = changeValue > 0 ? `+${change}` : `${change}`;
                    return `${val} (${changeFormatted})`;
                  }
                }
              }
              return val.toString();
            } catch (e) {
              console.warn("Error formatting data label:", e);
              return val.toString();
            }
          },
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            colors: ["#161616"],
          },
          background: { enabled: false },
          dropShadow: { enabled: true, opacity: 0.3 },
        },
        stroke: { 
          width: 1, 
          colors: ["#fff"] 
        },
        xaxis: {
          categories,
          labels: {
            formatter: function (val) {
              const numVal = Number(val);
              if (isNaN(numVal)) return val;
              return Math.abs(numVal) >= 1000
                ? (Math.abs(numVal) / 1000).toFixed(1) + "k"
                : Math.abs(numVal).toString();
            },
          },
        },
        yaxis: { 
          title: { text: "Cities" },
          labels: {
            maxWidth: 150,
            formatter: function (val) {
              return val.length > 20 ? val.substring(0, 20) + "..." : val;
            },
          },
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (val, opts) {
              if (val === null || val === undefined) return "N/A";
              return val.toString();
            },
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              plotOptions: {
                bar: {
                  barHeight: "60%",
                },
              },
              dataLabels: {
                style: {
                  fontSize: "10px",
                },
              },
            },
          },
        ],
      },
    };
  }, [data, compareEnabled]);

  // Error handling
  if (error) {
    return (
      <div className="ps-card ps-card--earning mt-4 position-relative">
        <div className="ps-card__header d-flex justify-content-between align-items-center mb-0 pb-0">
          <h4>City Wise Orders</h4>
        </div>
        <div className="ps-card__content">
          <div className="text-center text-danger p-4">
            Error loading chart data: {error.message || "Unknown error"}
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (!data) {
    return (
      <div className="ps-card ps-card--earning mt-4 position-relative">
        <div className="ps-card__header d-flex justify-content-between align-items-center mb-0 pb-0">
          <h4>City Wise Orders</h4>
        </div>
        <div className="ps-card__content">
          <div className="text-center p-4">Loading chart data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ps-card ps-card--earning mt-4 position-relative">
      <div className="ps-card__header d-flex justify-content-between align-items-center mb-0 pb-0">
        <h4>City Wise Orders</h4>
      </div>
      <div className="ps-card__content ps-card__PIE">
        {chartData.series.length > 0 ? (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={500}
          />
        ) : (
          <div className="text-center p-4">
            <p>No data available for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardCityPieChart;