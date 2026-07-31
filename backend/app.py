"""
MediQueue - Flask API for Symptom -> Specialist -> Doctor/Hospital suggestion
Run this locally to serve predictions to your frontend during demo.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # allows your frontend (different port/file) to call this API

# Folder where all .pkl/.json files live
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

def model_path(filename):
    return os.path.join(MODELS_DIR, filename)

# Load everything once at startup
model = joblib.load(model_path('symptom_disease_model.pkl'))
le = joblib.load(model_path('label_encoder.pkl'))

with open(model_path('symptom_list.json'), 'r') as f:
    all_symptoms = json.load(f)

with open(model_path('disease_to_specialist.json'), 'r') as f:
    disease_to_specialist = json.load(f)

with open(model_path('doctor_hospital_data.json'), 'r') as f:
    doctor_hospital_data = json.load(f)


@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    """Returns the full list of valid symptom names."""
    return jsonify({"symptoms": all_symptoms})


@app.route('/predict', methods=['POST'])
def predict():
    """
    Expects JSON body: { "symptoms": ["high_fever", "headache", "nausea", "vomiting"] }
    Returns: predicted disease, specialist, confidence, and matching doctors/hospitals
    """
    data = request.get_json()
    input_symptoms = data.get('symptoms', [])

    if len(input_symptoms) < 4:
        return jsonify({"error": "Please select at least 4 symptoms for accurate prediction"}), 400

    unknown = [s for s in input_symptoms if s not in all_symptoms]
    if unknown:
        return jsonify({"error": f"Unrecognized symptoms: {unknown}"}), 400

    input_vector = [1 if s in input_symptoms else 0 for s in all_symptoms]
    input_vector = np.array(input_vector).reshape(1, -1)

    probs = model.predict_proba(input_vector)[0]
    top_indices = np.argsort(probs)[::-1][:3]

    results = []
    for idx in top_indices:
        if probs[idx] < 0.1:
            continue
        disease_name = le.inverse_transform([idx])[0]
        specialist = disease_to_specialist.get(disease_name.strip(), "General Physician")
        doctors = doctor_hospital_data.get(specialist, [])
        results.append({
            "disease": disease_name.strip(),
            "specialist": specialist,
            "confidence": round(float(probs[idx]) * 100, 2),
            "doctors": doctors
        })

    if not results:
        return jsonify({"error": "Symptoms not specific enough. Please add more symptoms."}), 400

    return jsonify({"predictions": results})


if __name__ == '__main__':
    app.run(debug=True, port=5000)