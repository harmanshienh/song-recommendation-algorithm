import numpy as np
import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from collections import defaultdict
from scipy.spatial.distance import cdist
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from ast import literal_eval
import sqlalchemy
from sqlalchemy import or_, and_

import os

app = Flask(__name__, static_folder='../public')
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["MYSQL_URI"]
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = sqlalchemy(app)

file_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'data.csv')

data = pd.read_csv(file_path)

load_dotenv()

sp = spotipy.Spotify(auth_manager = SpotifyClientCredentials(
    client_id = os.environ["SPOTIFY_CLIENT_ID"], 
    client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]))

song_cluster_pipeline = Pipeline([('scaler', StandardScaler()),
                                  ('kmeans', KMeans(n_clusters=20, verbose=False))], 
                                  verbose=False)

class Song(db.Model):
    __tablename__ = 'songs'
    id = db.Column(db.String(255), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    artists = db.Column(db.String(255), nullable=False)
    year = db.Column(db.Integer)
    image = db.Column(db.String(255))

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    out_dir = os.path.join(app.static_folder, 'out')
    if path != "" and os.path.exists(os.path.join(out_dir, path)):
        return send_from_directory(out_dir, path)
    else:
        return send_from_directory(out_dir, 'index.html')


@app.route('/api/filter', methods=['GET'])
def filter_csv():

    searchTerm = request.args.get('query', '')
    searchTerm_words = searchTerm.lower().split()

    conditions = []
    for word in searchTerm_words:
        conditions.append(or_(Song.name.ilike(f"%{word}%"), Song.artists.ilike(f"%{word}%")))
    
    filtered_data = Song.query.filter(and_(*conditions)).limit(10).all()

    result = []
    for song in filtered_data:
        result.append({
            'name': song.name,
            'id': song.id,
            'artists': song.artists,
            'year': song.year,
            'image': song.image
        })

    return jsonify(result)
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
    num_songs = 5
    songs = request.get_json()
    print(f"Songs: {songs}")
    metadata_cols = ['name', 'year', 'artists', 'image']
    song_dict = flatten_dict_list(songs)

    if not isinstance(songs, list) or not all(isinstance(song, dict) for song in songs):
        return jsonify({"error": "Invalid data format"}), 400
    
    song_center = get_mean_vector(songs, data)

    song_center_df = pd.DataFrame(song_center.reshape(1, -1), columns=number_cols)
    
    scaler = song_cluster_pipeline.steps[0][1]
    
    if not hasattr(scaler, 'scale_'):
        scaler.fit(data[number_cols])
    
    scaled_data = scaler.transform(data[number_cols])
    scaled_song_center = scaler.transform(song_center_df)
    
    distances = cdist(scaled_song_center, scaled_data, 'cosine')
    index = list(np.argsort(distances)[:, :num_songs][0])
    
    rec_songs = data.iloc[index]
    rec_songs = rec_songs[~rec_songs['name'].isin(song_dict['name'])]
    return jsonify(rec_songs[metadata_cols].to_dict(orient='records'))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 4000))
    app.run(host="0.0.0.0", port=port, debug=True)