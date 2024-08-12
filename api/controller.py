import numpy as np
import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from collections import defaultdict
from scipy.spatial.distance import cdist
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
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

song_cluster_pipeline = Pipeline([('scaler', StandardScaler()),
                                  ('kmeans', KMeans(n_clusters=20, verbose=False))], 
                                  verbose=False)

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

def find_song(name, year):
    song_data = defaultdict()
    results = sp.search(q= 'track: {} year: {}'.format(name,year), limit=1)
    if results['tracks']['items'] == []:
        return None

    results = results['tracks']['items'][0]
    track_id = results['id']
    audio_features = sp.audio_features(track_id)[0]

    song_data['name'] = [name]
    song_data['year'] = [year]
    song_data['explicit'] = [int(results['explicit'])]
    song_data['duration_ms'] = [results['duration_ms']]
    song_data['popularity'] = [results['popularity']]

    for key, value in audio_features.items():
        song_data[key] = value

    return pd.DataFrame(song_data)

def get_song_data(song, spotify_data):
    
    try:
        song_data = spotify_data[(spotify_data['name'] == song['name']) 
                                & (spotify_data['year'] == song['year'])].iloc[0]
        return song_data
    
    except IndexError:
        return find_song(song['name'], song['year'])

number_cols = ['valence', 'year', 'acousticness', 'danceability', 'duration_ms', 
               'energy', 'explicit', 'instrumentalness', 'key', 'liveness', 
               'loudness', 'mode', 'popularity', 'speechiness', 'tempo']

def get_mean_vector(song_list, spotify_data):
    
    song_vectors = []
    
    for song in song_list:
        song_data = get_song_data(song, spotify_data)
        if song_data is None:
            print('Warning: {} does not exist in Spotify or in database'.format(song['name']))
            continue
        song_vector = song_data[number_cols].values        
        song_vectors.append(song_vector)
    
    song_matrix = np.array(list(song_vectors))
    return np.mean(song_matrix, axis=0)

def flatten_dict_list(dict_list):
    
    flattened_dict = defaultdict()
    for key in dict_list[0].keys():
        flattened_dict[key] = []
    
    for dictionary in dict_list:
        for key, value in dictionary.items():
            flattened_dict[key].append(value)
            
    return flattened_dict

@app.route('/api/recommend', methods=['POST'])
def recommend_songs():
    file_path = os.path.join(os.path.dirname(__file__), 'data.csv')
    data = pd.read_csv(file_path, low_memory=False)
    num_songs = 5
    songs = request.get_json()
    print(f"Songs: {songs}")
    metadata_cols = ['name', 'year', 'artists', 'image']
    song_dict = flatten_dict_list(songs)

    if not isinstance(songs, list) or not all(isinstance(song, dict) for song in songs):
        return jsonify({"error": "Invalid data format"}), 400
    
    song_center = get_mean_vector(songs, data)

    song_center_df = pd.DataFrame(song_center.reshape(1, -1), columns=number_cols)
    
    # Extract the scaler from the pipeline
    scaler = song_cluster_pipeline.steps[0][1]
    
    # Fit the scaler on the numeric columns if it's not already fitted
    if not hasattr(scaler, 'scale_'):  # Check if the scaler has already been fitted
        scaler.fit(data[number_cols])
    
    # Transform spotify_data and song_center with consistent feature names
    scaled_data = scaler.transform(data[number_cols])
    scaled_song_center = scaler.transform(song_center_df)
    
    distances = cdist(scaled_song_center, scaled_data, 'cosine')
    index = list(np.argsort(distances)[:, :num_songs][0])
    
    rec_songs = data.iloc[index]
    rec_songs = rec_songs[~rec_songs['name'].isin(song_dict['name'])]
    return jsonify(rec_songs[metadata_cols].to_dict(orient='records'))

app.run(port=3000, debug=True)