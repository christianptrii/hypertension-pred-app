from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import os

app = Flask(__name__)
# Gunakan konfigurasi CORS yang lebih spesifik untuk menangani preflight request
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# --- LOAD MODEL (Gunakan Path Absolut agar aman di Vercel) ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'models', 'model_rf_pso.pkl')

model = None
try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print("✅ Model RF-PSO Berhasil Dimuat!")
except Exception as e:
    print(f"❌ Gagal Memuat Model: {str(e)}")

# Rute utama agar tidak muncul "Not Found" saat dibuka di browser
@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "online", "message": "Hypertension Prediction API is running"})

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Tangani Preflight Request secara eksplisit
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        return response
        
    try:
        data = request.json
        if not data:
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400

        # 1. Mapping Kategori ke Angka
        jk_val = 1 if data.get('gender') == 'Male' else 0
        merokok_val = 1 if data.get('smoking') == 'Yes' else 0
        
        # 2. Ambil nilai numerik
        umur = float(data.get('age', 0))
        tinggi = float(data.get('height', 0))
        berat = float(data.get('weight', 0))
        imt = float(data.get('bmi', 0))
        sistole = float(data.get('systole', 0))
        diastole = float(data.get('diastole', 0))

        # 3. Susun ke dalam DataFrame
        column_names = [
            'Jenis Kelamin', 'Umur Tahun', 'Merokok', 
            'Tinggi', 'Berat Badan', 'Hasil IMT', 
            'Sistole', 'Diastole'
        ]
        
        input_data = [[jk_val, umur, merokok_val, tinggi, berat, imt, sistole, diastole]]
        input_df = pd.DataFrame(input_data, columns=column_names)

        # 4. Prediksi
        if model is None:
            return jsonify({'status': 'error', 'message': 'Model not loaded'}), 500

        prediction = model.predict(input_df)[0]
        probabilities = model.predict_proba(input_df)[0]
        
        # Ambil probabilitas High Risk (Kelas 1)
        high_risk_prob = round(probabilities[1] * 100, 2)

        return jsonify({
            'status': 'success',
            'result': 'High Risk' if prediction == 1 else 'Low Risk',
            'probability': high_risk_prob,
            'factors': [
                {'name': 'Tekanan Darah (Sistole)', 'weight': min(100, int(sistole / 2.5))},
                {'name': 'Indeks Massa Tubuh (IMT)', 'weight': min(100, int(imt * 2))},
                {'name': 'Faktor Usia', 'weight': min(100, int(umur / 1.5))}
            ]
        })

    except Exception as e:
        return jsonify({
            'status': 'error', 
            'message': str(e)
        }), 400

# Penting untuk Vercel: pastikan ada objek 'app' yang bisa di-import
if __name__ == '__main__':
    app.run(debug=True, port=5000)