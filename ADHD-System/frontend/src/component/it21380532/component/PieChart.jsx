// Enhanced AttendanceChart.jsx (PieChart)
import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Users, Calendar } from "lucide-react";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill="#2c3e50"
        fontSize="14"
        fontWeight="bold"
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
        strokeWidth={2}
      />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#2c3e50"
        fontSize={16}
        fontWeight="bold"
      >{`${value}%`}</text>
    </g>
  );
};

export default class AttendanceChart extends PureComponent {
  state = {
    activeIndex: 0,
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    const { attendancePercentage } = this.props;
    const absencePercentage = 100 - attendancePercentage;

    const data = [
      {
        name: "Present",
        value: attendancePercentage,
        color: "#27ae60",
      },
      {
        name: "Absent",
        value: absencePercentage,
        color: "#e74c3c",
      },
    ];

    return (
      <Card
        elevation={8}
        style={{
          background: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: "410px",
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
          style={{
            padding: "1.5rem",
            position: "relative",
            zIndex: 1,
            height: "100%",
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            gap="1rem"
            marginBottom="1rem"
          >
            <Calendar size={24} color="white" />
            <Typography
              variant="h6"
              style={{
                color: "white",
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Attendance Overview
            </Typography>
          </Box>

          {/* Chart Container */}
          <Box
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              padding: "1rem",
              backdropFilter: "blur(10px)",
              height: "calc(100% - 80px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Stats Summary */}
            <Box
              display="flex"
              gap="2rem"
              marginBottom="1rem"
              style={{ width: "100%" }}
              justifyContent="center"
            >
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  style={{ color: "#27ae60", fontWeight: "bold" }}
                >
                  {attendancePercentage}%
                </Typography>
                <Typography
                  variant="body2"
                  style={{ color: "#2c3e50", fontWeight: "500" }}
                >
                  Present
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  style={{ color: "#e74c3c", fontWeight: "bold" }}
                >
                  {absencePercentage}%
                </Typography>
                <Typography
                  variant="body2"
                  style={{ color: "#2c3e50", fontWeight: "500" }}
                >
                  Absent
                </Typography>
              </Box>
            </Box>

            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={this.state.activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  onMouseEnter={this.onPieEnter}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  }
}
