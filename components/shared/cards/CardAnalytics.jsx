import React, { useState, useEffect, useMemo } from "react";
import { Select, Spin, Alert } from "antd";
import {
  UserOutlined,
  FileOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ChangeInValuesPercent from "~/components/elements/basic/ChangeInValuesPercent";

const { Option } = Select;

// Analytics card configuration
const CARD_CONFIG = [
  {
    key: "totalActiveUsers",
    title: "Active Users",
    icon: UserOutlined,
    iconClass: "fa-users",
  },
  {
    key: "totalNewUsers",
    title: "New Users",
    icon: FileOutlined,
    iconClass: "fa-file",
  },
  {
    key: "totalReturningUsers",
    title: "Returning Users",
    icon: LineChartOutlined,
    iconClass: "fa-line-chart",
  },
];

const Card = ({ data, loading, compareData, compareEnabled }) => (
  <div
    className="row dash-card justify-content-between px-4 px-sm-0"
    style={{ columnGap: "10px" }}
  >
    {data.map((item, index) => {
      const compareItem = compareData?.[index];
      const showComparison = compareEnabled && compareItem && !loading;

      return (
        <div
          key={item.key}
          className="col-md-4 col mb-4 rounded-lg p-3 shadow-custom"
        >
          <div className="d-flex align-items-center justify-content-start">
            <div className="color-white icon py-2 mr-3">
              <i
                className={`fa ${item.iconClass} m-0 p-0`}
                aria-hidden="true"
              ></i>
            </div>
            <div className="flex-grow-1">
              <p
                className="m-0 p-0 text-muted"
                style={{ fontSize: showComparison ? "12px" : "14px" }}
              >
                {item.title}
              </p>
              <div className="d-flex align-items-center">
                <h2
                  className="m-0 p-0"
                  style={showComparison ? { fontSize: "14px" } : {}}
                >
                  {loading ? (
                    <Spin size="small" />
                  ) : (
                    item.value?.toLocaleString() || "0"
                  )}
                </h2>
                {showComparison && (
                  <ChangeInValuesPercent
                    current={item.value}
                    previous={compareItem.value}
                  />
                )}
              </div>
              {showComparison && (
                <small className="text-muted">
                  {compareItem.value?.toLocaleString() || "0"}
                </small>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const CardAnalytics = ({
  startDate,
  endDate,
  compareDates,
  compareEnabled,
}) => {
  const [currentData, setCurrentData] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [compareLoading, setCompareLoading] = useState(false);
  const [device, setDevice] = useState("website");
  const [error, setError] = useState(null);

  const { compareStartDate, compareEndDate } = compareDates || {};

  // Fetch analytics data
  const fetchAnalytics = async (start, end, isCompare = false) => {
    try {
      const response = await axios.get("/api/analytics", {
        params: {
          startDate: start,
          endDate: end,
          device: device,
        },
      });

      if (response.data) {
        const data = CARD_CONFIG.map((config) => ({
          ...config,
          value: response.data[config.key] || 0,
        }));

        if (isCompare) {
          setCompareData(data);
        } else {
          setCurrentData(data);
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError(error.message || "Failed to load analytics data");
      throw error;
    }
  };

  // Fetch current period data
  useEffect(() => {
    const loadCurrentData = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchAnalytics(startDate, endDate);
      } catch (error) {
        // Error handled in fetchAnalytics
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      loadCurrentData();
    }
  }, [startDate, endDate, device]);

  // Fetch comparison period data
  useEffect(() => {
    const loadCompareData = async () => {
      setCompareLoading(true);
      try {
        await fetchAnalytics(compareStartDate, compareEndDate, true);
      } catch (error) {
        // Error handled in fetchAnalytics
      } finally {
        setCompareLoading(false);
      }
    };

    if (compareEnabled && compareStartDate && compareEndDate) {
      loadCompareData();
    } else {
      setCompareData(null);
    }
  }, [compareEnabled, compareStartDate, compareEndDate, device]);

  // Display data with loading state
  const displayData = useMemo(() => {
    if (!currentData) {
      return CARD_CONFIG.map((config) => ({
        ...config,
        value: null,
      }));
    }
    return currentData;
  }, [currentData]);

  return (
    <div className="ps-card ps-card--earning">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="card-title m-0">Analytics Overview</h4>
        <Select
          defaultValue="website"
          style={{ width: 140 }}
          onChange={setDevice}
          loading={loading}
        >
          <Option value="website">Website</Option>
          <Option value="app">Mobile App</Option>
        </Select>
      </div>

      {error ? (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      ) : (
        <Card
          data={displayData}
          loading={loading}
          compareData={compareData}
          compareEnabled={compareEnabled && !compareLoading}
        />
      )}
    </div>
  );
};

export default CardAnalytics;
