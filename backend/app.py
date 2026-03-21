from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# --- LOAD MODEL ---
model_path = os.path.join('models', 'model_rf_pso.pkl')

try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print("✅ Model RF-PSO Berhasil Dimuat!")
except Exception as e:
    print(f"❌ Gagal Memuat Model: {str(e)}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print("--- Data Masuk dari React ---")
        print(data)

        # 1. Mapping Kategori ke Angka (Sesuaikan dengan LabelEncoder di Notebook)
        # Jika di notebook Male = 1, Female = 0
        jk_val = 1 if data.get('gender') == 'Male' else 0
        # Jika di notebook Merokok: Ya = 1, Tidak = 0 (Sesuaikan stringnya)
        merokok_val = 1 if data.get('smoking') == 'Yes' else 0
        
        # 2. Ambil nilai numerik dari React
        umur = float(data.get('age', 0))
        tinggi = float(data.get('height', 0))
        berat = float(data.get('weight', 0))
        imt = float(data.get('bmi', 0))
        sistole = float(data.get('systole', 0))
        diastole = float(data.get('diastole', 0))

        # 3. Susun ke dalam DataFrame dengan Nama Kolom ASLI dari Notebook
        # Urutan HARUS sama dengan list yang kamu berikan tadi
        column_names = [
            'Jenis Kelamin', 'Umur Tahun', 'Merokok', 
            'Tinggi', 'Berat Badan', 'Hasil IMT', 
            'Sistole', 'Diastole'
        ]
        
        input_data = [[jk_val, umur, merokok_val, tinggi, berat, imt, sistole, diastole]]
        input_df = pd.DataFrame(input_data, columns=column_names)

        # 4. Prediksi
        prediction = model.predict(input_df)[0]
        probabilities = model.predict_proba(input_df)[0]
        
        # Ambil probabilitas High Risk (Kelas 1)
        high_risk_prob = round(probabilities[1] * 100, 2)

        print(f"Hasil: {prediction}, Probabilitas: {high_risk_prob}%")

        return jsonify({
            'status': 'success',
            'result': 'High Risk' if prediction == 1 else 'Low Risk',
            'probability': high_risk_prob,
            'factors': [
                {'name': 'Tekanan Darah (Sistole)', 'weight': int(sistole / 2.5)},
                {'name': 'Indeks Massa Tubuh (IMT)', 'weight': int(imt * 2)},
                {'name': 'Faktor Usia', 'weight': int(umur / 1.5)}
            ]
        })

    except Exception as e:
        print(f"⚠️ ERROR DETAIL: {str(e)}")
        return jsonify({
            'status': 'error', 
            'message': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)