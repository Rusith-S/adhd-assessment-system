import React from "react";
import { useLocation } from "react-router-dom";
import "./ResultsPage.css"; // Import the updated CSS file

const ResultsPage = () => {
  const location = useLocation();
  const { result, childId } = location.state || {};

  return (
    <div className="full-page-container">
      <div className="cardresult">
        <div className="cardresult-header">
          <h3>Prediction Results</h3>
        </div>
        <div className="cardresult-body">
          {result && result.backendResponseFormat ? (
            <div className="alert alert-success">
              <p>
                <strong>Future Challenge:</strong> {result.backendResponseFormat.futureChallenge}
              </p>
              <p>
                <strong>Prevention Mechanism:</strong> {result.backendResponseFormat.preventionMechanism}
              </p>
            </div>
          ) : (
            <div className="alert alert-danger">
              No results available. Please try again.
            </div>
          )}
          <div className="button-container">
            <button
              type="button"
              className="btn-primary"
              onClick={() => window.location.replace(`/prediction/${childId}`)}
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
