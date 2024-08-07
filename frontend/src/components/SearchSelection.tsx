import { useEffect, useState } from 'react'
import { Song } from '../redux/types';
import { TiDelete } from "react-icons/ti";
import { useDispatch } from 'react-redux';
import { removeSong } from '../redux/actions';

interface SelectionProp {
    song: Song;
}

export default function SearchSelection({ song }: SelectionProp) {
    const [artists, setArtists] = useState([]);
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();

    const handleRemoveSong = () => {
        dispatch(removeSong(song.id));
    }

    useEffect(() => {
        const fetchArtists = async () => {
            const res = await fetch(`http://localhost:3000/api/list?query=${song.artists}`);
            const data = await res.json();
            setArtists(data);
            setVisible(true);
        }

        fetchArtists();
    }, [song.artists])

    return (
        <div className={`relative flex bg-zinc-900 hover:bg-zinc-700 
              hover:cursor-pointer w-full sm:w-[384px]
             mx-auto rounded-lg transition-all duration-300 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <img src={song.image} className='h-24 w-auto rounded-lg p-2' />
            <div className='flex flex-col gap-2 p-2 pr-8'>
                <span className='text-lg text-slate-200 truncate text-start max-w-28 sm:max-w-56'>
                    {song.name}
                </span>
                <div className='flex gap-1'>
                    <span className='text-sm text-slate-400 truncate text-start max-w-28 sm:max-w-40'>
                        {artists.join(', ')}
                    </span>
                    <span className='text-sm text-slate-400'>
                        ({song.year})
                    </span>
                </div>
            </div>
            <TiDelete onClick={handleRemoveSong}
            className='absolute right-2 top-1/2 transform -translate-y-1/2 
            text-2xl text-red-500 hover:text-red-800 hover:text-3xl 
            hover:translate-x-[3px] transition-all' />
        </div>
    )
}

