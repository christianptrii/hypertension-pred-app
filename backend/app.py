from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import os

app = Flask(__name__)
# CORS Configuration for Deployment & Local Testing
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# --- LOAD MODEL (Absolute Path for Stability) ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'models', 'model_rf_pso.pkl')

model = None
try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print("✅ Model RF-PSO loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model: {str(e)}")

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "status": "online", 
        "message": "Hypertension Prediction API (PSO-RF) is running"
    })

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return app.make_default_options_response()
        
    try:
        data = request.json
        if not data:
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400

        # 1. Category Mapping (Match with LabelEncoder)
        jk_val = 1 if data.get('gender') == 'Male' else 0
        merokok_val = 1 if data.get('smoking') == 'Yes' else 0
        
        # 2. Extract Numeric Values
        umur = float(data.get('age', 0))
        tinggi = float(data.get('height', 0))
        berat = float(data.get('weight', 0))
        imt = float(data.get('bmi', 0))
        sistole = float(data.get('systole', 0))
        diastole = float(data.get('diastole', 0))

        # 3. Create DataFrame with ORIGINAL Indonesian Column Names
        # These must stay in Indonesian to match your .pkl model training
        column_names = [
            'Jenis Kelamin', 'Umur Tahun', 'Merokok', 
            'Tinggi', 'Berat Badan', 'Hasil IMT', 
            'Sistole', 'Diastole'
        ]
        
        input_data = [[jk_val, umur, merokok_val, tinggi, berat, imt, sistole, diastole]]
        input_df = pd.DataFrame(input_data, columns=column_names)

        # 4. AI Prediction
        if model is None:
            return jsonify({'status': 'error', 'message': 'AI Model not found on server'}), 500

        prediction = model.predict(input_df)[0]
        probabilities = model.predict_proba(input_df)[0]
        high_risk_prob = round(probabilities[1] * 100, 2)

        # 5. Return JSON with ENGLISH labels for UI
        return jsonify({
    'status': 'success',
    'result': 'High Risk' if prediction == 1 else 'Low Risk',
    'probability': high_risk_prob,
    'factors': [
        # Change these names to English
        {'name': 'Blood Pressure', 'weight': min(100, int(sistole / 2.5))},
        {'name': 'BMI Analysis', 'weight': min(100, int(imt * 2))},
        {'name': 'Age Factor', 'weight': min(100, int(umur / 1.5))},
        {'name': 'Smoking Status', 'weight': 15 if merokok_val == 1 else 0}
    ]
})

    except Exception as e:
        print(f"Prediction Error: {str(e)}")
        return jsonify({
            'status': 'error', 
            'message': str(e)
        }), 400

if __name__ == '__main__':
    # Use port 5000 for local development
    app.run(debug=True, port=5000)