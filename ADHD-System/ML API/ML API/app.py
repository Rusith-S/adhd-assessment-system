from flask import Flask
from challenge.predict_future_challenge import challenge_bp
from activity.predict_activity import activity_bp

app = Flask(__name__)

# Register blueprints
app.register_blueprint(challenge_bp, url_prefix="/challenge")
app.register_blueprint(activity_bp, url_prefix="/activity")

if __name__ == "__main__":
    app.run(debug=True, port=5008)

