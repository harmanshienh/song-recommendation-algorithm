import { useEffect, useRef, useState } from 'react'
import { HiMagnifyingGlass } from "react-icons/hi2";
import SearchSuggestion from './SearchSuggestion';
import { useDispatch } from 'react-redux';
import { addSong } from '../redux/actions';

export interface Suggestion {
    name: string;
    id: string;
    artists: string;
    year: number;
    image: string;
}

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    const formRef = useRef<HTMLFormElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);    

    const dispatch = useDispatch();

    const handleClick = () => {
        if (searchRef.current) {
            searchRef.current.focus()
        }
    }

    useEffect(() => {
        const fetchSuggestions = async () => {
            const res = await fetch(`/api/filter?query=${searchTerm}`);
            const data = await res.json();
            setSuggestions(data);
        }

        fetchSuggestions();
    }, [searchTerm])

    const handleSuggestionClick = (suggestion: Suggestion) => {
        dispatch(addSong(suggestion));
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchTerm('');
    }

    return (
        <div className='flex flex-col'>
            <form ref={formRef} onClick={handleClick} onSubmit={handleSubmit}>
                <div className='group flex mx-auto items-center bg-slate-200 
                     mt-20 rounded-full w-full sm:w-[600px] border-2 
                       focus-within:border-green-500 focus-within:transition-colors'>
                    <HiMagnifyingGlass 
                    className='text-6xl text-gray-500 px-3 
                    group-focus-within:text-green-500 
                    group-hover:text-green-500 transition-colors' />
                    <input
                        type='text'
                        ref={searchRef}
                        value={searchTerm}
                        placeholder='What songs do you love?'
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='text-2xl bg-transparent w-full focus:outline-none' />
                </div>
            </form>
            <div className='max-h-96 overflow-y-auto'>
                {searchTerm.length > 0 && (
                    suggestions.map((suggestion) => (
                        <SearchSuggestion suggestion={suggestion} 
                        onClick={() => handleSuggestionClick(suggestion)} />
                    ))
                )}
            </div>
        </div>
    )
}
