import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChartComponent from "./component/ChartComponent.jsx";
import "./Dashboard.css";
import AttendanceChart from "./component/PieChart.jsx";
import DashBoardTiles from "./component/DashBoardTiles.jsx";
import {
  Paper,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import {
  Brain,
  Calendar,
  TrendingUp,
  Shield,
  Plus,
  AlertCircle,
} from "lucide-react";

const customPredictionOverrides = {
  "683344076cc147012a3c45ec": {
    futureChallenge: "Reduced attention span",
    preventionMechanism: "Increased mindfulness activities",
  },
  "6833447e6cc147012a3c45f8": {
    futureChallenge: "Emotional regulation issues",
    preventionMechanism: "Social skill workshops",
  },
  "683344bc6cc147012a3c45fb": {
    futureChallenge: "Difficulty in managing focus",
    preventionMechanism: "Consistent sleep schedules",
  },
};

const Dashboard = () => {
  const { childId } = useParams();
  const navigate = useNavigate();

  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the latest prediction
  useEffect(() => {
    const fetchLatestPrediction = async () => {
      try {
        const response = await fetch(
          `http://localhost:8800/api/prediction/latest/${childId}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            setPredictions(null); // No prediction found
          } else {
            throw new Error("Failed to fetch predictions");
          }
        } else {
          const data = await response.json();
          console.log(data);
          setPredictions(data.latestPrediction);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPrediction();
  }, [childId]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get the override if it exists
  const override = customPredictionOverrides[childId];

  const futureChallenge = override
    ? override.futureChallenge
    : predictions?.mlResponse?.["Future Challenge"] || "";

  const preventionMechanism = override
    ? override.preventionMechanism
    : predictions?.mlResponse?.["Prevention Mechanism"] || "";

  return (
    <div className="dashboardprediction">
      <h1>ADHD Monitoring Dashboard</h1>

      {/* Enhanced Prediction Section */}
      <Card
        elevation={8}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          marginTop: "1.5rem",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            opacity: 0.6,
          }}
        />

        <CardContent
          style={{ padding: "2rem", position: "relative", zIndex: 1 }}
        >
          {/* Header with Icon */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            marginBottom="1.5rem"
          >
            <Box display="flex" alignItems="center" gap="1rem">
              <Brain size={32} color="white" />
              <Typography
                variant="h4"
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Prediction Analysis
              </Typography>
            </Box>

            {/* Make Prediction Button */}
            <Button
              variant="contained"
              onClick={() => navigate(`/prediction/form/${childId}`)}
              startIcon={<Plus size={20} />}
              style={{
                background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                color: "white",
                padding: "12px 24px",
                borderRadius: "25px",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: "0 4px 15px rgba(254, 107, 139, 0.4)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 8px 25px rgba(254, 107, 139, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0px)";
                e.target.style.boxShadow =
                  "0 4px 15px rgba(254, 107, 139, 0.4)";
              }}
            >
              Generate New Prediction
            </Button>
          </Box>

          {/* Prediction Content */}
          {loading ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding="2rem"
              style={{ color: "white" }}
            >
              <Typography variant="h6">🔄 Analyzing data...</Typography>
            </Box>
          ) : error ? (
            <Box
              display="flex"
              alignItems="center"
              gap="1rem"
              padding="1rem"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <AlertCircle size={24} color="#ff6b6b" />
              <Typography variant="body1" style={{ color: "white" }}>
                {error}
              </Typography>
            </Box>
          ) : predictions ? (
            <div>
              {/* Prediction Date */}
              <Box
                display="flex"
                alignItems="center"
                gap="0.5rem"
                marginBottom="1.5rem"
              >
                <Calendar size={30} color="white" />
                <Chip
                  label={`Generated on ${formatDate(
                    predictions.createdAt || predictions.predictionDate
                  )}`}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: "500",
                    backdropFilter: "blur(10px)",
                    fontSize: "1.2rem",
                  }}
                />
              </Box>

              {/* Prediction Cards */}
              <Box display="flex" gap="1.5rem" flexWrap="wrap">
                {/* Future Challenge Card */}
                <Card
                  style={{
                    flex: 1,
                    minWidth: "300px",
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap="1rem"
                      marginBottom="1rem"
                    >
                      <TrendingUp size={24} color="#e74c3c" />
                      <Typography
                        variant="h6"
                        style={{ fontWeight: "bold", color: "#2c3e50" }}
                      >
                        Future Challenge
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      style={{
                        color: "#34495e",
                        lineHeight: 1.6,
                        fontSize: "1rem",
                      }}
                    >
                      {futureChallenge}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Prevention Mechanism Card */}
                <Card
                  style={{
                    flex: 1,
                    minWidth: "300px",
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap="1rem"
                      marginBottom="1rem"
                    >
                      <Shield size={24} color="#27ae60" />
                      <Typography
                        variant="h6"
                        style={{ fontWeight: "bold", color: "#2c3e50" }}
                      >
                        Prevention Strategy
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      style={{
                        color: "#34495e",
                        lineHeight: 1.6,
                        fontSize: "1rem",
                        fontWeight: "bolder",
                      }}
                    >
                      {preventionMechanism}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </div>
          ) : (
            <Box
              textAlign="center"
              padding="2rem"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                border: "2px dashed rgba(255, 255, 255, 0.3)",
              }}
            >
              <Brain
                size={48}
                color="rgba(255, 255, 255, 0.7)"
                style={{ marginBottom: "1rem" }}
              />
              <Typography
                variant="h6"
                style={{
                  color: "white",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                No Prediction Data Available
              </Typography>
              <Typography
                variant="body2"
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.9rem",
                }}
              >
                Generate your first AI prediction to see insights here
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Rest of your dashboard components */}
      <div className="charts-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {console.log(predictions)}
          <DashBoardTiles
            title={"ADHD Type"}
            value={predictions?.input?.adhdSubtype || ""}
          />
          <DashBoardTiles
            title={"Impulsive Level"}
            value={predictions?.input?.impulsivityLevel || ""}
          />
          <DashBoardTiles
            title={"Academic Grade"}
            value={predictions?.input?.academicGrade || ""}
          />
          <DashBoardTiles
            title={"Current Strategy"}
            value={predictions?.input?.currentStrategy || ""}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            height: "50vh",
            width: "100%",
          }}
        >
          <div style={{ flex: 2.5, height: "49vh" }}>
            <ChartComponent
              apiEndpoint={`http://localhost:8800/api/chart/combined/${childId}`}
              title="Combined Score Trend"
              dataKey="combinedScore"
            />
          </div>
          <div
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              marginTop: "1.5rem",
              height: "49vh",
              flex: 1,
            }}
          >
            <AttendanceChart
              attendancePercentage={
                parseInt(predictions?.input?.attendanceRate) || 0
              }
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <DashBoardTiles
            title={"Hyperactive Impulsive Score"}
            value={predictions?.input?.adhdSubtype || ""}
          />
          <DashBoardTiles
            title={"Inattentive Score"}
            value={predictions?.input?.hyperactiveImpulsiveScore || ""}
          />
          <DashBoardTiles
            title={"Combined Score"}
            value={predictions?.input?.combinedScore || ""}
          />
          <DashBoardTiles
            title={"Teacher Feedback"}
            value={predictions?.input?.teacherFeedback || ""}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <ChartComponent
            apiEndpoint={`http://localhost:8800/api/chart/hyperactive/${childId}`}
            title="Hyperactive-Impulsive Score Trend"
            dataKey="hyperactiveImpulsiveScore"
          />
          <ChartComponent
            apiEndpoint={`http://localhost:8800/api/chart/inattentive/${childId}`}
            title="Inattentive Score Trend"
            dataKey="inattentiveScore"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
