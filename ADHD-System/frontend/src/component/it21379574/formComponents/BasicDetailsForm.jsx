import React from "react";
import { useEffect } from "react";
import "./BasicDetailsForm.css";

const BasicDetailsForm = ({ formData, updateFormData }) => {
  console.log("Child ID:", formData.childId); // Debugging log

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8800/api/activity/basicdetails/${formData.childId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch child details");
        }
        const data = await response.json();
        updateFormData("name", data.child.name);
        updateFormData("age", data.child.age);
        updateFormData("gender", data.child.gender);
        updateFormData("adhdSubtype", data.latestResponse.subtype);
      } catch (error) {
        console.error("Error fetching child details:", error);
      }
    };

    if (formData.childId) {
      fetchData();
    }
  }, [formData.childId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  return (
    <div className="form-section">
      <h4 className="form-title">Basic Details</h4>
      {/* <div className="form-group">
        <label>Child ID</label>
        <input
          type="text"
          name="childId"
          value={formData.childId}
          onChange={handleChange}
          required
          disabled
        />
      </div> */}
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled
        />
      </div>
      <div className="form-group">
        <label>Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
          disabled
        />
      </div>
      <div className="form-group">
        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          disabled
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <div className="form-group">
        <label>ADHD Subtype</label>
        <select
          name="adhdSubtype"
          value={formData.adhdSubtype}
          onChange={handleChange}
          required
        >
          <option value="">Select Subtype</option>
          <option value="Inattentive">Inattentive</option>
          <option value="Hyperactive-Impulsive">Hyperactive-Impulsive</option>
          <option value="Combined">Combined</option>
        </select>
      </div>
    </div>
  );
};

export default BasicDetailsForm;
