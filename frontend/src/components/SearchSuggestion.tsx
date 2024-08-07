import { useEffect, useState } from 'react'
import { Suggestion } from './Search.tsx'

interface SuggestionProp {
    suggestion: Suggestion;
    onClick: (suggestion: Suggestion) => void;
}

export default function SearchSuggestion({ suggestion, onClick }: SuggestionProp) {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchArtists = async () => {
            const res = await fetch(`http://localhost:3000/api/list?query=${suggestion.artists}`);
            const data = await res.json();
            setArtists(data);
        }

        setLoading(true);
        fetchArtists();
        setLoading(false);
    }, [suggestion.artists])

    return (
        <>
        {!loading &&
            <div onClick={() => onClick(suggestion)}
                className='flex flex-row bg-zinc-900 hover:bg-zinc-700 
             transition-colors hover:cursor-pointer w-full md:max-w-[600px]
             mx-auto rounded-lg'>
                <img src={suggestion.image} className='h-14 w-auto rounded-lg p-2' />
                <div className='flex flex-col overflow-hidden p-1'>
                    <span className='text-lg text-slate-200 truncate text-start'>
                        {suggestion.name}
                    </span>
                    <span className='text-sm text-slate-400 truncate text-start'>
                        {artists.join(', ')}
                    </span>
                </div>
            </div>
        }
        </>
    )
}
