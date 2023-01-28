import { log } from '~/utils/logger'
import { CLICK_BUTTON } from '~/constants'
import type { MinesweeperItemNumber, MinesweeperItemState } from '~/types/minesweeper'
import { MINESWEEPER_ITEM_TYPE } from '~/constants/minesweeper'

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

interface Step {
  x: number
  y: number
}

export class MinesweeperController {
  private _row = 0
  private _col = 0
  private _mines = 0
  private _minisweeper: MinesweeperItemState[][] = []

  constructor(ops?: { row: number; col: number; mines: number; minesweeper: MinesweeperItemState[][] }) {
    const { row = 0, col = 0, mines = 0, minesweeper = [] } = ops || {}
    this._row = row
    this._col = col
    this._mines = mines
    this._minisweeper = minesweeper
  }

  get minisweeper() {
    return this._minisweeper
  }

  init(row: number, col: number, mines: number): MinesweeperItemState[][] {
    this._row = row
    this._col = col
    this._mines = mines
    this._minisweeper = new Array(row).fill(0).map(
      (_, i) => new Array(col).fill(0).map(
        (_, j) => ({ ...DEFAULT_ITEM_STATE, row: i, col: j })),
    )
    return this._minisweeper
  }

  genMinesweeper(x: number, y: number): MinesweeperItemState[][] {
    log('controller genMinesweeper', { x, y })
    this._generateMines({ x, y })
    this._generateNumber()
    const block = this._minisweeper[x][y]
    block.type = MINESWEEPER_ITEM_TYPE.NUMBER
    this._handleZeroBlock(block)
    return this._minisweeper
  }

  handleBlockClick(x: number, y: number, clickType: CLICK_BUTTON) {
    log('controller handleBlockClick', { x, y, clickType })
    const block = this._minisweeper[x][y]

    if (block.type === MINESWEEPER_ITEM_TYPE.NUMBER) {
      this._handleExpandAround(block)
    }
    else {
      clickType === CLICK_BUTTON.LEFT
        ? this._handleLeftButtonClick(block)
        : this._handleRightButtonClick(block)
    }

    if (block.type === MINESWEEPER_ITEM_TYPE.NUMBER && block.value === 0)
      this._handleZeroBlock(block)

    return this._minisweeper
  }

  openAllItems() {
    this._minisweeper.forEach((row) => {
      row.forEach((block) => {
        if (block.type === MINESWEEPER_ITEM_TYPE.INITIAL)
          block.type = block.isMines ? MINESWEEPER_ITEM_TYPE.MINE : MINESWEEPER_ITEM_TYPE.NUMBER
      })
    })
    return this._minisweeper
  }

  private _handleZeroBlock(block: MinesweeperItemState) {
    const { row, col } = block
    for (const [x, y] of DIR) {
      const newRow = row + x
      const newCol = col + y
      if (this._checkIsOutOfBounds(newRow, newCol))
        continue

      const block = this._minisweeper[newRow][newCol]
      if (block.type === MINESWEEPER_ITEM_TYPE.NUMBER || block.type === MINESWEEPER_ITEM_TYPE.MINE)
        continue

      block.type = MINESWEEPER_ITEM_TYPE.NUMBER
      if (block.value === 0)
        this._handleZeroBlock(block)
    }
  }

  private _handleLeftButtonClick(block: MinesweeperItemState) {
    if (block.type === MINESWEEPER_ITEM_TYPE.INITIAL || block.type === MINESWEEPER_ITEM_TYPE.FLAG)
      block.type = block.isMines ? MINESWEEPER_ITEM_TYPE.MINE : MINESWEEPER_ITEM_TYPE.NUMBER
  }

  private _handleRightButtonClick(block: MinesweeperItemState) {
    if (block.type === MINESWEEPER_ITEM_TYPE.INITIAL)
      block.type = MINESWEEPER_ITEM_TYPE.FLAG
    if (block.type === MINESWEEPER_ITEM_TYPE.FLAG)
      block.type = MINESWEEPER_ITEM_TYPE.INITIAL
  }

  private _handleExpandAround(block: MinesweeperItemState) {
    const { row, col } = block
    const aroundItems = this._getAroundArea({ x: row, y: col })
      .map(({ x, y }) => this._minisweeper[x][y])
    const flagCnt = aroundItems.filter(v => v.type === MINESWEEPER_ITEM_TYPE.FLAG).length
    if (flagCnt !== block.value)
      return

    aroundItems.forEach((item) => {
      if (item.type === MINESWEEPER_ITEM_TYPE.INITIAL) {
        item.type = item.isMines ? MINESWEEPER_ITEM_TYPE.MINE : MINESWEEPER_ITEM_TYPE.NUMBER
        if (item.value === 0)
          this._handleZeroBlock(item)
      }
    })
  }

  private _randomInt(max: number, min: number) {
    const randomNum = Math.random() * (max - min) + min
    return Math.round(randomNum)
  }

  private _generateMines(firstStep: Step) {
    let _mines = this._mines
    const around = this._getAroundArea(firstStep)

    const checkIsAround = (row: number, col: number) =>
      around.some(({ x, y }) => x === row && y === col)

    while (_mines > 0) {
      const row = this._randomInt(this._row - 1, 0)
      const col = this._randomInt(this._col - 1, 0)
      const block = this._minisweeper[row][col]
      if (block.isMines || checkIsAround(row, col))
        continue

      block.isMines = true
      _mines--
    }
  }

  private _getAroundArea({ x, y }: Step): Step[] {
    return DIR.map<Step | null>(([dx, dy]) => {
      const newX = x + dx
      const newY = y + dy
      if (this._checkIsOutOfBounds(newX, newY))
        return null
      return { x: newX, y: newY }
    }).filter(v => v) as Step[]
  }

  private _checkIsOutOfBounds(x: number, y: number) {
    return x < 0 || x >= this._row || y < 0 || y >= this._col
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

  private _getMineCount(_row: number, _col: number): MinesweeperItemNumber {
    let count = 0
    for (const [x, y] of DIR) {
      const newRow = _row + x
      const newCol = _col + y
      if (this._checkIsOutOfBounds(newRow, newCol))
        continue

      const block = this._minisweeper[newRow][newCol]
      if (block.isMines)
        count++
    }
    return count as MinesweeperItemNumber
  }
}
