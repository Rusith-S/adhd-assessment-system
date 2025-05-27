import React from "react";
import "./ActivityForm.css";

const ActivityForm = ({ formData, updateFormData, section, questions }) => {
  const handleChange = (e, key) => {
    const updatedSectionData = {
      ...(formData[section] || {}),
      [key]: Number(e.target.value),
    };
    updateFormData(section, updatedSectionData);
  };

  return (
    <div className="form-section">
      <h3 className="form-title">{section} Questions</h3>
      {questions.map((question, index) => (
        <div className="form-group" key={index}>
          <label>{question.question}</label>
          <select
            value={(formData[section] && formData[section][question.key]) || ""}
            onChange={(e) => handleChange(e, question.key)}
          >
            <option value="" disabled>
              Select an answer
            </option>
            {question.answers.map((answer, idx) => (
              <option key={idx} value={answer.value}>
                {answer.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default ActivityForm;
