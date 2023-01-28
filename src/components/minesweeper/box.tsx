import MinesweeperItem from './item'
import { MINESWEEPER_GAME_STATUS } from '~/constants/minesweeper'
import { useStores } from '~/stores'

export default observer(() => {
  const { minesweeperStore, minesweeperTimer } = useStores()
  const { minesweeper, restartGame, stopGame, continueGame, remainFlagCount, status } = minesweeperStore
  const { duration } = minesweeperTimer

  const handleRestart = () => {
    restartGame()
  }

  const handleProgress = () => {
    if (status === MINESWEEPER_GAME_STATUS.STOP)
      continueGame()
    else if (status === MINESWEEPER_GAME_STATUS.INPROGRESS)
      stopGame()
  }

  const renderResult = () => {
    if (status === MINESWEEPER_GAME_STATUS.LOSE || status === MINESWEEPER_GAME_STATUS.WIN) {
      return (
        <div className='absolute inset-0 bg-dark/90 z-1'>
          <div className='text-2xl font-200 flex justify-center items-center h-full leading-none'>
            {
              status === MINESWEEPER_GAME_STATUS.WIN ? 'You Win!' : 'You Lose!'
            }
          </div>
        </div>
      )
    }
    return null
  }

  const renderMinesweeperBox = () => (
    <div className="b-1 relative">
      {renderResult()}
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
      <div onClick={handleRestart} className={classnames(btnCls, 'i-mdi-restart mx-3')} />
      <div onClick={handleProgress} className={classnames(btnCls, {
        'i-mdi-pause': status === MINESWEEPER_GAME_STATUS.INPROGRESS,
        'i-mdi-play': status === MINESWEEPER_GAME_STATUS.STOP,
      })} />
    </div>
    )
  }

  return (
    <div>
      {renderHeader()}
      {renderMinesweeperBox()}
      {renderButtons()}
    </div>
  )
})
