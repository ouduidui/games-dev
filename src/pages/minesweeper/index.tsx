import {
  Minesweeper,
  MinesweeperOptions,
} from '~/components/minesweeper'
import { MINESWEEPER_GAME_STATUS } from '~/constants/minesweeper'
import { useStores } from '~/stores'

export default observer(() => {
  const { minesweeperStore } = useStores()
  const { status, stopGame } = minesweeperStore

  useEffectOnce(() => {
    return () => stopGame()
  })

  return (
    <div className='mt-10'>
      <div className='text-2xl font-200 mb-10'>MINESWEEPER</div>
      {
      status === MINESWEEPER_GAME_STATUS.WAIT_CHOICE
        ? <MinesweeperOptions />
        : <Minesweeper />
        }
    </div>
  )
})
