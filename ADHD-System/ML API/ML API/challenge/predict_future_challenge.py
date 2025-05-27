from flask import Blueprint, request, jsonify
from joblib import load
import numpy as np

challenge_bp = Blueprint("challenge", __name__)

# Load models and scalers
future_challenge_model = load("challenge/best_future_challenge_model.pkl")
prevention_mechanism_model = load("challenge/best_prevention_mechanism_model.pkl")
scaler = load("challenge/scaler.pkl")

# Load encoders
gender_encoder = load("challenge/Gender_encoder.pkl")
subtype_encoder = load("challenge/subtype_encoder.pkl")
inattentive_encoder = load("challenge/inattentiveScore_encoder.pkl")
hyperactive_encoder = load("challenge/hyperactiveImpulsiveScore_encoder.pkl")
combined_score_encoder = load("challenge/combinedScore_encoder.pkl")
impulsivity_encoder = load("challenge/impulsivityLevel_encoder.pkl")
current_strategy_encoder = load("challenge/Current Strategy_encoder.pkl")
teacher_feedback_encoder = load("challenge/Teacher Feedback_encoder.pkl")
academic_grade_encoder = load("challenge/Academic Grade_encoder.pkl")
challenge_encoder = load("challenge/challenge_encoder.pkl")
prevention_encoder = load("challenge/prevention_encoder.pkl")

expected_features = [
    "Age", "Gender", "subtype", "inattentiveScore", "hyperactiveImpulsiveScore",
    "combinedScore", "impulsivityLevel", "Academic Grade", "Attendance Rate (%)",
    "Current Strategy", "Effectiveness Score (1-10)", "Teacher Feedback"
]

def safe_encode(encoder, value, default=0):
    try:
        return encoder.transform([value])[0]
    except ValueError:
        return default

@challenge_bp.route("/predict", methods=["POST"])
def predict_future_challenge():
    try:
        input_data = request.json
        if not input_data:
            return jsonify({"error": "No input data provided."}), 400

        missing_fields = [field for field in expected_features if field not in input_data]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        features = [
            input_data["Age"],
            safe_encode(gender_encoder, input_data["Gender"]),
            safe_encode(subtype_encoder, input_data["subtype"]),
            safe_encode(inattentive_encoder, input_data["inattentiveScore"]),
            safe_encode(hyperactive_encoder, input_data["hyperactiveImpulsiveScore"]),
            safe_encode(combined_score_encoder, input_data["combinedScore"]),
            safe_encode(impulsivity_encoder, input_data["impulsivityLevel"]),
            safe_encode(academic_grade_encoder, input_data["Academic Grade"]),
            input_data["Attendance Rate (%)"],
            safe_encode(current_strategy_encoder, input_data["Current Strategy"]),
            input_data["Effectiveness Score (1-10)"],
            safe_encode(teacher_feedback_encoder, input_data["Teacher Feedback"])
        ]

        feature_array = np.array(features).reshape(1, -1)
        scaled_features = scaler.transform(feature_array)

        future_challenge_pred = future_challenge_model.predict(scaled_features)
        prevention_mechanism_pred = prevention_mechanism_model.predict(scaled_features)

        decoded_future_challenge = challenge_encoder.inverse_transform(future_challenge_pred)[0]
        decoded_prevention_mechanism = prevention_encoder.inverse_transform(prevention_mechanism_pred)[0]

        print(decoded_future_challenge)
        print(decoded_prevention_mechanism)

        return jsonify({
            "Future Challenge": decoded_future_challenge,
            "Prevention Mechanism": decoded_prevention_mechanism
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
