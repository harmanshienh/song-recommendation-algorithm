'use client'
import { RootState } from '../redux/store'
import './globals.css'
import Search from '../components/Search';
import SongChoices from '../components/SongChoices';
import { store } from '../redux/store'
import { Provider, useSelector } from 'react-redux';
import { Song } from '../redux/types';
import { useEffect, useState } from 'react';
import Recommendation from '../components/Recommendation';
import { ThreeDots } from 'react-loader-spinner'
import logo from '../public/logo.png';
import Image from 'next/image';

const AppContent: React.FC = () => {
  const songs = useSelector((state: RootState) => state.songs);
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const submissions = songs.songs.map((song: Song) => (
      { 'name': song.name, 'year': song.year }
    ))
    console.log(submissions);
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissions)
    });
    const data = await res.json();
    setRecommendations(data);
    setLoading(false);
  }

  useEffect(() => {
    if (songs.songs.length === 0) {
      setRecommendations([]);
    }
    setLoading(false);
  }, [songs.songs.length])

  return (
    <div className='flex flex-col'>
      <div className='flex sm:justify-start'>
        <Image 
          src={logo}
          height={0}
          width={0}
          alt='Songifind' 
          onClick={() => window.location.reload()} 
          unoptimized
          className='cursor-pointer h-16 w-auto max-sm:mx-auto'
        />
      </div>
      <div className='flex flex-col md:flex-row w-full justify-center items-start 
                      gap-4 min-h-[300px] px-2 sm:px-1 mx-auto transition-all 
                      duration-300 ease-in-out'>
        <div className={`transition-all duration-300 ease-in-out max-md:mx-auto
                      ${songs.songs.length === 0
            ? 'md:flex-grow md:flex md:justify-center'
            : 'flex-shrink-0'}`}>
          <Search />
        </div>
        <div className={`transition-all duration-300 ease-in-out max-md:mx-auto
                      ${songs.songs.length > 0 ? 'opacity-100 max-w-[500px]'
            : 'opacity-0 max-w-0 overflow-hidden'}`}>
          <SongChoices />
          {songs.songs.length > 0 && (
            <button onClick={handleSubmit}
              className={`group border-2 rounded-full w-fit mt-5 mx-auto block
                        hover:bg-slate-100 transition-all duration-300 
                        ${loading 
                        ? 'cursor-default opacity-70 bg-slate-100 border-slate-100' 
                        : 'bg-green-500 border-green-500' 
                        }`}>
              {!loading ?
                <span className='m-auto text-zinc-900 text-2xl font-semibold p-8 
                group-hover:text-green-500 transition-colors'>
                  Submit
                </span>
                :
                <div className='relative'>
                  <span className='text-slate-100 text-opacity-70 text-2xl 
                                  font-semibold p-8'>
                    Submit
                  </span>
                  <div className='absolute top-1/2 left-1/2 -translate-x-1/2 
                                  -translate-y-1/2'>
                    <ThreeDots
                      visible={true}
                      height="40"
                      width="40"
                      color="#22c55e"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                </div>
              }
            </button>
          )}
        </div>
      </div>
      {recommendations.length > 0 && songs.songs.length > 0 && (
        <div className='mt-20 flex flex-col'>
          <span className='text-slate-200 text-3xl md:text-6xl font-bold 
                            transition-opacity pb-3 md:p-5 mx-auto text-center'>
            Here are some songs you might like:
          </span>
          {recommendations.map((recommendation) => (
            <Recommendation key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App