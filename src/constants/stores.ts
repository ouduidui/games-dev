import type { StorageController } from 'mobx-persist-store'

export enum PERSIST_NAME {
  MINESWEEPER = 'MINESWEEPER',
  MINESWEEPER_TIMER = 'MINESWEEPER_TIMER',
  SETTING = 'SETTING',
}

export const STORAGE: StorageController = window.localStorage
