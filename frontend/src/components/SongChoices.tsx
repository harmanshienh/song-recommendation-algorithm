import { RootState } from '../redux/store.ts'
import { useSelector } from 'react-redux'
import SearchSelection from './SearchSelection.tsx'
import { Song } from '../redux/types.ts'

export default function SongChoices() {
    const songs = useSelector((state: RootState) => state.songs)
  return (
    <div>
    </div>
  )
}
