import type { StorageController } from 'mobx-persist-store'

export enum PERSIST_NAME {
  MINESWEEPER = 'MINESWEEPER',
  MINESWEEPER_TIMER = 'MINESWEEPER_TIMER',
}

export const STORAGE: StorageController = window.localStorage
