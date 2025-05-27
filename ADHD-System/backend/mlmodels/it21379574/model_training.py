import warnings
from sklearn.exceptions import ConvergenceWarning
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=ConvergenceWarning)

import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE
from joblib import dump
from sklearn.ensemble import RandomForestClassifier
import shap
import matplotlib.pyplot as plt

# Load the dataset
data_path = "ADHD_dataset.csv"  # Replace with your dataset path
adhd_data = pd.read_csv(data_path)

# Preprocessing
columns_to_drop = ['Child ID', 'Name', 'Recommended Activity Type', 
                   'Impulsivity Level', 'Timetable', 'Feedback Notes']
X = adhd_data.drop(columns=columns_to_drop)
y_activity = adhd_data['Recommended Activity Type']
y_impulsivity = adhd_data['Impulsivity Level']

# Encode categorical variables and save encoders
categorical_columns = X.select_dtypes(include=['object']).columns
for column in categorical_columns:
    encoder = LabelEncoder()
    X[column] = encoder.fit_transform(X[column])
    dump(encoder, f"{column}_encoder.pkl")
    print(f"Saved encoder for column '{column}' as '{column}_encoder.pkl'")

# Encode targets and save encoders
y_activity_encoder = LabelEncoder()
y_activity = y_activity_encoder.fit_transform(y_activity)
dump(y_activity_encoder, "y_activity_encoder.pkl")
print("Activity label encoder saved as 'y_activity_encoder.pkl'")

y_impulsivity_encoder = LabelEncoder()
y_impulsivity = y_impulsivity_encoder.fit_transform(y_impulsivity)
dump(y_impulsivity_encoder, "y_impulsivity_encoder.pkl")
print("Impulsivity label encoder saved as 'y_impulsivity_encoder.pkl'")

# Scale numerical features and save scaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
dump(scaler, "scaler.pkl")
print("Fitted scaler saved as 'scaler.pkl'")

# Dimensionality Reduction with PCA
pca = PCA(n_components=10)
X_scaled = pca.fit_transform(X_scaled)  # Reduce dimensionality while retaining variance
dump(pca, "pca.pkl")  # Save PCA object
print("PCA object saved as 'pca.pkl'")

# Split data into train and test sets
X_train, X_test, y_activity_train, y_activity_test, y_impulsivity_train, y_impulsivity_test = train_test_split(
    X_scaled, y_activity, y_impulsivity, test_size=0.2, random_state=42
)

# Address Class Imbalance with SMOTE
smote = SMOTE(random_state=42)
X_train_activity, y_train_activity = smote.fit_resample(X_train, y_activity_train)
X_train_impulsivity, y_train_impulsivity = smote.fit_resample(X_train, y_impulsivity_train)

# Hyperparameter Tuning Function for Random Forest
def tune_random_forest(X_train, y_train):
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [10, 20, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    model = RandomForestClassifier(random_state=42)
    grid_search = GridSearchCV(
        model,
        param_grid,
        cv=5,
        scoring='accuracy',
        verbose=0,
        n_jobs=-1
    )
    grid_search.fit(X_train, y_train)
    print(f"Best Parameters for Random Forest: {grid_search.best_params_}")
    return grid_search.best_estimator_

# Plot Classification Report as PNG
def plot_classification_report(y_test, y_pred, report_title, output_path):
    report = classification_report(y_test, y_pred, output_dict=True)
    report_df = pd.DataFrame(report).transpose()

    # Plot the classification report
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.axis('tight')
    ax.axis('off')
    table = ax.table(cellText=report_df.values,
                     colLabels=report_df.columns,
                     rowLabels=report_df.index,
                     loc='center')
    table.auto_set_font_size(False)
    table.set_fontsize(10)
    table.auto_set_column_width(col=list(range(len(report_df.columns))))
    plt.title(report_title)
    plt.savefig(output_path)
    plt.close()

# SHAP Feature Analysis with KernelExplainer
def analyze_features_with_shap_kernel(model, X, feature_names, output_path):
    explainer = shap.Explainer(model, X[:100])
    shap_values = explainer(X[:100])
    shap.summary_plot(shap_values, feature_names=feature_names, plot_type="bar")
    plt.savefig(output_path)  # Save SHAP output to file
    plt.close()

# Train Random Forest for Activity Type
print("Tuning and training Random Forest for Activity Type...")
best_activity_model = tune_random_forest(X_train_activity, y_train_activity)
y_activity_pred = best_activity_model.predict(X_test)
plot_classification_report(y_activity_test, y_activity_pred, "Activity Type Classification Report", "activity_classification_report.png")
analyze_features_with_shap_kernel(best_activity_model, X_scaled, X.columns, "shap_activity_type.png")
best_activity_model.fit(X_train_activity, y_train_activity)
dump(best_activity_model, "best_activity_model.pkl")
print("Random Forest model for Activity Type saved as 'best_activity_model.pkl'")

# Train Random Forest for Impulsivity Level
print("Tuning and training Random Forest for Impulsivity Level...")
best_impulsivity_model = tune_random_forest(X_train_impulsivity, y_train_impulsivity)
y_impulsivity_pred = best_impulsivity_model.predict(X_test)
plot_classification_report(y_impulsivity_test, y_impulsivity_pred, "Impulsivity Level Classification Report", "impulsivity_classification_report.png")
analyze_features_with_shap_kernel(best_impulsivity_model, X_scaled, X.columns, "shap_impulsivity_level.png")
best_impulsivity_model.fit(X_train_impulsivity, y_train_impulsivity)
dump(best_impulsivity_model, "best_impulsivity_model.pkl")
print("Random Forest model for Impulsivity Level saved as 'best_impulsivity_model.pkl'")

# Final confirmation message
print("Model training and saving completed for both Activity Type and Impulsivity Level.")
print("Reports and SHAP plots are saved in the working directory.")
