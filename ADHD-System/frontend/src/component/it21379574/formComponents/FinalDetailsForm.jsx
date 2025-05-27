import React from "react";
import "./FinalDetailsForm.css";

const FinalDetailsForm = ({ formData, setFormData, prevStep, handleSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(name, Number(value));
  };

  return (
    <div className="form-section">
      <h3 className="form-title">Final Activity Details</h3>
      <form>
        {[
          { label: "Activity Duration (minutes)", name: "activityDuration" },
          { label: "Response Time (seconds)", name: "responseTime" },
          { label: "Energy Level (1-10)", name: "energyLevel" },
          { label: "Pre-Activity Calmness (1-10)", name: "preActivityCalmness" },
          { label: "Post-Activity Calmness (1-10)", name: "postActivityCalmness" },
          { label: "Impulse Control Score (1-10)", name: "impulseControlScore" },
          { label: "Activity Effectiveness (1-10)", name: "activityEffectiveness" },
        ].map((field, index) => (
          <div className="form-group" key={index}>
            <label>{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
            />
          </div>
        ))}
      </form>
    </div>
  );
};

export default FinalDetailsForm;
