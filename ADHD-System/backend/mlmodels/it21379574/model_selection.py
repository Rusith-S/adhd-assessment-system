import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from imblearn.over_sampling import SMOTE

# Load the dataset
data_path = "ADHD_dataset.csv"  # Replace with your dataset path
adhd_data = pd.read_csv(data_path)

# Preprocessing
columns_to_drop = ['Child ID', 'Name', 'Recommended Activity Type', 
                   'Impulsivity Level', 'Timetable', 'Feedback Notes']
X = adhd_data.drop(columns=columns_to_drop)
y_activity = adhd_data['Recommended Activity Type']
y_impulsivity = adhd_data['Impulsivity Level']

# Encode categorical variables
categorical_columns = X.select_dtypes(include=['object']).columns
for column in categorical_columns:
    encoder = LabelEncoder()
    X[column] = encoder.fit_transform(X[column])

# Encode targets
y_activity_encoder = LabelEncoder()
y_activity = y_activity_encoder.fit_transform(y_activity)

y_impulsivity_encoder = LabelEncoder()
y_impulsivity = y_impulsivity_encoder.fit_transform(y_impulsivity)

# Scale numerical features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split data into train and test sets
X_train, X_test, y_activity_train, y_activity_test, y_impulsivity_train, y_impulsivity_test = train_test_split(
    X_scaled, y_activity, y_impulsivity, test_size=0.2, random_state=42
)

# Address Class Imbalance with SMOTE
smote = SMOTE(random_state=42)
X_train_activity, y_train_activity = smote.fit_resample(X_train, y_activity_train)
X_train_impulsivity, y_train_impulsivity = smote.fit_resample(X_train, y_impulsivity_train)

# Define models
models = {
    "Logistic Regression": LogisticRegression(max_iter=5000),
    "SVM": SVC(probability=True),
    "Random Forest": RandomForestClassifier(),
    "Neural Network": MLPClassifier(max_iter=5000)
}

# Evaluate each model for Activity Type
activity_results = []
for model_name, model in models.items():
    model.fit(X_train_activity, y_train_activity)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_activity_test, y_pred)
    report = classification_report(y_activity_test, y_pred)
    activity_results.append({
        "Model": model_name,
        "Accuracy": acc,
        "Classification Report": report
    })
    print(f"\n{model_name} for Activity Type:\nAccuracy: {acc}\n{report}")

# Evaluate each model for Impulsivity Level
impulsivity_results = []
for model_name, model in models.items():
    model.fit(X_train_impulsivity, y_train_impulsivity)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_impulsivity_test, y_pred)
    report = classification_report(y_impulsivity_test, y_pred)
    impulsivity_results.append({
        "Model": model_name,
        "Accuracy": acc,
        "Classification Report": report
    })
    print(f"\n{model_name} for Impulsivity Level:\nAccuracy: {acc}\n{report}")

# Find the best model for Activity Type
best_activity_model = max(activity_results, key=lambda x: x["Accuracy"])
print("\nBest Model for Activity Type:")
print(f"Model: {best_activity_model['Model']}, Accuracy: {best_activity_model['Accuracy']}")

# Find the best model for Impulsivity Level
best_impulsivity_model = max(impulsivity_results, key=lambda x: x["Accuracy"])
print("\nBest Model for Impulsivity Level:")
print(f"Model: {best_impulsivity_model['Model']}, Accuracy: {best_impulsivity_model['Accuracy']}")
