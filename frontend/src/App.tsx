import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search';

function App() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch('/recommend');
      const data = await res.json()
      setSongs(data);
    }
    fetchSongs()
  }, [songs])

  return (
    <div className='flex flex-col'>
      <div className='flex sm:justify-start'>
        <span className='text-7xl font-extrabold text-slate-100'>
          Songifind
        </span>
      </div>
        <Search />
    </div>
  )
}

export default App