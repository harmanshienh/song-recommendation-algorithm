import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from ast import literal_eval

import os

app = Flask(__name__)
CORS(app)

load_dotenv()

sp = spotipy.Spotify(auth_manager = SpotifyClientCredentials(
    client_id = os.environ["SPOTIFY_CLIENT_ID"], 
    client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]))

@app.route('/api/filter', methods=['GET'])
def filter_csv():
    file_path = os.path.join(os.path.dirname(__file__), 'data.csv')

    data = pd.read_csv(file_path)

    searchTerm = request.args.get('query', '')
    searchTerm_words = searchTerm.lower().split()

    def match_terms(text, terms):
        text = text.lower()
        for term in terms:
            if term not in text:
                return False
        return True

    filtered_data = data[data.apply(
        lambda row: match_terms(row['name'], searchTerm_words) 
        or match_terms(row['artists'], searchTerm_words), axis=1
    )]

    filtered_data = filtered_data.head(10)

    return jsonify(filtered_data.to_dict(orient='records'))

@app.route('/api/list', methods=['GET'])
def convert_to_list():
    artists = request.args.get('query', '')
    return literal_eval(artists)

@app.route('/api/geturl', methods=['GET'])
def fetch_song_url():
    name = request.args.get('query', '')
    if not name:
        return jsonify({'error': 'Query parameter is required'}), 400
    
    results = sp.search(q=name, type='track', limit=1) 
    
    tracks = results.get('tracks', {})
    items = tracks.get('items', [])
    
    if not items:
        return jsonify({'error': 'No tracks found'}), 404
    
    track = items[0]
    track_name = track.get('name')
    track_url = track.get('external_urls', {}).get('spotify')
    
    if not track_url:
        return jsonify({'error': 'No URL found for the track'}), 404
    
    return jsonify({'name': track_name, 'url': track_url})

app.run(port=3000, debug=True)