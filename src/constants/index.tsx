import { t } from '~/i18n'

export const IS_DEV = process.env.NODE_ENV === 'development'

export const GAMES_CMD = [
  { id: 'minesweeper', label: t('minesweeper'), iconCls: 'i-arcticons-antimine' },
  { id: 'sudoku', label: t('sudoku'), iconCls: 'i-arcticons-sudokuoss' },
  { id: 'setting', label: t('setting'), iconCls: 'i-arcticons-lawnchairsettings' },
]

export enum KEY_CODE {
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  ENTER = 'Enter',
}

export enum CLICK_BUTTON {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}
