from flask import Blueprint, request, jsonify
from joblib import load
import numpy as np

activity_bp = Blueprint("activity", __name__)

# Load models and scalers
activity_model = load("activity/best_activity_model.pkl")
impulsivity_model = load("activity/best_impulsivity_model.pkl")
scaler = load("activity/scaler.pkl")
pca = load("activity/pca.pkl")

# Load encoders
gender_encoder = load("activity/gender_encoder.pkl")
adhd_subtype_encoder = load("activity/adhd_subtype_encoder.pkl")
y_activity_encoder = load("activity/y_activity_encoder.pkl")
y_impulsivity_encoder = load("activity/y_impulsivity_encoder.pkl")

expected_features = [
    "Age", "Gender", "ADHD Subtype", "A1:Q1", "A1:Q2", "A1:Q3", 
    "A2:Q1", "A2:Q2", "A2:Q3", "A2:Q4", "A2:Q5", "A3:Q1", 
    "A3:Q2", "A3:Q3", "A3:Q4", "A3:Q5", "A4:Q1", "A4:Q2", 
    "A4:Q3", "A4:Q4", "A4:Q5", "Activity Duration", 
    "Response Time", "Energy Level", "Pre-Activity Calmness", 
    "Post-Activity Calmness", "Impulse Control Score", 
    "Activity Effectiveness"
]

@activity_bp.route("/predict", methods=["POST"])
def predict_activity():
    try:
        input_data = request.json
        if not input_data:
            return jsonify({"error": "No input data provided."}), 400

        missing_fields = [field for field in expected_features if field not in input_data]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

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

        feature_array = np.array(feature_values).reshape(1, -1)
        scaled_features = scaler.transform(feature_array)
        pca_features = pca.transform(scaled_features)

        activity_pred = activity_model.predict(pca_features)
        impulsivity_pred = impulsivity_model.predict(pca_features)

        decoded_activity = y_activity_encoder.inverse_transform(activity_pred)[0]
        decoded_impulsivity = y_impulsivity_encoder.inverse_transform(impulsivity_pred)[0]

        return jsonify({
            "Recommended Activity Type": decoded_activity,
            "Impulsivity Level": decoded_impulsivity
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
