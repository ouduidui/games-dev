import { log } from './../utils/logger'
import { minesweeperTimer } from './timer'
import {
  MINESWEEPER_DIFFICULTY,
  MINESWEEPER_DIFFICULTY_OPTIONS,
  MINESWEEPER_GAME_STATUS,
  MINESWEEPER_ITEM_TYPE,
} from '~/constants/minesweeper'
import type { CLICK_BUTTON } from '~/constants'
import { MinesweeperController } from '~/controllers/minesweeper'
import type { MinesweeperItemState } from '~/types/minesweeper'
import { PERSIST_NAME, STORAGE } from '~/constants/stores'

type MinesweeperRecords = Record<MINESWEEPER_DIFFICULTY, {
  record: number
  createTime: number
}[]>

class MinesweeperStore {
  _minesweeper: MinesweeperItemState[][] = []
  difficult: MINESWEEPER_DIFFICULTY | '' = ''
  status: MINESWEEPER_GAME_STATUS = MINESWEEPER_GAME_STATUS.WAIT_CHOICE
  records: MinesweeperRecords = {
    [MINESWEEPER_DIFFICULTY.EASY]: [],
    [MINESWEEPER_DIFFICULTY.NORMAL]: [],
    [MINESWEEPER_DIFFICULTY.HARD]: [],
  }

  private _minesweeperController: MinesweeperController | null = null

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    makePersistable(this, {
      name: PERSIST_NAME.MINESWEEPER,
      properties: ['status', 'difficult', '_minesweeper', 'records'],
      storage: STORAGE,
    })
  }

  get minesweeperController() {
    if (!this._minesweeperController) {
      this._minesweeperController = new MinesweeperController({
        row: this.info.row,
        col: this.info.col,
        mines: this.info.mines,
        minesweeper: this._minesweeper,
      })
    }
    return this._minesweeperController
  }

  get info() {
    return this.difficult
      ? MINESWEEPER_DIFFICULTY_OPTIONS[this.difficult]
      : {
          row: 0,
          col: 0,
          mines: 0,
        }
  }

  get minesweeper() {
    return this._minesweeper
  }

  set minesweeper(newMinesweeper: MinesweeperItemState[][]) {
    this._checkStatus(newMinesweeper)
    log('store _checkStatus', { status: this.status })
    if (this.status === MINESWEEPER_GAME_STATUS.LOSE)
      this._minesweeper = this.minesweeperController.openAllItems()
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

  restartGame() {
    this.difficult = ''
    this.status = MINESWEEPER_GAME_STATUS.WAIT_CHOICE
    this.minesweeper = []
    minesweeperTimer.resetTimer()
  }

  startGame(different: MINESWEEPER_DIFFICULTY) {
    this.difficult = different
    const { row, col, mines } = this.info
    this.status = MINESWEEPER_GAME_STATUS.NOT_START
    minesweeperTimer.resetTimer()
    log('store startGame', { row, col, mines, status: this.status })
    this.minesweeper = this.minesweeperController.init(row, col, mines)
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
      this.minesweeper = this.minesweeperController.genMinesweeper(x, y)
      minesweeperTimer.startTimer()
      return
    }

    if (this.status === MINESWEEPER_GAME_STATUS.INPROGRESS)
      this.minesweeper = this.minesweeperController.handleBlockClick(x, y, leftOrRight)
  }

  private _checkStatus(minesweeper: MinesweeperItemState[][]) {
    if (minesweeper.length) {
      let numCnt = 0
      for (const row of minesweeper) {
        for (const item of row) {
          if (item.type === MINESWEEPER_ITEM_TYPE.MINE) {
            this.handleLose()
            return
          }
          if (item.type === MINESWEEPER_ITEM_TYPE.NUMBER)
            numCnt += 1
        }
      }
      if (numCnt === this.info.row * this.info.col - this.info.mines)
        this._handleWin()
    }
  }

  private _handleWin() {
    minesweeperTimer.stopTimer()
    this.status = MINESWEEPER_GAME_STATUS.WIN
  }

  private handleLose() {
    minesweeperTimer.stopTimer()
    this.status = MINESWEEPER_GAME_STATUS.LOSE
  }
}

export default new MinesweeperStore()
