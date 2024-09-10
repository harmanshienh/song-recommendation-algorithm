import { RootState } from '../redux/store'
import { useSelector } from 'react-redux'
import SearchSelection from './SearchSelection'
import { Song } from '../redux/types'

export default function SongChoices() {
    const songs = useSelector((state: RootState) => state.songs)
  return (
    <div className='mt-20 w-full'>
        {songs.songs.map((song: Song, index: number) => (
            <SearchSelection key={index} song={song} />
        ))}
    </div>
  )
}
