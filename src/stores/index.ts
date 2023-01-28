import minesweeperStore from './minesweeper'
import settingStore from './setting'
import { minesweeperTimer } from './timer'

configure({ enforceActions: 'always' })

export const useStores = () => useContext(createContext({
  minesweeperStore,
  minesweeperTimer,
  settingStore,
}))
