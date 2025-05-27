import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./TimetableHistory.css";

const TimetableHistory = () => {
  const { childId } = useParams();
  const [history, setHistory] = useState([]);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:8800/api/child-timetable/history/${childId}`
        );
        if (!response.ok) throw new Error("Failed to fetch timetable history.");

        const data = await response.json();
        setHistory(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [childId]);

  return (
    <div className="imagetime">
      <div className="history-container">
        <h1 style={{ color: "black", fontWeight: "bold" }}>
          Timetable History
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : history.length === 0 ? (
          <p>No records found</p>
        ) : (
          <div className="timetable-list">
            {history.map((timetable, index) => (
              <div
                key={index}
                className="timetable-card"
                onClick={() => setSelectedTimetable(timetable)}
              >
                <h4>Timetable {index + 1}</h4>
                <p>
                  Date: {new Date(timetable.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Time Slot: {timetable.timetableDetails[0]?.timeTableSlot.time}{" "}
                  -{" "}
                  {
                    timetable.timetableDetails[
                      timetable.timetableDetails.length - 1
                    ]?.timeTableSlot.time
                  }
                </p>
              </div>
            ))}
          </div>
        )}

        {selectedTimetable && (
          <TimetableModal
            timetable={selectedTimetable}
            onClose={() => setSelectedTimetable(null)}
          />
        )}
      </div>
    </div>
  );
};

export default TimetableHistory;

const TimetableModal = ({ timetable, onClose }) => {
  const [activities, setActivities] = useState(timetable.timetableDetails);

  const handleCompletionChange = async (timetableId, completed) => {
    try {
      await fetch(
        `http://localhost:8800/api/child-timetable/update-completion/${timetableId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed }),
        }
      );

      setActivities((prev) =>
        prev.map((slot) =>
          slot._id === timetableId ? { ...slot, completed } : slot
        )
      );
    } catch (error) {
      console.error("Failed to update completion:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Timetable Activities</h3>
        <table className="modal-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Activity</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((slot) => (
              <tr key={slot._id}>
                <td>{slot.timeTableSlot.time}</td>
                <td>{slot.timeTableSlot.activityType}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={slot.completed}
                    onChange={(e) =>
                      handleCompletionChange(slot._id, e.target.checked)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
