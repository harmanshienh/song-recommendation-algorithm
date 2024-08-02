import { useEffect, useState } from 'react'
import { Song } from '../redux/types';

interface SelectionProp {
    song: Song;
}

export default function SearchSelection({ song }: SelectionProp) {
    const [artists, setArtists] = useState([]);
    const [imageURL, setImageURL] = useState('');

    useEffect(() => {
        const fetchArtists = async () => {
            const res = await fetch(`http://localhost:3000/api/list?query=${song.artists}`);
            const data = await res.json();
            setArtists(data);
        }

        const fetchAlbumImage = async () => {
            const encodedName = encodeURIComponent(song.name);
            const encodedArtists = encodeURIComponent(artists.join(', '));

            const res = await fetch(
                `http://localhost:3000/api/album?name=${encodedName}&artists=${encodedArtists}`
            );
            const data = await res.json();
            setImageURL(data.album_cover_url);
        }

        fetchArtists();
        fetchAlbumImage();

    }, [])

    return (
        <div className='flex flex-row bg-zinc-900 hover:bg-zinc-700 
             transition-colors hover:cursor-pointer w-full md:max-w-2xl 
             mx-auto rounded-lg'>
            <img src={imageURL} className='h-24 w-auto rounded-lg p-2' />
            <div className='flex flex-col gap-2 overflow-hidden p-2'>
                <span className='text-lg text-slate-200 truncate text-start'>
                    {song.name}
                </span>
                <span className='text-sm text-slate-400 truncate text-start'>
                    {artists.join(', ')}
                </span>
                <span className='text-sm text-slate-400'>
                    {song.year}
                </span>
            </div>
        </div>
    )
}

