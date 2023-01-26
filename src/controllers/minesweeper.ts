import { CLICK_BUTTON } from '~/constants'
import type { MINESWEEPER_ITEM_NUMBER, MinesweeperItemState } from '~/types/minesweeper'
import { MINESWEEPER_GAME_STATUS, MINESWEEPER_ITEM_TYPE } from '~/constants/minesweeper'

const DEFAULT_ITEM_STATE: MinesweeperItemState = {
  row: 0,
  col: 0,
  type: MINESWEEPER_ITEM_TYPE.INITIAL,
  isMines: false,
  value: 0,
}

const DIR = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

interface CheckResultType {
  status: MINESWEEPER_GAME_STATUS
  remainMines: number
  needExpend: boolean
  expendItems: MinesweeperItemState[]
}

export class MinesweeperController {
  private _row = 0
  private _col = 0
  private _mines = 0
  private _remainMines = 0
  private _minisweeper: MinesweeperItemState[][] = []
  private _gameStatus: MINESWEEPER_GAME_STATUS = MINESWEEPER_GAME_STATUS.NOT_START

  get minisweeper() {
    return this._minisweeper
  }

  getMinisweeperItem(row: number, col: number) {
    return this._minisweeper[row][col]
  }

  init(row: number, col: number, mines: number): MinesweeperItemState[][] {
    this.reset()

    this._row = row
    this._col = col
    this._mines = mines
    this._remainMines = mines
    this._minisweeper = new Array(row).fill(0).map(
      (_, i) => new Array(col).fill(0).map(
        (_, j) => ({ ...DEFAULT_ITEM_STATE, row: i, col: j })),
    )
    this._generateMines()
    this._generateNumber()
    return this._minisweeper
  }

  reset() {
    this._row = 0
    this._col = 0
    this._mines = 0
    this._remainMines = 0
    this._minisweeper = []
    this._gameStatus = MINESWEEPER_GAME_STATUS.NOT_START
  }

  check(block: MinesweeperItemState): CheckResultType {
    this._minisweeper[block.row][block.col] = block
    let needExpend = false
    let expendItems: CheckResultType['expendItems'] = []

    if (this._gameStatus === MINESWEEPER_GAME_STATUS.NOT_START)
      this._gameStatus = MINESWEEPER_GAME_STATUS.FIRST_STEP
    else if (this._gameStatus === MINESWEEPER_GAME_STATUS.FIRST_STEP)
      this._gameStatus = MINESWEEPER_GAME_STATUS.INPROGRESS

    if (block.type === MINESWEEPER_ITEM_TYPE.MINE) {
      this._gameStatus = MINESWEEPER_GAME_STATUS.LOSE
    }
    else if (block.type === MINESWEEPER_ITEM_TYPE.FLAG && block.isMines) {
      this._remainMines--
    }
    else if (block.type === MINESWEEPER_ITEM_TYPE.INITIAL && block.isMines) {
      this._remainMines++
    }
    else if (block.type === MINESWEEPER_ITEM_TYPE.NUMBER && block.value === 0) {
      needExpend = true
      expendItems = this._handleZeroBlock(block)
    }

    return {
      status: this._gameStatus,
      needExpend,
      expendItems,
      remainMines: this._remainMines,
    }
  }

  handleBlockClick(block: MinesweeperItemState, clickType: CLICK_BUTTON) {
    const newBlock = { ...block }
    const flag = clickType === CLICK_BUTTON.LEFT
      ? this._handleLeftButtonClick(newBlock)
      : this._handleRightButtonClick(newBlock)

    return flag ? newBlock : false
  }

  private _handleZeroBlock(block: MinesweeperItemState): MinesweeperItemState[] {
    const needUpdateItems: MinesweeperItemState[] = []
    this._expandZeroBlock(block, needUpdateItems)
    return needUpdateItems
  }

  private _expandZeroBlock(block: MinesweeperItemState, needUpdateItems: MinesweeperItemState[]) {
    const { row, col } = block
    for (const [x, y] of DIR) {
      const newRow = row + x
      const newCol = col + y
      if (newRow < 0 || newRow >= this._row || newCol < 0 || newCol >= this._col)
        continue

      const block = this._minisweeper[newRow][newCol]
      if (block.type === MINESWEEPER_ITEM_TYPE.NUMBER || block.type === MINESWEEPER_ITEM_TYPE.MINE)
        continue

      if (block.type === MINESWEEPER_ITEM_TYPE.FLAG) {
        // TODO: check flag
      }

      block.type = MINESWEEPER_ITEM_TYPE.NUMBER
      needUpdateItems.push({ ...block })
      if (block.value === 0)
        this._expandZeroBlock(block, needUpdateItems)
    }
  }

  private _handleLeftButtonClick(block: MinesweeperItemState) {
    if (block.type === MINESWEEPER_ITEM_TYPE.INITIAL || block.type === MINESWEEPER_ITEM_TYPE.FLAG)
      block.type = block.isMines ? MINESWEEPER_ITEM_TYPE.MINE : MINESWEEPER_ITEM_TYPE.NUMBER
    else
      return false
    return true
  }

  private _handleRightButtonClick(block: MinesweeperItemState) {
    if (block.type === MINESWEEPER_ITEM_TYPE.INITIAL)
      block.type = MINESWEEPER_ITEM_TYPE.FLAG
    else if (block.type === MINESWEEPER_ITEM_TYPE.FLAG)
      block.type = MINESWEEPER_ITEM_TYPE.INITIAL
    else
      return false

    return true
  }

  private _randomInt(max: number, min: number) {
    const randomNum = Math.random() * (max - min) + min
    return Math.round(randomNum)
  }

  private _generateMines() {
    let _mines = this._mines

    while (_mines > 0) {
      const _row = this._randomInt(this._row - 1, 0)
      const _col = this._randomInt(this._col - 1, 0)
      const block = this._minisweeper[_row][_col]
      if (block.isMines)
        continue

      block.isMines = true
      _mines--
    }
  }

  private _generateNumber() {
    for (let i = 0; i < this._row; i++) {
      for (let j = 0; j < this._col; j++) {
        const block = this._minisweeper[i][j]
        if (!block.isMines)
          block.value = this._getMineCount(i, j)
      }
    }
  }

  private _getMineCount(_row: number, _col: number): MINESWEEPER_ITEM_NUMBER {
    let count = 0
    for (const [x, y] of DIR) {
      const newRow = _row + x
      const newCol = _col + y
      if (newRow < 0 || newRow >= this._row || newCol < 0 || newCol >= this._col)
        continue

      const block = this._minisweeper[newRow][newCol]
      if (block.isMines)
        count++
    }
    return count as MINESWEEPER_ITEM_NUMBER
  }
}
