from flask import Flask, request, jsonify
from joblib import load
import numpy as np

app = Flask(__name__)

# Load pre-trained models and scaler
future_challenge_model = load("best_future_challenge_model.pkl")
prevention_mechanism_model = load("best_prevention_mechanism_model.pkl")
scaler = load("scaler.pkl")

# Load encoders for categorical features and target variables
gender_encoder = load("Gender_encoder.pkl")
subtype_encoder = load("subtype_encoder.pkl")
inattentive_encoder = load("inattentiveScore_encoder.pkl")
hyperactive_encoder = load("hyperactiveImpulsiveScore_encoder.pkl")
combined_score_encoder = load("combinedScore_encoder.pkl")
impulsivity_encoder = load("impulsivityLevel_encoder.pkl")
current_strategy_encoder = load("Current Strategy_encoder.pkl")
teacher_feedback_encoder = load("Teacher Feedback_encoder.pkl")
academic_grade_encoder = load("Academic Grade_encoder.pkl")
challenge_encoder = load("challenge_encoder.pkl")
prevention_encoder = load("prevention_encoder.pkl")

# Define the expected input features in the correct order
expected_features = [
    "Age", "Gender", "subtype", "inattentiveScore", "hyperactiveImpulsiveScore",
    "combinedScore", "impulsivityLevel", "Academic Grade", "Attendance Rate (%)",
    "Current Strategy", "Effectiveness Score (1-10)", "Teacher Feedback"
]

def safe_encode(encoder, value, default=0):
    """Encodes a value using LabelEncoder, falling back to a default if unseen."""
    try:
        return encoder.transform([value])[0]
    except ValueError:
        return default

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Parse the input JSON
        input_data = request.json

        # Validate input JSON
        if not input_data:
            return jsonify({"error": "No input data provided."}), 400

        # Check for missing fields
        missing_fields = [field for field in expected_features if field not in input_data]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        # Extract and preprocess features
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

        # Convert to NumPy array and scale features
        feature_array = np.array(features).reshape(1, -1)
        scaled_features = scaler.transform(feature_array)

        # Predict Future Challenge and Prevention Mechanism
        future_challenge_pred = future_challenge_model.predict(scaled_features)
        prevention_mechanism_pred = prevention_mechanism_model.predict(scaled_features)

        # Decode predictions
        decoded_future_challenge = challenge_encoder.inverse_transform(future_challenge_pred)[0]
        decoded_prevention_mechanism = prevention_encoder.inverse_transform(prevention_mechanism_pred)[0]

        # Return predictions as JSON
        return jsonify({
            "Future Challenge": decoded_future_challenge,
            "Prevention Mechanism": decoded_prevention_mechanism
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
