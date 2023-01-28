import classnames from 'classnames'
import MinesweeperItem from '~/components/MinesweeperItem'
import type { TimerRef } from '~/components/Timer'
import Timer from '~/components/Timer'
import { MINESWEEPER_GAME_STATUS } from '~/constants/minesweeper'
import { useStores } from '~/stores'

const row = 16
const col = 30
const mines = 99

export default observer(() => {
  const { minesweeperStore } = useStores()
  const { minesweeper, init, remainMines, status } = minesweeperStore

  const handleStart = () => {
    init(row, col, mines)
  }

  const timerRef = useRef<TimerRef>(null)

  const renderMinesweeperBox = () => (
    <div className="b-1">
      {minesweeper.map((row, i) => (
        <div key={`row_${i}`} className="flex">
          {row.map((item, j) => (
            <div key={`col${j}`} className="b-1">
              <MinesweeperItem
                item={item}
                isInProgress={status !== MINESWEEPER_GAME_STATUS.PAUSE}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  const renderHeader = () => (
    <div className='font-200 pb-1'>
      <div className='text-xl mb-2'>MINESWEEPERS</div>
      <div className='flex justify-between'>
        <div className='flex-inline items-center'>
          <div className='i-mdi-timer text'/>: <Timer ref={timerRef} />
        </div>
        <div className='flex-inline items-center'>
          <div className='i-mdi-mine text'/>: {remainMines}
        </div>
      </div>
    </div>
  )

  const renderButtons = () => {
    const btnCls = 'text-2xl cursor-pointer op-70 hover:op-100'
    return (
    <div className='flex mt-8 justify-center'>
      <div onClick={handleStart} className={classnames(btnCls, 'i-mdi-restart mr-5')} />
      <div className={classnames(btnCls, {
        'i-mdi-pause': status !== MINESWEEPER_GAME_STATUS.PAUSE,
        'i-mdi-play': status === MINESWEEPER_GAME_STATUS.PAUSE,
      })} />
    </div>
    )
  }

  return (
    <div className='mt-10'>
      {renderHeader()}
      {renderMinesweeperBox()}
      {renderButtons()}
    </div>
  )
})
