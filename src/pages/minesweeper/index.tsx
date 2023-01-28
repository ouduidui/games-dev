import {
  Minesweeper,
  MinesweeperOptions,
} from '~/components/minesweeper'
import { MINESWEEPER_GAME_STATUS } from '~/constants/minesweeper'
import { useStores } from '~/stores'
import { loseAnimation, winAnimation } from '~/utils/confetti'

export default observer(() => {
  const { minesweeperStore } = useStores()
  const { status, stopGame } = minesweeperStore

  useEffectOnce(() => {
    return () => stopGame()
  })

  useEffect(() => {
    if (status === MINESWEEPER_GAME_STATUS.WIN)
      winAnimation(3000)
    else if (status === MINESWEEPER_GAME_STATUS.LOSE)
      loseAnimation(3000)
  }, [status])

  return (
    <div className='mt-10 select-none'>
      <div className='text-2xl font-200 mb-10'>MINESWEEPER</div>
      {
      status === MINESWEEPER_GAME_STATUS.WAIT_CHOICE
        ? <MinesweeperOptions />
        : <Minesweeper />
        }
    </div>
  )
})
