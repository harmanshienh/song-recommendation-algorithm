import { RootState } from './redux/store.ts'
import './App.css'
import Search from './components/Search';
import SongChoices from './components/SongChoices';
import { store } from './redux/store.ts'
import { Provider, useSelector } from 'react-redux';
import { Song } from './redux/types.ts';
import { useState } from 'react';
import Recommendation from './components/Recommendation.tsx';

const AppContent: React.FC = () => {
  const songs = useSelector((state: RootState) => state.songs);
  const [recommendations, setRecommendations] = useState<Song[]>([]);

  const handleSubmit = async () => {
    const submissions = songs.songs.map((song: Song) => (
      { 'name': song.name, 'year': song.year }
    ))
    const res = await fetch('http://localhost:4000/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissions)
    });
    const data = await res.json();
    setRecommendations(data);
  }

  return (
    <div className='flex flex-col'>
      <div className='flex sm:justify-start'>
        <span className='text-7xl font-extrabold text-slate-100'>
          Songifind
        </span>
      </div>
      <div className='flex w-full gap-4'>
        <div className='flex-1'>
          <Search />
        </div>
        {songs.songs.length > 0 &&
          <div className='flex flex-col flex-1'>
            <SongChoices />
            <button onClick={handleSubmit}
              className='group bg-green-500 border-2 border-green-500 
            rounded-full w-fit mt-5 mx-auto hover:bg-slate-100 transition-colors'>
              <span className='m-auto text-zinc-900 text-2xl font-semibold p-8 
              group-hover:text-green-500 transition-colors'>
                Submit
              </span>
            </button>
          </div>
        }
      </div>
      {recommendations.length > 0 &&
        <div className='mt-20 flex flex-col'>
          <span className='text-slate-200 text-6xl font-bold transition-opacity p-5'>
            Here are some songs you might like:
          </span>
          {recommendations.map((recommendation) => (
            <Recommendation recommendation={recommendation} />
          ))}
        </div>
      }
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App