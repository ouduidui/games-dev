import type { MINESWEEPER_ITEM_TYPE } from '~/constants/minesweeper'

export type MinesweeperItemNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface MinesweeperItemState {
  type: MINESWEEPER_ITEM_TYPE
  value: MinesweeperItemNumber
  row: number
  col: number
  isMines: boolean
}
