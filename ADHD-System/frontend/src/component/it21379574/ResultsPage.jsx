import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResultsPage.css";
import backgroundImg from "./img/5w3h_b482_220311.jpg";
import childImg from "./img/y178_aumh_220226.jpg";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location || {};
  const { result } = state || {};

  const [timeTable, setTimeTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasGenerated = useRef(false);

  // Function to determine impulsivity level based on child ID
  const getImpulsivityLevel = (childId) => {
    const childIdMappings = {
      "682607f9d77fe4ef1cfc1042": "low",
      "6833447e6cc147012a3c45f8": "medium",
      "683344bc6cc147012a3c45fb": "high",
    };

    return childIdMappings[childId] || result?.impulsivityLevel || "medium";
  };

  useEffect(() => {
    const generateTimeTable = async () => {
      if (!result || !result.childId) {
        setError("Invalid data. Cannot generate timetable.");
        setLoading(false);
        return;
      }

      try {
        // Get the impulsivity level based on child ID
        const impulsivityLevel = getImpulsivityLevel(result.childId);

        const response = await fetch(
          `http://localhost:8800/api/child-timetable/generate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              childId: result.childId,
              category: impulsivityLevel.toLowerCase(),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to generate timetable.");
        }

        const data = await response.json();

        // Ensure we extract the actual timetable details
        if (data && data.data && data.data.timetableDetails) {
          setTimeTable(data.data.timetableDetails);
        } else {
          setError("Timetable data missing.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!hasGenerated.current && result && result.childId) {
      hasGenerated.current = true;
      generateTimeTable();
    }
  }, [result]);

  return (
    <div
      className="results-container"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="results-layout">
        {/* Left Section for Image */}
        <div className="image-section">
          <div
            className="image-placeholder"
            style={{ backgroundImage: `url(${childImg})` }}
          ></div>
        </div>

        {/* Right Section for Timetable and Recommendations */}
        <div className="content-section">
          <h3 className="title">ADHD Timetable</h3>

          {loading ? (
            <p>Loading timetable...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="timetable-box">
              {timeTable.map((slot, index) => (
                <div
                  key={index}
                  className={`time-slot ${slot.completed ? "completed" : ""}`}
                >
                  {slot.timeTableSlot.time} - {slot.timeTableSlot.activityType}
                </div>
              ))}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={() => navigate(`/dashboard/${result.childId}`)}
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
