import { t } from '~/i18n'

export const GAMES_CMD = [
  { label: t('minesweeper'), iconCls: 'i-arcticons-antimine' },
  { label: t('sudoku'), iconCls: 'i-arcticons-sudokuoss' },
]

export enum KEY_CODE {
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  ENTER = 'Enter',
}
