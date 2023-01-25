import classnames from 'classnames'
import type { MINESWEEPER_ITEM_NUMBER } from '~/types/minesweeper'
import { MINESWEEPER_ITEM_TYPE } from '~/types/minesweeper'

interface Props {
  row: number
  col: number
}

type RenderItemFnOption = {
  type: MINESWEEPER_ITEM_TYPE.NUMBER
  num: MINESWEEPER_ITEM_NUMBER
} | {
  type: MINESWEEPER_ITEM_TYPE.FLAG | MINESWEEPER_ITEM_TYPE.MINE | MINESWEEPER_ITEM_TYPE.INITIAL
}

export default (props: Props) => {
  const { row, col } = props

  const renderItemContainer = (children: JSX.Element, isZero = false) => {
    return (
      <div className={classnames('p-1', 'select-none', 'cursor-pointer', {
        'bg-gray-300 dark:bg-gray-500': isZero,
      })}>
        {children}
      </div>
    )
  }

  const renderItem = (ops: RenderItemFnOption) => {
    switch (ops.type) {
      case MINESWEEPER_ITEM_TYPE.FLAG:
        return renderItemContainer(<div className='text w-1.25rem h-1.25rem i-mdi-flag color-emerald' />)
      case MINESWEEPER_ITEM_TYPE.MINE:
        return renderItemContainer(<div className='text w-1.25rem h-1.25rem i-mdi-mine color-rose' />)
      case MINESWEEPER_ITEM_TYPE.INITIAL:
        return renderItemContainer(<div className='text w-1.25rem h-1.25rem' />)
      case MINESWEEPER_ITEM_TYPE.NUMBER:
        return renderItemContainer(
          <div className='text font-mono w-1.25rem h-1.25rem leading-5 op-70'>{ops.num !== 0 && ops.num}</div>,
          ops.num === 0,
        )
    }
  }

  if (row === 0)
    return renderItem({ type: MINESWEEPER_ITEM_TYPE.INITIAL })
  else if (row === 1)
    return renderItem({ type: MINESWEEPER_ITEM_TYPE.FLAG })
  else if (row === 2)
    return renderItem({ type: MINESWEEPER_ITEM_TYPE.MINE })
  else
    return renderItem({ type: MINESWEEPER_ITEM_TYPE.NUMBER, num: ((col / 4) >> 0) as MINESWEEPER_ITEM_NUMBER })
}
