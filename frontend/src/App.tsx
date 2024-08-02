import { RootState } from './redux/store.ts'
import './App.css'
import Search from './components/Search';
import SongChoices from './components/SongChoices';
import { store } from './redux/store.ts'
import { Provider, useSelector } from 'react-redux';

const AppContent: React.FC = () => {
  const songs = useSelector((state: RootState) => state.songs);
  console.log(songs)
  return (
    <Provider store={store}>
      <div className='flex flex-col'>
        <div className='flex sm:justify-start'>
          <span className='text-7xl font-extrabold text-slate-100'>
            Songifind
          </span>
        </div>
        <div className='flex w-full'>
          <Search />
          {songs.length > 0 &&
            <SongChoices />
          }
        </div>
      </div>
    </Provider>
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