import { IS_DEV } from '.'

export const IS_MINESWEEPER_DEV = IS_DEV && true

export enum MINESWEEPER_ITEM_TYPE {
  INITIAL,
  FLAG,
  MINE,
  NUMBER,
}

export enum MINESWEEPER_GAME_STATUS {
  NOT_START,
  INPROGRESS,
  WIN,
  LOSE,
  PAUSE,
}
