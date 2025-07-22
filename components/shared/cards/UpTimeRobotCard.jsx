"use client";
import { useState } from "react";
import {
  Card,
  Spin,
  Empty,
  Typography,
  Tooltip,
  Tag,
  Row,
  Col,
  Progress,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LinkOutlined,
  LoadingOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { getMonitors } from "~/api/uptimeServices";
import useSWR from "swr";

const { Title, Text } = Typography;

const UpTimeRobotCard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { data: monitors = [], isLoading } = useSWR('uptime-monitors', getMonitors);
  console.log(monitors, 'data');
  // Common styles
  const tagStyle = {
    padding: "4px 8px",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const statusTagStyle = {
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
  };

  // Helper functions
  const getStatusTag = (status) => {
    if (status === 2) {
      return (
        <Tag
          color="success"
          icon={<CheckCircleOutlined />}
          style={{
            ...statusTagStyle,
            padding: "0px 8px",
            width: "fit-content",
            gap: "0px",
            marginRight: "0px",
          }}
        >
          Up
        </Tag>
      );
    } else if (status === 0) {
      return (
        <Tag
          color="warning"
          icon={<ClockCircleOutlined />}
          style={{
            ...statusTagStyle,
            padding: "2px 8px",
            width: "auto",
            gap: "4px",
            marginRight: "0px",
          }}
        >
          Paused
        </Tag>
      );
    } else {
      return (
        <Tag
          color="error"
          icon={<CloseCircleOutlined />}
          style={{
            ...statusTagStyle,
            padding: "2px 8px",
            width: "auto",
            gap: "4px",
            marginRight: "0px",
          }}
        >
          Down
        </Tag>
      );
    }
  };

  const truncateUrl = (url) => {
    const domain = url.replace(/^https?:\/\//, "").split("/")[0];
    return domain.length > 15 ? domain.substring(0, 12) + "..." : domain;
  };

  // Calculate summary stats
  const totalMonitors = monitors.length;
  const upMonitors = monitors.filter((m) => m.status === 2).length;
  const pausedMonitors = monitors.filter((m) => m.status === 0).length;
  const downMonitors = totalMonitors - upMonitors - pausedMonitors;
  const upPercentage = totalMonitors ? Math.round((upMonitors / (totalMonitors - pausedMonitors || 1)) * 100) : 0;


  // Filter monitors based on active tab
  const displayedMonitors = (
    activeTab === "all"
      ? monitors
      : activeTab === "up"
        ? monitors.filter((m) => m.status === 2)
        : activeTab === "paused"
          ? monitors.filter((m) => m.status === 0)
          : monitors.filter((m) => m.status === 1)
  ).slice(0, 8);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 w-full">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: "#1890ff" }} spin />} tip="Loading monitors..." />
      </div>
    );
  }

  if (!monitors.length) {
    return <Empty description="No monitors found" className="my-4" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <div className="mb-4 p-1 rounded-lg">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Title level={4} style={{ margin: 0, display: "flex", alignItems: "center" }}>
          <HistoryOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          Uptime Monitors
        </Title>

        <div className="flex gap-2">
          {["all", "up", "paused", "down"].map((tab) => (
            <Tag
              key={tab}
              color={
                activeTab === tab
                  ? (tab === "up"
                    ? "success"
                    : tab === "down"
                      ? "error"
                      : tab === "paused"
                        ? "warning"
                        : "blue")
                  : "default"
              }
              onClick={() => setActiveTab(tab)}
              style={tagStyle}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} (
              {tab === "all"
                ? totalMonitors
                : tab === "up"
                  ? upMonitors
                  : tab === "paused"
                    ? pausedMonitors
                    : downMonitors})
            </Tag>
          ))}
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Text strong className="text-base">System Status</Text>
          <Text
            className="text-lg font-bold"
            style={{ color: upPercentage > 90 ? "#52c41a" : upPercentage > 70 ? "#faad14" : "#f5222d" }}
          >
            {upPercentage}% Online
          </Text>
        </div>
        <Progress
          percent={upPercentage}
          size="small"
          strokeColor={{ from: "#108ee9", to: "#87d068" }}
          status={upPercentage === 100 ? "success" : "active"}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{upMonitors} services up</span>
          <span>{downMonitors} services down</span>
        </div>
      </div>

      <Row gutter={[12, 12]}>
        {displayedMonitors.map((monitor) => {
          const randomUptime = Math.floor(Math.random() * 8) + 92;
          return (
            <Col
              key={monitor.id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={Math.floor(24 / Math.min(3, displayedMonitors.length))}
            >
              <Card
                hoverable
                className="monitor-card"
                bodyStyle={{ padding: "12px" }}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  height: "100%",
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <Tooltip title={monitor.friendly_name}>
                    <Text
                      strong
                      style={{
                        fontSize: "14px",
                        maxWidth: "70%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {monitor.friendly_name.length > 18
                        ? monitor.friendly_name.substring(0, 18) + "..."
                        : monitor.friendly_name}
                    </Text>
                  </Tooltip>
                </div>

                <Tooltip title={monitor.url}>
                  <Text type="secondary" className="text-xs d-flex align-items-center" style={{ opacity: 0.8 }}>
                    <LinkOutlined className="mr-1" />
                    <span className="truncate">{truncateUrl(monitor.url)}</span>
                  </Text>
                </Tooltip>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <BarChartOutlined style={{ fontSize: "12px", color: "#8c8c8c", marginRight: "4px" }} />
                    <Text type="secondary" className="text-xs">{randomUptime}% uptime</Text>
                  </div>
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <div>
                      <ClockCircleOutlined style={{ fontSize: "12px", color: "#8c8c8c", marginRight: "4px" }} />
                      <Text type="secondary" className="text-xs">{Math.floor(Math.random() * 40) + 10}ms</Text>
                    </div>
                    {getStatusTag(monitor.status)}
                  </div>
                </div>

                {monitor.status === 2 && (
                  <div className="absolute top-2 right-2">
                    <span className="pulse-dot"></span>
                  </div>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>

      <style jsx global>{`
        .monitor-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #52c41a;
          position: absolute;
          right: 4px;
          top: 4px;
        }

        .pulse-dot:before {
          content: "";
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: rgba(82, 196, 26, 0.3);
          top: -4px;
          left: -4px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.7); opacity: 1; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(0.7); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default UpTimeRobotCard;