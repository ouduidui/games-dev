import type { MinesweeperItemRef } from '~/components/MinesweeperItem'
import MinesweeperItem from '~/components/MinesweeperItem'
import { MinesweeperController } from '~/controllers/minesweeper'
import type { MinesweeperItemState } from '~/types/minesweeper'
export const minesweeperControllerPC = new MinesweeperController()

export default () => {
  const row = 16
  const col = 30
  const mines = 99
  const minesweeperBox = minesweeperControllerPC.init(row, col, mines)

  const itemRefs = useRef<Record<`${number}-${number}`, MinesweeperItemRef | null>>({})
  const updateMinesweeperBox = (newBlock: MinesweeperItemState) => {
    const res = minesweeperControllerPC.check(newBlock)
    if (res.needExpend) {
      res.expendItems.forEach((item) => {
        itemRefs.current[`${item.row}-${item.col}`]?.updateItem(item)
      })
    }
  }

  return (
    <div className="b-1">
      {minesweeperBox.map((row, i) => (
        <div key={`row_${i}`} className="flex">
          {row.map((item, j) => (
            <div key={`col${j}`} className="b-1">
              <MinesweeperItem
                ref={comp => itemRefs.current[`${i}-${j}`] = comp}
                item={item}
                update={updateMinesweeperBox}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
