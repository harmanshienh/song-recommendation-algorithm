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
    params = request.args.get('query', '')
    return literal_eval(params)

@app.route('/api/album', methods=['GET'])
def get_album_cover():
    # name = request.args.get('name', '')
    # artists = request.args.get('artists', '')

    # artists_list = artists.split(', ')
    # artists_query = ' '.join([f'artist:{artist.strip()}' for artist in artists_list])

    # query = f"track:{name} {artists_query}"

    # results = sp.search(q=query, type='track', limit=1)

    # if results['tracks']['items']:
    #     track = results['tracks']['items'][0]
    #     album_cover_url = track['album']['images'][0]['url']
    #     return jsonify({'album_cover_url': album_cover_url})
    # else:
    #     return jsonify({'error': 'Album cover not found', 'query': query, 'artists': artists}), 404
    return jsonify({'album_cover_url': 'https://play-lh.googleusercontent.com/CQri0N-BiyrACHpHPPtITg3TMV5-bZNbAuhjrg-Zpc_mw6tIWZJFPmT8Yr5r4R-xbA=w240-h480-rw'})

app.run(port=3000, debug=True)