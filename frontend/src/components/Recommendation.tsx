import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface Recommendation {
    name: string;
    artists: string;
    year: number;
    image: string;
}

interface RecommendationProp {
    recommendation: Recommendation;
}

export default function Recommendation({ recommendation }: RecommendationProp) {
    const [artists, setArtists] = useState([]);
    const [url, setUrl] = useState('');

    useEffect(() => {
        const fetchArtists = async () => {
            const res = await fetch(`http://localhost:3000/api/list?query=${recommendation.artists}`);
            const data = await res.json();
            setArtists(data);
        }

        fetchArtists();
    }, [recommendation.artists])

    useEffect(() => {
        const fetchUrl = async () => {
            const res = await fetch(`http://localhost:3000/api/geturl?query=${recommendation.name}`);
            const data = await res.json();
            setUrl(data.url);
        }

        fetchUrl();
    }, [])

    return (
        <Link to={url}>
            <div className='relative flex flex-row bg-zinc-900 hover:bg-zinc-700 
             transition-colors hover:cursor-pointer w-full md:max-w-sm
             mx-auto rounded-lg'>
                <img src={recommendation.image} className='h-24 w-auto rounded-lg p-2' />
                <div className='flex flex-col gap-2 overflow-hidden p-2'>
                    <span className='text-lg text-slate-200 truncate text-start max-w-56'>
                        {recommendation.name}
                    </span>
                    <div className='flex gap-1 max-w-56'>
                        <span className='text-sm text-slate-400 truncate text-start'>
                            {artists.join(', ')}
                        </span>
                        <span className='text-sm text-slate-400'>
                            ({recommendation.year})
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

