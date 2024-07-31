import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/filter', methods=['GET'])
def filter_csv():
    file_path = os.path.join(os.path.dirname(__file__), 'data.csv')

    data = pd.read_csv(file_path)

    params = request.args.get('query', '')

    filtered_data = data[data['name'].str.contains(params, case=False, na=False)]

    filtered_data = filtered_data.head(5)

    return jsonify(filtered_data.to_dict(orient='records'))

app.run(port=3000)