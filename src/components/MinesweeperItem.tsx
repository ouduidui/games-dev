import classnames from 'classnames'
import { CLICK_BUTTON } from '~/constants'
import { minesweeperControllerPC } from '~/pages/minesweeper'
import type { MINESWEEPER_ITEM_NUMBER, MinesweeperItemState } from '~/types/minesweeper'
import { IS_MINESWEEPER_DEV, MINESWEEPER_ITEM_TYPE } from '~/constants/minesweeper'

interface Props {
  row: number
  col: number
  update: (newBlock: MinesweeperItemState) => void
  isInProgress: boolean
}

export interface MinesweeperItemRef {
  updateItem: (newBlock: MinesweeperItemState) => void
}

type RenderItemFnOption = {
  type: MINESWEEPER_ITEM_TYPE.NUMBER
  num: MINESWEEPER_ITEM_NUMBER
} | {
  type: MINESWEEPER_ITEM_TYPE.FLAG | MINESWEEPER_ITEM_TYPE.MINE | MINESWEEPER_ITEM_TYPE.INITIAL
}

export default memo(forwardRef<MinesweeperItemRef, Props>((props, ref) => {
  const { row, col, isInProgress, update: updateCallback } = props
  const [itemState, setItemState] = useState(
    minesweeperControllerPC.getMinisweeperItem(row, col),
  )

  const updateItem = (newBlock: MinesweeperItemState) => setItemState(newBlock)

  useImperativeHandle(ref, () => {
    return {
      updateItem,
    }
  })

  const handleOnClick = (e: React.MouseEvent, leftOrRight: CLICK_BUTTON) => {
    if (!isInProgress)
      return

    if (leftOrRight === CLICK_BUTTON.RIGHT)
      e.preventDefault()

    const newBlock = minesweeperControllerPC.handleBlockClick(itemState, leftOrRight)
    if (newBlock) {
      updateItem(newBlock)
      updateCallback({ ...newBlock })
    }
  }

  const renderItemContainer = (children: JSX.Element, type: MINESWEEPER_ITEM_TYPE) => {
    return (
      <div
        className={classnames('p-1', 'select-none', 'cursor-pointer', {
          'bg-gray-300 dark:bg-gray-500': isInProgress && type === MINESWEEPER_ITEM_TYPE.INITIAL,
          'hover:bg-gray-400 dark:hover:bg-gray-400': isInProgress && type !== MINESWEEPER_ITEM_TYPE.MINE,
        })}
        onClick={e => handleOnClick(e, CLICK_BUTTON.LEFT)}
        onContextMenu={e => handleOnClick(e, CLICK_BUTTON.RIGHT)}
      >
        {children}
      </div>
    )
  }

  const renderItem = (ops: RenderItemFnOption) => {
    const { type } = ops
    const commonCls = classnames('text w-1.25rem h-1.25rem', {
      'op-0': !isInProgress,
    })
    let cls = ''
    let children: JSX.Element | null = null
    switch (type) {
      case MINESWEEPER_ITEM_TYPE.FLAG:
        cls = 'i-mdi-flag color-emerald'
        break
      case MINESWEEPER_ITEM_TYPE.MINE:
        cls = 'i-mdi-mine color-rose'
        break
      case MINESWEEPER_ITEM_TYPE.INITIAL:
        break
      case MINESWEEPER_ITEM_TYPE.NUMBER:
        ops.num !== 0 && (children = <>{ops.num}</>)
        cls = 'font-mono leading-5 op-70'
    }

    return renderItemContainer(<div className={classnames(commonCls, cls)}>{children}</div>, type)
  }

  if (IS_MINESWEEPER_DEV)
    return renderItem({ type: itemState.isMines ? MINESWEEPER_ITEM_TYPE.MINE : MINESWEEPER_ITEM_TYPE.NUMBER, num: itemState.value })

  return renderItem({ type: itemState.type, num: itemState.value })
}))
