// Enhanced ChartComponent.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { TrendingUp, BarChart3 } from "lucide-react";

const ChartComponent = ({ apiEndpoint, title, dataKey }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }
        const data = await response.json();

        // Formatting data for the chart
        const formattedData = data.map((item) => ({
          date: new Date(item.createdAt).toLocaleDateString(),
          score: item.input[dataKey],
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [apiEndpoint, dataKey]);

  // Get gradient colors based on chart type
  const getGradientColors = (title) => {
    if (title.includes("Combined")) {
      return {
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        lineColor: "#667eea",
      };
    } else if (title.includes("Hyperactive")) {
      return {
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        lineColor: "#f5576c",
      };
    } else if (title.includes("Inattentive")) {
      return {
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        lineColor: "#4facfe",
      };
    }
    return {
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      lineColor: "#8884d8",
    };
  };

  const { gradient, lineColor } = getGradientColors(title);

  return (
    <Card
      elevation={8}
      style={{
        background: gradient,
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        width: "100%",
        minHeight: "400px",
        marginTop: "1.5rem",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          opacity: 0.6,
        }}
      />

      <CardContent
        style={{ padding: "1.5rem", position: "relative", zIndex: 1 }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" gap="1rem" marginBottom="1rem">
          <TrendingUp size={24} color="white" />
          <Typography
            variant="h6"
            style={{
              color: "white",
              fontWeight: "bold",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Chart Container */}
        <Box
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "12px",
            padding: "1rem",
            backdropFilter: "blur(10px)",
            minHeight: "300px",
          }}
        >
          {loading ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="250px"
            >
              <Typography variant="body1" color="textSecondary">
                📊 Loading chart data...
              </Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id={`gradient-${dataKey}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={lineColor} stopOpacity={0.8} />
                    <stop
                      offset="95%"
                      stopColor={lineColor}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0, 0, 0, 0.1)"
                />
                <XAxis
                  dataKey="date"
                  stroke="rgba(0, 0, 0, 0.7)"
                  fontSize={12}
                />
                <YAxis stroke="rgba(0, 0, 0, 0.7)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={lineColor}
                  strokeWidth={3}
                  dot={{ fill: lineColor, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: lineColor, strokeWidth: 2 }}
                  fill={`url(#gradient-${dataKey})`}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartComponent;
