import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chart,
  DataChart,
  Diagram,
  Distribution,
  Heading,
  Layer,
  Meter,
  Spinner,
  Text,
  WorldMap,
} from "grommet";
import { Close, Refresh } from "grommet-icons";
import "./Charts.css";

const fallbackData = [
  { date: "2026-08-28", views: 420, likes: 80 },
  { date: "2026-08-29", views: 610, likes: 120 },
  { date: "2026-08-30", views: 540, likes: 105 },
  { date: "2026-08-31", views: 840, likes: 180 },
  { date: "2026-09-01", views: 760, likes: 160 },
];

const Stat = ({ label, value, detail, color = "brand" }) => (
  <Box
    background="background-front"
    border={{ color: "border", size: "xsmall" }}
    pad="medium"
    gap="xsmall"
    flex="grow"
  >
    <Text size="small" color="text-weak">
      {label}
    </Text>

    <Text size="xxlarge" weight="bold">
      {value}
    </Text>

    <Text size="small" color={color}>
      {detail}
    </Text>
  </Box>
);

const Panel = ({ title, subtitle, children, className = "" }) => (
  <Box
    className={`charts-panel ${className}`}
    background="background-front"
    border={{ color: "border", size: "xsmall" }}
    pad="medium"
    gap="medium"
  >
    <Box gap="xxsmall" flex={false}>
      <Text weight="bold" size="medium">
        {title}
      </Text>

      <Text size="small" color="text-weak">
        {subtitle}
      </Text>
    </Box>

    <Box className="charts-panel-content">{children}</Box>
  </Box>
);

