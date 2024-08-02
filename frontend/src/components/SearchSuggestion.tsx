import { useEffect, useState } from 'react'
import { Suggestion } from './Search.tsx'

interface SuggestionProp {
    suggestion: Suggestion;
    onClick: (suggestion: Suggestion) => void;
}

export default function SearchSuggestion({ suggestion, onClick } : SuggestionProp) {
    const [artists, setArtists] = useState([]);
    const [imageURL, setImageURL] = useState('');

    useEffect(() => {
        const fetchArtists = async () => {
            const res = await fetch(`http://localhost:3000/api/list?query=${suggestion.artists}`);
            const data = await res.json();
            setArtists(data);
        }

        fetchArtists();
    }, [suggestion.artists])

    useEffect(() => {
        const fetchAlbumImage = async () => {
            const encodedName = encodeURIComponent(suggestion.name);
            const encodedArtists = encodeURIComponent(artists.join(', '));

            const res = await fetch(
                `http://localhost:3000/api/album?name=${encodedName}&artists=${encodedArtists}`
            );
            const data = await res.json();
            setImageURL(data.album_cover_url);
        }

        fetchAlbumImage()
    }, [artists, suggestion.name])

    return (
        <div onClick={() => onClick(suggestion)} 
             className='flex flex-row bg-zinc-900 hover:bg-zinc-700 
             transition-colors hover:cursor-pointer w-full md:max-w-2xl 
             mx-auto rounded-lg'>
            <img src={imageURL} className='h-14 w-auto rounded-lg p-2' />
            <div className='flex flex-col overflow-hidden p-1'>
                <span className='text-lg text-slate-200 truncate text-start'>
                    {suggestion.name}
                </span>
                <span className='text-sm text-slate-400 truncate text-start'>
                    {artists.join(', ')}
                </span>
            </div>
        </div>
    )
}
