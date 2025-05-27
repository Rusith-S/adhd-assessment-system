import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FormPage.css";

const FormPage = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: 0,
    gender: "",
    adhdSubtype: "",
    inattentiveScore: 0,
    hyperactiveImpulsiveScore: 0,
    combinedScore: 0,
    impulsivityLevel: "",
    academicGrade: "",
    attendanceRate: 0,
    currentStrategy: "",
    effectivenessScore: 0,
    teacherFeedback: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId) return;
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8800/api/prediction/details/${childId}`
        );
        if (!response.ok) throw new Error("Failed to fetch child data");

        const data = await response.json();

        setFormData({
          childId: childId,
          age: data.child?.age || 0,
          gender: data.child?.gender || "",
          adhdSubtype: data.latestResponse?.subtype || "",
          inattentiveScore: data.latestResponse?.inattentiveScore || 0,
          hyperactiveImpulsiveScore:
            data.latestResponse?.hyperactiveImpulsiveScore || 0,
          combinedScore: data.latestResponse?.combinedScore || 0,
          impulsivityLevel:
            data.latestPrediction?.responseData?.impulsivityLevel || "",
          academicGrade:
            data.latestPrediction?.responseData?.["Academic Grade"] || "",
          attendanceRate:
            data.latestPrediction?.responseData?.["Attendance Rate (%)"] || 0,
          currentStrategy:
            data.latestPrediction?.responseData?.["Current Strategy"] || "",
          effectivenessScore:
            data.latestPrediction?.responseData?.[
              "Effectiveness Score (1-10)"
            ] || 0,
          teacherFeedback:
            data.latestPrediction?.responseData?.["Teacher Feedback"] || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching child data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [childId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const isFormValid = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        formData[key] === "" ||
        formData[key] === null ||
        formData[key] === undefined
      ) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      const response = await fetch(
        "http://localhost:8800/api/prediction/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to submit the form");

      const result = await response.json();
      navigate("/prediction/result", { state: { result, childId } });
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const currentStrategyOptions = [
    "Behavioral Therapy",
    "Structured daily routines",
    "Mindfulness and relaxation techniques",
    "Regular physical activity",
    "Collaborative learning",
    "Task breakdown into smaller steps",
    "Time management training",
  ];

  const teacherFeedbackOptions = [
    "Needs improvement",
    "Great progress",
    "Positive response",
    "Impulsive behavior",
    "Easily distracted",
    "Moderate, needs more focus",
  ];

  const renderInputField = (name, label, type) => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  const renderSelectField = (name, label, options) => (
    <div className="form-group">
      <label>{label}</label>
      <select
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="containeform">
      <div className="cardform shadow">
        <div className="cardform-header bg-primary text-white">
          <h3 className="mb-0">ADHD Predictions Form</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {renderInputField("age", "Age", "number")}
              {renderSelectField("gender", "Gender", ["Male", "Female"])}
              {renderSelectField("adhdSubtype", "ADHD Subtype", [
                "Inattentive",
                "Hyperactive-Impulsive",
                "Combined",
              ])}
              {renderInputField(
                "inattentiveScore",
                "Inattentive Score",
                "number"
              )}
              {renderInputField(
                "hyperactiveImpulsiveScore",
                "Hyperactive-Impulsive Score",
                "number"
              )}
              {renderInputField("combinedScore", "Combined Score", "number")}
              {renderInputField(
                "impulsivityLevel",
                "Impulsivity Level",
                "text"
              )}
              {renderInputField("academicGrade", "Academic Grade", "text")}
              {renderInputField(
                "attendanceRate",
                "Attendance Rate (%)",
                "number"
              )}
              {renderSelectField(
                "currentStrategy",
                "Current Strategy",
                currentStrategyOptions
              )}
              {renderInputField(
                "effectivenessScore",
                "Effectiveness Score (1-10)",
                "number"
              )}
              {renderSelectField(
                "teacherFeedback",
                "Teacher Feedback",
                teacherFeedbackOptions
              )}

              <button type="submit" className="btn btn-primarypre w-100 mt-3">
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPage;
