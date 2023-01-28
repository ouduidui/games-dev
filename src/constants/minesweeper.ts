import { t } from '~/i18n'

export enum MINESWEEPER_ITEM_TYPE {
  INITIAL = 'INITIAL',
  FLAG = 'FLAG',
  MINE = 'MINE',
  NUMBER = 'NUMBER',
}

export enum MINESWEEPER_GAME_STATUS {
  WAIT_CHOICE = 'WAIT_CHOICE',
  NOT_START = 'NOT_START',
  STOP = 'STOP',
  INPROGRESS = 'INPROGRESS',
  WIN = 'WIN',
  LOSE = 'LOSE',
}

export enum MINESWEEPER_DIFFICULTY {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
}

export const MINESWEEPER_DIFFICULTY_LABEL: Record<MINESWEEPER_DIFFICULTY, string> = {
  [MINESWEEPER_DIFFICULTY.EASY]: t('minesweeper_difficult_easy'),
  [MINESWEEPER_DIFFICULTY.NORMAL]: t('minesweeper_difficult_normal'),
  [MINESWEEPER_DIFFICULTY.HARD]: t('minesweeper_difficult_hard'),
} as const

export const MINESWEEPER_DIFFICULTY_OPTIONS = {
  [MINESWEEPER_DIFFICULTY.EASY]: {
    row: 9,
    col: 9,
    mines: 10,
  },
  [MINESWEEPER_DIFFICULTY.NORMAL]: {
    row: 16,
    col: 16,
    mines: 40,
  },
  [MINESWEEPER_DIFFICULTY.HARD]: {
    row: 16,
    col: 30,
    mines: 99,
  },
} as const
