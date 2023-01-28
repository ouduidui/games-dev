import minesweeperStore from './minesweeper'

configure({ enforceActions: 'always' })

export const useStores = () => useContext(createContext({
  minesweeperStore,
}))
