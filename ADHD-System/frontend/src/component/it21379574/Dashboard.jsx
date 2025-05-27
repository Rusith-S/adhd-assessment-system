import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import activities from "../../utils/activities";
import "./Dashboard.css";
import { Button } from "@mui/material";
import { Plus, Eye, CheckCircle, Clock } from "lucide-react";
import DashBoardTiles from "../it21380532/component/DashBoardTiles";

const AnswerList = ({ answers }) => (
  <div className="answer-list">
    <h3>Previous Answers 📋</h3>
    <ul>
      {answers.map((answer, index) => (
        <li key={index}>{answer}</li>
      ))}
    </ul>
  </div>
);

const RecommendationBox = ({ text }) => (
  <div className="recommendation-box">
    <h3>Recommendation</h3>
    <p>{text}</p>
    <div className="card-grid full-width">
      <div className="grid-card" style={{ backgroundColor: "#eeb7ab" }}>
        Extra 1
      </div>
      <div className="grid-card" style={{ backgroundColor: "#e8abee" }}>
        Extra 2
      </div>
      <div className="grid-card" style={{ backgroundColor: "#abddee" }}>
        Extra 3
      </div>
    </div>
  </div>
);

const Sidebar = ({ childId }) => (
  <div className="sidebar">
    <h2>Menu</h2>
    <Link to="http://localhost:3000/home">Home</Link>
    <Link to={`/dashboard/timetablehistory/${childId}`}>History</Link>
    <Link to={`/prediction/${childId}`}>Predictions Monitoring</Link>
  </div>
);

