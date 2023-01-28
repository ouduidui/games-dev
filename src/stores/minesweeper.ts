import { log } from './../utils/logger'
import { minesweeperTimer } from './timer'
import type { CLICK_BUTTON } from '~/constants'
import { MINESWEEPER_GAME_STATUS, MINESWEEPER_ITEM_TYPE } from '~/constants/minesweeper'
import { MinesweeperController } from '~/controllers/minesweeper'
import type { MinesweeperItemState } from '~/types/minesweeper'
import { PERSIST_NAME, STORAGE } from '~/constants/stores'

class MinesweeperStore {
  _minesweeper: MinesweeperItemState[][] = []
  info = { row: 0, col: 0, mines: 0 }
  status: MINESWEEPER_GAME_STATUS = MINESWEEPER_GAME_STATUS.NOT_START

  private _minesweeperController: MinesweeperController

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    makePersistable(this, {
      name: PERSIST_NAME.MINESWEEPER,
      properties: ['info', '_minesweeper'],
      storage: STORAGE,
    })
    this._minesweeperController = new MinesweeperController({
      row: this.info.row,
      col: this.info.col,
      mines: this.info.mines,
      minesweeper: this._minesweeper,
    })
  }

  get minesweeper() {
    return this._minesweeper
  }

  set minesweeper(newMinesweeper: MinesweeperItemState[][]) {
    this._checkStatus(newMinesweeper)
    log('store _checkStatus', { status: this.status })
    if (this.status === MINESWEEPER_GAME_STATUS.LOSE)
      this._minesweeper = this._minesweeperController.openAllItems()
    else
      this._minesweeper = newMinesweeper
  }

  get remainFlagCount() {
    const mines = this.info.mines

    const flags = this.minesweeper.reduce((cnt, row) => {
      return cnt + row.reduce((rowCnt, item) => {
        if (item.type === MINESWEEPER_ITEM_TYPE.FLAG)
          rowCnt += 1
        return rowCnt
      }, 0)
    }, 0)
    return mines - flags
  }

  startGame(row: number, col: number, mines: number) {
    this.info = { row, col, mines }
    this.status = MINESWEEPER_GAME_STATUS.NOT_START
    minesweeperTimer.resetTimer()
    log('store startGame', { row, col, mines, status: this.status })
    this.minesweeper = this._minesweeperController.init(row, col, mines)
  }

  stopGame() {
    if (this.status !== MINESWEEPER_GAME_STATUS.INPROGRESS)
      return

    this.status = MINESWEEPER_GAME_STATUS.STOP
    minesweeperTimer.stopTimer()
    log('store stopGame', { status: this.status })
  }

  continueGame() {
    if (this.status !== MINESWEEPER_GAME_STATUS.STOP)
      return

    this.status = MINESWEEPER_GAME_STATUS.INPROGRESS
    minesweeperTimer.continueTimer()
    log('store continueGame', { status: this.status })
  }

  handleClick(x: number, y: number, leftOrRight: CLICK_BUTTON) {
    log('store handleClick', { x, y, leftOrRight, status: this.status })

    if (this.status === MINESWEEPER_GAME_STATUS.NOT_START) {
      this.status = MINESWEEPER_GAME_STATUS.INPROGRESS
      this.minesweeper = this._minesweeperController.genMinesweeper(x, y)
      minesweeperTimer.startTimer()
    }
    else if (this.status === MINESWEEPER_GAME_STATUS.INPROGRESS) {
      this.minesweeper = this._minesweeperController.handleBlockClick(x, y, leftOrRight)
    }
  }

  private _checkStatus(minesweeper: MinesweeperItemState[][]) {
    if (minesweeper.length) {
      let numCnt = 0
      for (const row of minesweeper) {
        for (const item of row) {
          if (item.type === MINESWEEPER_ITEM_TYPE.MINE) {
            this.status = MINESWEEPER_GAME_STATUS.LOSE
            return
          }
          if (item.type === MINESWEEPER_ITEM_TYPE.NUMBER)
            numCnt += 1
        }
      }
      if (numCnt === this.info.row * this.info.col - this.info.mines)
        this.status = MINESWEEPER_GAME_STATUS.WIN
    }
    else {
      this.status = MINESWEEPER_GAME_STATUS.NOT_START
    }
  }
}

export default new MinesweeperStore()
