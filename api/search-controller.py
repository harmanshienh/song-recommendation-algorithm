import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

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

    params = request.args.get('query', '')

    filtered_data = data[data['name'].str.contains(params, case=False, na=False)]

    filtered_data = filtered_data.head(10)

    return jsonify(filtered_data.to_dict(orient='records'))

@app.route('/api/album', methods=['GET'])
def get_album_cover():
    name = request.args.get('name', '')
    artists = request.args.get('artists', '')

    artists_list = artists.split(',')
    artists_query = ' '.join([f'artist:{artist.strip()}' for artist in artists_list])

    query = f"track:{name} {artists_query}"

    results = sp.search(q=query, type='track', limit=1)

    if results['tracks']['items']:
        track = results['tracks']['items'][0]
        album_cover_url = track['album']['images'][0]['url']
        return jsonify({'album_cover_url': album_cover_url})
    else:
        return jsonify({'error': 'Album cover not found', 'query': query, 'artists': artists}), 404

app.run(port=3000, debug=True)