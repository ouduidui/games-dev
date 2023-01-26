import type { MINESWEEPER_ITEM_TYPE } from '~/constants/minesweeper'

export type MINESWEEPER_ITEM_NUMBER = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface MinesweeperItemState {
  type: MINESWEEPER_ITEM_TYPE
  value: MINESWEEPER_ITEM_NUMBER
  row: number
  col: number
  isMines: boolean
}
