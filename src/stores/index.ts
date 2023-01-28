import minesweeperStore from './minesweeper'
import { minesweeperTimer } from './timer'

configure({ enforceActions: 'always' })

export const useStores = () => useContext(createContext({
  minesweeperStore,
  minesweeperTimer,
}))
