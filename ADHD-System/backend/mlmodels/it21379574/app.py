from flask import Flask, request, jsonify
from joblib import load
import numpy as np
import pandas as pd

app = Flask(__name__)

# Load pre-trained models and encoders
activity_model = load("best_activity_model.pkl")
impulsivity_model = load("best_impulsivity_model.pkl")
scaler = load("scaler.pkl")
pca = load("pca.pkl")

# Load encoders for categorical features
gender_encoder = load("gender_encoder.pkl")
adhd_subtype_encoder = load("adhd_subtype_encoder.pkl")
y_activity_encoder = load("y_activity_encoder.pkl")
y_impulsivity_encoder = load("y_impulsivity_encoder.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Input validation
        input_data = request.json
        required_fields = [
            "Age", "Gender", "ADHD Subtype", "A1:Q1", "A1:Q2", "A1:Q3", 
            "A2:Q1", "A2:Q2", "A2:Q3", "A2:Q4", "A2:Q5", "A3:Q1", 
            "A3:Q2", "A3:Q3", "A3:Q4", "A3:Q5", "A4:Q1", "A4:Q2", 
            "A4:Q3", "A4:Q4", "A4:Q5", "Activity Duration", 
            "Response Time", "Energy Level", "Pre-Activity Calmness", 
            "Post-Activity Calmness", "Impulse Control Score", 
            "Activity Effectiveness"
        ]

        # Check if all required fields are present
        for field in required_fields:
            if field not in input_data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Extract input features
        feature_values = [
            input_data["Age"],
            gender_encoder.transform([input_data["Gender"]])[0],
            adhd_subtype_encoder.transform([input_data["ADHD Subtype"]])[0],
            input_data["A1:Q1"], input_data["A1:Q2"], input_data["A1:Q3"],
            input_data["A2:Q1"], input_data["A2:Q2"], input_data["A2:Q3"],
            input_data["A2:Q4"], input_data["A2:Q5"],
            input_data["A3:Q1"], input_data["A3:Q2"], input_data["A3:Q3"],
            input_data["A3:Q4"], input_data["A3:Q5"],
            input_data["A4:Q1"], input_data["A4:Q2"], input_data["A4:Q3"],
            input_data["A4:Q4"], input_data["A4:Q5"],
            input_data["Activity Duration"],
            input_data["Response Time"],
            input_data["Energy Level"],
            input_data["Pre-Activity Calmness"],
            input_data["Post-Activity Calmness"],
            input_data["Impulse Control Score"],
            input_data["Activity Effectiveness"]
        ]

        # Preprocess input features
        feature_array = np.array(feature_values).reshape(1, -1)
        scaled_features = scaler.transform(feature_array)
        pca_features = pca.transform(scaled_features)

        # Make predictions
        activity_pred = activity_model.predict(pca_features)
        impulsivity_pred = impulsivity_model.predict(pca_features)

        # Decode predictions
        decoded_activity = y_activity_encoder.inverse_transform(activity_pred)[0]
        decoded_impulsivity = y_impulsivity_encoder.inverse_transform(impulsivity_pred)[0]

        # Return predictions as JSON
        return jsonify({
            "Recommended Activity Type": decoded_activity,
            "Impulsivity Level": decoded_impulsivity
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