const Charts = ({ onClose }) => {
  const [apiData, setApiData] = useState([]);
  const [status, setStatus] = useState("loading");

  const loadData = async () => {
    setStatus("loading");

    try {
      const response = await fetch("https://dummyjson.com/posts");

      if (!response.ok) {
        throw new Error("Unable to load API data");
      }

      const result = await response.json();

      const posts = result?.posts || [];

      const data = posts.slice(0, 5).map((post, index) => ({
        date: `2026-08-${String(28 + index).padStart(2, "0")}`,
        views: post.views || 0,
        likes: post.reactions?.likes || 0,
      }));

      setApiData(data);
      setStatus(data.length > 0 ? "ready" : "empty");
    } catch (error) {
      console.error("Charts API error:", error);
      setApiData([]);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const chartData = apiData.length > 0 ? apiData : fallbackData;

  const renderChartPlaceholder = () => {
    if (status === "loading") {
      return (
        <Box align="center" justify="center" fill>
          <Spinner size="medium" />
        </Box>
      );
    }

    if (status === "error") {
      return (
        <Box align="center" justify="center" fill gap="small">
          <Text color="status-critical">API data unavailable</Text>

          <Button label="Retry" icon={<Refresh />} onClick={loadData} />
        </Box>
      );
    }

    if (status === "empty") {
      return (
        <Box align="center" justify="center" fill>
          <Text color="text-weak">No API records returned</Text>
        </Box>
      );
    }

    return undefined;
  };

  return (
    <Layer full responsive onEsc={onClose}>
      <Box fill background="background" overflow="auto">
        <Box
          className="charts-container"
          width={{ max: "xxlarge" }}
          alignSelf="center"
          fill="horizontal"
          pad={{
            horizontal: "medium",
            vertical: "medium",
          }}
          gap="medium"
        >
          {/* Header */}
          <Box
            direction="row"
            justify="between"
            align="start"
            gap="medium"
            flex={false}
          >
            <Box gap="xxsmall">
              <Heading level={2} margin="none">
                Charts
              </Heading>

              <Text color="text-weak">
                Analytics dashboard powered by Grommet visualizations
              </Text>
            </Box>

            <button
              className="charts-close"
              type="button"
              aria-label="Close Charts"
              onClick={onClose}
            >
              <Close />
            </button>
          </Box>

          {/* Statistics */}
          <Box
            className="charts-stats"
            direction="row"
            gap="small"
            wrap
            flex={false}
          >
            <Stat
              label="Total views"
              value="3,170"
              detail="+18.4% this period"
              color="status-ok"
            />

            <Stat
              label="Engagement"
              value="24.8%"
              detail="+4.2% from last week"
              color="status-ok"
            />

            <Stat
              label="Published posts"
              value="5"
              detail="From dummyjson API"
            />

            <Stat
              label="API status"
              value={status === "ready" ? "Live" : status}
              detail="dummyjson.com/posts"
              color={status === "ready" ? "status-ok" : "status-warning"}
            />
          </Box>

          {/* Traffic + Distribution */}
          <Box
            className="charts-two-column"
            direction="row"
            gap="medium"
            align="stretch"
            flex={false}
          >
            <Box className="charts-main-column" flex="grow">
              <Panel
                className="charts-chart-panel"
                title="Traffic over time"
                subtitle="DataChart: API views and likes"
              >
                <Box className="charts-chart-wrapper">
                  <DataChart
                    a11yTitle="Post views and likes over time"
                    data={chartData}
                    series={[
                      {
                        property: "views",
                        label: "Views",
                      },
                      {
                        property: "likes",
                        label: "Likes",
                      },
                    ]}
                    chart={[
                      {
                        property: "views",
                        type: "area",
                        color: "graph-0",
                      },
                      {
                        property: "likes",
                        type: "line",
                        color: "graph-2",
                      },
                    ]}
                    axis={{
                      x: {
                        property: "date",
                        granularity: "fine",
                      },
                      y: {
                        granularity: "medium",
                      },
                    }}
                    guide={{
                      x: true,
                      y: true,
                    }}
                    detail
                    placeholder={renderChartPlaceholder()}
                  />
                </Box>
              </Panel>
            </Box>

            <Box className="charts-side-column" flex="grow">
              <Panel
                title="Channel mix"
                subtitle="Distribution by acquisition channel"
              >
                <Box className="charts-distribution-wrapper">
                  <Distribution
                    a11yTitle="Distribution by channel"
                    fill
                    gap="small"
                    values={[
                      { value: 45, label: "Organic" },
                      { value: 30, label: "Social" },
                      { value: 15, label: "Referral" },
                      { value: 10, label: "Email" },
                    ]}
                  >
                    {({ value, label }) => (
                      <Box
                        fill
                        background={
                          label === "Organic"
                            ? "graph-0"
                            : label === "Social"
                              ? "graph-2"
                              : label === "Referral"
                                ? "graph-3"
                                : "graph-4"
                        }
                        pad="medium"
                        gap="xsmall"
                        justify="center"
                        round="xsmall"
                      >
                        <Text color="white" weight="bold" size="medium">
                          {label}
                        </Text>

                        <Text color="white" weight="bold" size="large">
                          {value}%
                        </Text>
                      </Box>
                    )}
                  </Distribution>
                </Box>
              </Panel>
            </Box>
          </Box>

          {/* KPI + World Map */}
          <Box
            className="charts-two-column charts-two-column-reverse"
            direction="row"
            gap="medium"
            align="stretch"
            flex={false}
          >
            {/* KPI */}
            <Box className="charts-side-column" flex="grow">
              <Panel
                title="KPI health"
                subtitle="Meter components for service objectives"
              >
                <Box gap="medium">
                  <Box gap="xsmall">
                    <Box direction="row" justify="between">
                      <Text>Conversion</Text>

                      <Text weight="bold">72%</Text>
                    </Box>

                    <Meter
                      value={72}
                      max={100}
                      type="bar"
                      color="status-ok"
                      thickness="medium"
                    />
                  </Box>

                  <Box gap="xsmall">
                    <Box direction="row" justify="between">
                      <Text>Retention</Text>

                      <Text weight="bold">58%</Text>
                    </Box>

                    <Meter
                      value={58}
                      max={100}
                      type="bar"
                      color="accent-4"
                      thickness="medium"
                    />
                  </Box>

                  <Box className="charts-mini-chart">
                    <Chart
                      a11yTitle="Weekly KPI trend"
                      type="bar"
                      color="graph-2"
                      values={[
                        {
                          value: [0, 42],
                          label: "Mon",
                        },
                        {
                          value: [1, 58],
                          label: "Tue",
                        },
                        {
                          value: [2, 51],
                          label: "Wed",
                        },
                        {
                          value: [3, 72],
                          label: "Thu",
                        },
                        {
                          value: [4, 64],
                          label: "Fri",
                        },
                      ]}
                    />
                  </Box>
                </Box>
              </Panel>
            </Box>

            {/* World Map */}
            <Box className="charts-main-column" flex="grow">
              <Panel
                className="charts-map-panel"
                title="Regional activity"
                subtitle="WorldMap: audience locations"
              >
                <Box className="charts-map-wrapper">
                  <WorldMap
                    a11yTitle="Audience locations by region"
                    fill
                    places={[
                      {
                        name: "New York",
                        location: [40.7128, -74.006],
                        color: "graph-0",
                      },
                      {
                        name: "London",
                        location: [51.5072, -0.1276],
                        color: "graph-2",
                      },
                      {
                        name: "Sydney",
                        location: [-33.8688, 151.2093],
                        color: "graph-3",
                      },
                      {
                        name: "Tokyo",
                        location: [35.6762, 139.6503],
                        color: "graph-4",
                      },
                    ]}
                  />
                </Box>
              </Panel>
            </Box>
          </Box>

          {/* Workflow */}
          <Panel
            className="charts-workflow-panel"
            title="Publishing workflow"
            subtitle="Diagram: API request to rendered dashboard"
          >
            <Box className="charts-workflow">
              <Box
                className="charts-workflow-nodes"
                direction="row"
                align="center"
                justify="between"
                gap="medium"
              >
                <Box
                  id="api-node"
                  className="charts-workflow-node"
                  background="brand"
                  pad="small"
                  align="center"
                  justify="center"
                >
                  <Text color="white" weight="bold">
                    API data
                  </Text>
                </Box>

                <Box
                  id="transform-node"
                  className="charts-workflow-node"
                  background="accent-4"
                  pad="small"
                  align="center"
                  justify="center"
                >
                  <Text color="white" weight="bold">
                    Transform
                  </Text>
                </Box>

                <Box
                  id="chart-node"
                  className="charts-workflow-node"
                  background="brand"
                  pad="small"
                  align="center"
                  justify="center"
                >
                  <Text color="white" weight="bold">
                    Dashboard
                  </Text>
                </Box>
              </Box>

              <Box className="charts-workflow-diagram">
                <Diagram
                  a11yTitle="Publishing workflow connections"
                  connections={[
                    {
                      fromTarget: "api-node",
                      toTarget: "transform-node",
                      anchor: "horizontal",
                      color: "graph-0",
                      thickness: "small",
                      type: "rectilinear",
                    },
                    {
                      fromTarget: "transform-node",
                      toTarget: "chart-node",
                      anchor: "horizontal",
                      color: "graph-0",
                      thickness: "small",
                      type: "rectilinear",
                    },
                  ]}
                />
              </Box>
            </Box>
          </Panel>
        </Box>
      </Box>
    </Layer>
  );
};

export default Charts;
