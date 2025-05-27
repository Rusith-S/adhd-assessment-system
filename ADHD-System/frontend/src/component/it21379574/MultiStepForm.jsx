import React, { useState } from "react";
import BasicDetailsForm from "./formComponents/BasicDetailsForm";
import ActivityForm from "./formComponents/ActivityForm";
import FinalDetailsForm from "./formComponents/FinalDetailsForm";
import { useNavigate, useParams } from "react-router-dom";
import activities from "../../utils/activities";
import "./MultiStepForm.css";

const MultiStepForm = () => {
  const { childId } = useParams();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    childId: childId,
    name: "",
    age: "",
    gender: "",
    adhdSubtype: "",
    A1: {},
    A2: {},
    A3: {},
    A4: {},
    activityDuration: "",
    responseTime: "",
    energyLevel: "",
    preActivityCalmness: "",
    postActivityCalmness: "",
    impulseControlScore: "",
    activityEffectiveness: "",
  });

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const submitForm = async () => {
    try {
      const response = await fetch(
        "http://localhost:8800/api/activity/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit the form. Please try again.");
      }

      const result = await response.json();
      navigate("/dashboard/result", { state: { formData, result } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h5>Step {step} of 6</h5>
        </div>
        <div className="form-body">
          {step === 1 && (
            <BasicDetailsForm
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {step === 2 && (
            <ActivityForm
              formData={formData}
              updateFormData={updateFormData}
              section="A1"
              questions={activities.A1}
            />
          )}
          {step === 3 && (
            <ActivityForm
              formData={formData}
              updateFormData={updateFormData}
              section="A2"
              questions={activities.A2}
            />
          )}
          {step === 4 && (
            <ActivityForm
              formData={formData}
              updateFormData={updateFormData}
              section="A3"
              questions={activities.A3}
            />
          )}
          {step === 5 && (
            <ActivityForm
              formData={formData}
              updateFormData={updateFormData}
              section="A4"
              questions={activities.A4}
            />
          )}
          {step === 6 && (
            <FinalDetailsForm
              formData={formData}
              setFormData={updateFormData}
              prevStep={prevStep}
              handleSubmit={submitForm}
            />
          )}
        </div>
        <div className="form-footer">
          {step > 1 && (
            <button className="btn-secondary" onClick={prevStep}>
              Previous
            </button>
          )}
          {step < 6 ? (
            <button className="btn-primary" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button className="btn-primary" onClick={submitForm}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
