import type { MinesweeperItemRef } from '~/components/MinesweeperItem'
import MinesweeperItem from '~/components/MinesweeperItem'
import { MinesweeperController } from '~/controllers/minesweeper'
import type { MinesweeperItemState } from '~/types/minesweeper'
import { MINESWEEPER_GAME_STATUS } from '~/constants/minesweeper'
export const minesweeperControllerPC = new MinesweeperController()

const row = 16
const col = 30
const mines = 99
const minesweeperBox = minesweeperControllerPC.init(row, col, mines)

export default () => {
  const [remainMines, setRemainMines] = useState(mines)

  const itemRefs = useRef<Record<`${number}-${number}`, MinesweeperItemRef | null>>({})
  const updateMinesweeperBox = (newBlock: MinesweeperItemState) => {
    const { needExpend, expendItems, remainMines: newRemainMines, status } = minesweeperControllerPC.check(newBlock)
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

  return (
    <div>
      <div>
        <span>炸弹：{remainMines}</span>
        <span>时间：</span>
      </div>
      <div className="b-1">
      {minesweeperBox.map((row, i) => (
        <div key={`row_${i}`} className="flex">
          {row.map((_, j) => (
            <div key={`col${j}`} className="b-1">
              <MinesweeperItem
                ref={comp => itemRefs.current[`${i}-${j}`] = comp}
                row={i}
                col={j}
                update={updateMinesweeperBox}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
    </div>
  )
}