const Timetable = ({ timetable }) => (
  <table className="timetable-table">
    <thead>
      <tr>
        <th>Time</th>
        <th>Activity</th>
        <th>Duration (min)</th>
      </tr>
    </thead>
    <tbody>
      {timetable.timetableDetails.map((slot, idx) => (
        <tr key={slot._id || idx}>
          <td>{slot.timeTableSlot.time}</td>
          <td>{slot.timeTableSlot.activityType}</td>
          <td>{slot.timeTableSlot.duration}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Dashboard = () => {
  const { childId } = useParams();
  const [latestTimetables, setLatestTimetables] = useState([]);
  const [latestAnswers, setLatestAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showingTB, setShowingTB] = useState(null);
  const [lstPrediction, setLstPrediction] = useState(null);

  // Helper function to calculate days passed since timetable creation
  const getDaysPassed = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper function to calculate weekly progress percentage
  const calculateWeeklyProgress = (createdAt) => {
    const daysPassed = getDaysPassed(createdAt);
    // Cap at 100% after 7 days
    return Math.min(Math.round((daysPassed / 7) * 100), 100);
  };

  // Helper function to check if a week is eligible for completion (7 days passed but not yet marked complete)
  const isWeekEligibleForCompletion = (timetable) => {
    return getDaysPassed(timetable.createdAt) >= 7 && !timetable.weekCompleted;
  };

  // Helper function to check if week is already completed
  const isWeekAlreadyCompleted = (timetable) => {
    return timetable.weekCompleted === true;
  };

  // Handle week completion
  const handleCompleteWeek = async (weekIndex) => {
    try {
      // API call to mark week as complete
      const response = await fetch(
        `http://localhost:8800/api/child-timetable/complete-week/${childId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completedTimetableId: latestTimetables[weekIndex]._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to complete week");
      }

      // Refresh the data after completing week
      fetchData();
    } catch (err) {
      setError(`Error completing week: ${err.message}`);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Latest 3 Timetables
      const timetableRes = await fetch(
        `http://localhost:8800/api/child-timetable/latest/${childId}`
      );
      if (!timetableRes.ok) throw new Error("Failed to fetch timetables.");
      const timetableData = await timetableRes.json();
      setLatestTimetables(timetableData);

      // Fetch Latest Questionnaire Response

      // Fetch Latest Prediction
      const predictionRes = await fetch(
        `http://localhost:8800/api/activity/latest-prediction/${childId}`
      );
      if (predictionRes.ok) {
        const predictionData = await predictionRes.json();
        setLstPrediction(predictionData.latestPrediction);
      } else {
        setLstPrediction(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [childId]);

  const ProgressCard = ({ week, timetable, index }) => {
    const hasTimeTable = timetable !== null;
    const isAlreadyCompleted = hasTimeTable
      ? isWeekAlreadyCompleted(timetable)
      : false;
    const isEligibleForCompletion = hasTimeTable
      ? isWeekEligibleForCompletion(timetable)
      : false;
    const percentage = hasTimeTable
      ? isAlreadyCompleted
        ? 100
        : calculateWeeklyProgress(timetable.createdAt)
      : 0;

    return (
      <div className="progress-card" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <h2 style={{ fontWeight: "bold" }}>Week {week}</h2>
            <p>{percentage}% Completed</p>
            {hasTimeTable && !isAlreadyCompleted && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Clock size={16} />
                <span style={{ fontSize: "0.9rem", color: "#666" }}>
                  Day {Math.min(getDaysPassed(timetable.createdAt), 7)} of 7
                </span>
              </div>
            )}
            {isAlreadyCompleted && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <CheckCircle size={16} color="#4CAF50" />
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#4CAF50",
                    fontWeight: "bold",
                  }}
                >
                  Week Completed!
                </span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            {!hasTimeTable ? (
              // Show questionnaire button if no timetable
              <Button
                variant="contained"
                onClick={() => navigate(`/dashboard/questionnaire/${childId}`)}
                startIcon={<Plus size={15} />}
                style={{
                  background:
                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "0.9rem",
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
                Take Questionnaire
              </Button>
            ) : isEligibleForCompletion ? (
              // Show complete button if week is eligible for completion (7 days passed but not marked complete)
              <Button
                variant="contained"
                onClick={() => handleCompleteWeek(index)}
                startIcon={<CheckCircle size={15} />}
                style={{
                  background:
                    "linear-gradient(45deg, #4CAF50 30%, #45a049 90%)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 25px rgba(76, 175, 80, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0px)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(76, 175, 80, 0.4)";
                }}
              >
                Complete Week
              </Button>
            ) : null}
          </div>
        </div>

        {!hasTimeTable ? (
          <div
            style={{
              display: "flex",
              marginTop: "1rem",
              justifyContent: "center",
              padding: "2rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "10px",
              border: "2px dashed #dee2e6",
            }}
          >
            <p style={{ color: "#6c757d", fontStyle: "italic", margin: 0 }}>
              📝 Take the questionnaire to get your personalized timetable
            </p>
          </div>
        ) : showingTB === index ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "1rem",
              justifyContent: "center",
            }}
          >
            <Timetable timetable={timetable} />
            <div
              style={{
                display: "flex",
                marginTop: "1rem",
                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<Eye />}
                onClick={() => {
                  setShowingTB(null);
                }}
              >
                Hide Timetable
              </Button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              marginTop: "1rem",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Eye />}
              onClick={() => {
                setShowingTB(index);
              }}
            >
              Show Timetable
            </Button>
          </div>
        )}

        {/* Progress bar */}
        {hasTimeTable && (
          <div style={{ marginTop: "1rem" }}>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#666",
                marginTop: "0.5rem",
                textAlign: "center",
              }}
            >
              {isAlreadyCompleted ? (
                <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
                  ✅ Week completed successfully!
                </span>
              ) : isEligibleForCompletion ? (
                <span style={{ color: "#FF9800", fontWeight: "bold" }}>
                  🎯 Ready to complete! Click the Complete Week button
                </span>
              ) : (
                `${Math.max(
                  7 - getDaysPassed(timetable.createdAt),
                  0
                )} days remaining`
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <Sidebar childId={childId} />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Questionnaire Dashboard</h2>
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="content-wrapper">
            <div style={{ display: "flex", gap: "2rem" }}>
              <div style={{ flex: 2.5 }} className="progress-section">
                {latestTimetables.length > 0 ? (
                  <>
                    {latestTimetables.map((timetable, index) => (
                      <ProgressCard
                        key={timetable._id || index}
                        week={latestTimetables.length - index}
                        timetable={timetable}
                        index={index}
                      />
                    ))}

                    {/* Show next week card if the latest week is completed */}
                    {latestTimetables.length > 0 &&
                      isWeekAlreadyCompleted(latestTimetables[0]) && (
                        <ProgressCard
                          week={latestTimetables.length + 1}
                          timetable={null}
                          index={-1}
                        />
                      )}
                  </>
                ) : (
                  // Show Week 1 card when no timetables exist
                  <ProgressCard week={1} timetable={null} index={0} />
                )}
              </div>
              <div style={{ flex: 1, marginTop: "-1rem" }}>
                {console.log(lstPrediction)}
                <DashBoardTiles
                  title={"ADHD Type"}
                  value={
                    lstPrediction != null
                      ? lstPrediction.requestData.adhdSubtype
                      : "N/A"
                  }
                />
                <DashBoardTiles
                  title={"Impulsive Level"}
                  value={
                    lstPrediction != null
                      ? lstPrediction.responseData.impulsivityLevel
                      : "N/A"
                  }
                />
                <DashBoardTiles
                  title={"Recommendations"}
                  value={
                    lstPrediction != null
                      ? lstPrediction.responseData.recommendedActivityType
                      : "N/A"
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
