import os
import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

os.makedirs("backend/model", exist_ok=True)

data = pd.DataFrame({
    "age": [22,25,28,31,35,40,45,29,33,38,24,27,42,36,30,50,26,32,39,23],
    "monthly_income": [2500,2800,3200,4200,5000,6500,8000,3500,4600,5800,2700,3100,7200,5200,3900,9000,2900,4400,6100,2600],
    "years_at_company": [1,1,2,3,5,8,12,2,4,7,1,2,10,6,3,15,1,4,9,1],
    "job_satisfaction": [2,3,3,4,4,5,5,2,4,3,2,3,5,4,3,5,2,4,4,1],
    "overtime": ["Yes","Yes","No","No","No","No","No","Yes","No","Yes","Yes","No","No","No","Yes","No","Yes","No","No","Yes"],
    "work_life_balance": [2,2,3,4,4,5,5,2,4,3,2,3,5,4,3,5,2,4,4,1],
    "attrition": ["Yes","Yes","No","No","No","No","No","Yes","No","Yes","Yes","No","No","No","Yes","No","Yes","No","No","Yes"]
})

X = data.drop(columns=["attrition"])
y = data["attrition"].map({"No": 0, "Yes": 1})

categorical = ["overtime"]
numeric = ["age", "monthly_income", "years_at_company", "job_satisfaction", "work_life_balance"]

preprocessor = ColumnTransformer([
    ("numeric", SimpleImputer(strategy="median"), numeric),
    ("categorical", Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore"))
    ]), categorical)
])

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced"
    ))
])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)

print("Model Accuracy:", round(accuracy_score(y_test, predictions), 4))
print("\nClassification Report:\n")
print(classification_report(y_test, predictions, zero_division=0))

joblib.dump(pipeline, "backend/model/attrition_model.joblib")

print("\nModel saved to backend/model/attrition_model.joblib")
