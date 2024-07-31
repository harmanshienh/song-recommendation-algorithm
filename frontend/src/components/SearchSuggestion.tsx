import { useEffect, useState } from 'react'
import { Suggestion } from './Search.tsx'

interface SuggestionProp {
    suggestion: Suggestion;
}

export default function SearchSuggestion({ suggestion } : SuggestionProp) {
    const [imageURL, setImageURL] = useState('');

    // const artists = (suggestion.artists.length > 1) ? suggestion.artists.join(', ') : suggestion.artists

    // useEffect(() => {
    //     const fetchAlbumImage = async () => {
    //         const encodedName = encodeURIComponent(suggestion.name);
    //         const encodedArtists = encodeURIComponent(suggestion.artists.join(', '));

    //         const res = await fetch(
    //             `http://localhost:3000/api/album?name=${encodedName}&artists=${encodedArtists}`
    //         );
    //         const data = await res.json();
    //         setImageURL(data);
    //     }

    //     fetchAlbumImage()
    // }, [])
  return (
    <div className='flex flex-row bg-zinc-900 hover:bg-zinc-700 transition-colors hover:cursor-pointer w-full md:max-w-2xl mx-auto rounded-lg'>
        <img src='https://i.scdn.co/image/ab67616d0000b273ce159a3ba2096e13fa9d4b4c' className='h-24 w-auto rounded-lg p-2' />
        <div className='flex flex-col gap-2 overflow-hidden p-2'>
            <span className='text-lg text-slate-200 truncate text-start'>
                {suggestion.name}
            </span>
            <span className='text-sm text-slate-400 truncate text-start'>
                {suggestion.artists}
            </span>
        </div>
    </div>
  )
}
