import classnames from 'classnames'
import type { MinesweeperItemRef } from '~/components/MinesweeperItem'
import MinesweeperItem from '~/components/MinesweeperItem'
import { MinesweeperController } from '~/controllers/minesweeper'
import type { MinesweeperItemState } from '~/types/minesweeper'
import { MINESWEEPER_GAME_STATUS } from '~/constants/minesweeper'
import type { TimerRef } from '~/components/Timer'
import Timer from '~/components/Timer'
export const minesweeperControllerPC = new MinesweeperController()

const row = 16
const col = 30
const mines = 99
const minesweeperBox = minesweeperControllerPC.init(row, col, mines)

export default () => {
  const [remainMines, setRemainMines] = useState(mines)
  const [isInProgress, setIsInProgress] = useState(true)
  const itemRefs = useRef<Record<`${number}-${number}`, MinesweeperItemRef | null>>({})
  const timerRef = useRef<TimerRef>(null)

  const handleFirstClick = (newBlock: MinesweeperItemState) => {
    const result = minesweeperControllerPC.generateMinesweeper({ x: newBlock.row, y: newBlock.col })
    result.minisweeper.forEach((row, i) => {
      row.forEach((item, j) => {
        itemRefs.current[`${i}-${j}`]?.updateItem({ ...item })
      })
    })
    return {
      ...result,
      needExpend: false,
    }
  }

  const updateMinesweeperBox = (newBlock: MinesweeperItemState) => {
    const { needExpend, expendItems, remainMines: newRemainMines, status }
      = minesweeperControllerPC.gameStatus === MINESWEEPER_GAME_STATUS.NOT_START
        ? handleFirstClick(newBlock)
        : minesweeperControllerPC.check(newBlock)

    if (status === MINESWEEPER_GAME_STATUS.WIN) {
      alert('win')
    }
    else if (status === MINESWEEPER_GAME_STATUS.LOSE) {
      alert('game over')
    }
    else {
      if (needExpend) {
        expendItems.forEach((item) => {
          itemRefs.current[`${item.row}-${item.col}`]?.updateItem(item)
        })
      }
      if (newRemainMines !== remainMines)
        setRemainMines(newRemainMines)
    }
  }

  const renderMinesweeperBox = () => (
    <div className="b-1">
      {minesweeperBox.map((row, i) => (
        <div key={`row_${i}`} className="flex">
          {row.map((_, j) => (
            <div key={`col${j}`} className="b-1">
              <MinesweeperItem
                ref={comp => itemRefs.current[`${i}-${j}`] = comp}
                row={i}
                col={j}
                isInProgress={isInProgress}
                update={updateMinesweeperBox}
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
      <div className={classnames(btnCls, 'i-mdi-restart mr-5')} />
      <div className={classnames(btnCls, {
        'i-mdi-pause': isInProgress,
        'i-mdi-play': !isInProgress,
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
}
