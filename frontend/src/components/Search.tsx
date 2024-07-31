import { useEffect, useRef, useState } from 'react'
import { HiMagnifyingGlass } from "react-icons/hi2";

interface Suggestion {
    name: string;
    artists: string[];
}

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [songs, setSongs] = useState([]);

    const searchRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (searchRef.current) {
            searchRef.current.focus()
        }
    }

    useEffect(() => {
        const fetchSuggestions = async () => {
            const res = await fetch(`http://localhost:3000/api/filter?query=${searchTerm}`);
            const data = await res.json();
            setSuggestions(data);
        }

        fetchSuggestions();
    }, [searchTerm])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return (
        <>
            <form onClick={handleClick} onSubmit={handleSubmit}>
                <div className='group flex mx-auto items-center bg-slate-200 mt-20 rounded-full w-full md:max-w-2xl border-2 
                       focus-within:border-green-500 focus-within:transition-colors'>
                    <HiMagnifyingGlass className='text-6xl text-gray-500 px-3 group-focus-within:text-green-500 group-hover:text-green-500 transition-colors' />
                    <input
                        type='text'
                        ref={searchRef}
                        value={searchTerm}
                        placeholder='What songs do you love?'
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='text-2xl bg-transparent w-full focus:outline-none' />
                </div>
            </form>
            {suggestions.length > 0 && (
                suggestions.map((suggestion) => (
                        <div>
                            <span className='text-white'>{suggestion.name} by {suggestion.artists}</span>
                        </div>
                ))
            )}
        </>
    )
}
