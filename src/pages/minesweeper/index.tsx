import classnames from 'classnames'
import MinesweeperItem from '~/components/MinesweeperItem'
import { MINESWEEPER_GAME_STATUS } from '~/constants/minesweeper'
import { useStores } from '~/stores'

const row = 16
const col = 30
const mines = 99

export default observer(() => {
  const { minesweeperStore, minesweeperTimer } = useStores()
  const { minesweeper, startGame, stopGame, continueGame, remainFlagCount, status } = minesweeperStore
  const { duration } = minesweeperTimer

  const handleStart = () => {
    startGame(row, col, mines)
  }

  const handleProgress = () => {
    if (status === MINESWEEPER_GAME_STATUS.STOP)
      continueGame()
    else if (status === MINESWEEPER_GAME_STATUS.INPROGRESS)
      stopGame()
  }

  const renderMinesweeperBox = () => (
    <div className="b-1">
      {minesweeper.map((row, i) => (
        <div key={`row_${i}`} className="flex">
          {row.map((item, j) => (
            <div key={`col${j}`} className="b-1">
              <MinesweeperItem
                item={item}
                isInProgress={status !== MINESWEEPER_GAME_STATUS.STOP}
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
          <div className='i-mdi-timer text'/>: {duration}
        </div>
        <div className='flex-inline items-center'>
          <div className='i-mdi-mine text'/>: {remainFlagCount}
        </div>
      </div>
    </div>
  )

  const renderButtons = () => {
    const btnCls = 'text-2xl cursor-pointer op-70 hover:op-100'
    return (
    <div className='flex mt-8 justify-center'>
      <div onClick={handleStart} className={classnames(btnCls, 'i-mdi-restart mx-3')} />
      <div onClick={handleProgress} className={classnames(btnCls, {
        'i-mdi-pause': status === MINESWEEPER_GAME_STATUS.INPROGRESS,
        'i-mdi-play': status === MINESWEEPER_GAME_STATUS.STOP,
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
