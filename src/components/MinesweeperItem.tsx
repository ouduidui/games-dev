import classnames from 'classnames'
import { CLICK_BUTTON } from '~/constants'
import type { MinesweeperItemState } from '~/types/minesweeper'
import { MINESWEEPER_ITEM_TYPE } from '~/constants/minesweeper'
import { useStores } from '~/stores'

interface Props {
  item: MinesweeperItemState
  isInProgress: boolean
}

export default memo((props: Props) => {
  const { minesweeperStore } = useStores()
  const { handleClick } = minesweeperStore

  const { isInProgress, item } = props

  const handleOnClick = (e: React.MouseEvent, leftOrRight: CLICK_BUTTON) => {
    if (!isInProgress)
      return

    if (leftOrRight === CLICK_BUTTON.RIGHT)
      e.preventDefault()

    handleClick(item.row, item.col, leftOrRight)
  }

  const renderItemContainer = (children: JSX.Element) => {
    const { type, value } = item
    const hoverEnabled = isInProgress
    && type !== MINESWEEPER_ITEM_TYPE.MINE
    && !(type === MINESWEEPER_ITEM_TYPE.NUMBER && value === 0)
    return (
      <div
        className={classnames('p-1', 'select-none', 'cursor-pointer', {
          'bg-gray-300 dark:bg-gray-500': isInProgress && type === MINESWEEPER_ITEM_TYPE.INITIAL,
          'hover:bg-gray-400 dark:hover:bg-gray-400': hoverEnabled,
        })}
        onClick={e => handleOnClick(e, CLICK_BUTTON.LEFT)}
        onContextMenu={e => handleOnClick(e, CLICK_BUTTON.RIGHT)}
      >
        {children}
      </div>
    )
  }

  const renderItem = () => {
    const { type, value } = item
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
        value !== 0 && (children = <>{value}</>)
        cls = 'font-mono leading-5 op-70'
    }

    return renderItemContainer(<div className={classnames(commonCls, cls)}>{children}</div>)
  }

  return renderItem()
},
(prevProps, nextProps) => {
  if (prevProps.isInProgress !== nextProps.isInProgress)
    return false
  if (prevProps.item.type !== nextProps.item.type)
    return false
  return true
},
)
