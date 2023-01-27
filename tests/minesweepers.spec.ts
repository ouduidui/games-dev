import { describe, expect, it } from 'vitest'
import { MINESWEEPER_ITEM_TYPE } from '../src/constants/minesweeper'
import { MinesweeperController } from '../src/controllers/minesweeper'

describe('MinesweeperController', () => {
  const minesweeper = new MinesweeperController()
  const row = 16
  const col = 30
  const mines = 99

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

  it('should return row ✖️ col arr and has mines', () => {
    minesweeper.init(row, col, mines)
    minesweeper.generateMinesweeper({ x: 0, y: 0 })
    const result = minesweeper.minisweeper
    expect(result).toHaveLength(row)
    expect(result[0]).toHaveLength(col)
    expect(result.flat().filter(item => item.isMines).length).toEqual(mines)
  })

  it('should calculate number', () => {
    minesweeper.init(row, col, mines)
    minesweeper.generateMinesweeper({ x: 0, y: 0 })
    const result = minesweeper.minisweeper
    result.forEach((r) => {
      r.forEach((item) => {
        if (!item.isMines) {
          let count = 0
          for (const [x, y] of DIR) {
            const newRow = item.row + x
            const newCol = item.col + y
            if (newRow < 0 || newRow >= row || newCol < 0 || newCol >= col)
              continue
            const block = result[newRow][newCol]
            if (block.isMines)
              count++
          }
          expect(count).toBe(item.value)
        }
      })
    })
  })

  it('should be a zero item in first step', () => {
    minesweeper.init(row, col, mines)
    const firstStep = { x: 0, y: 0 }
    minesweeper.generateMinesweeper(firstStep)
    const result = minesweeper.minisweeper
    expect(result[firstStep.x][firstStep.y].value).toBe(0)
    expect(result[firstStep.x][firstStep.y].type).toBe(MINESWEEPER_ITEM_TYPE.NUMBER)
    for (const [x, y] of DIR) {
      const newRow = firstStep.x + x
      const newCol = firstStep.y + y
      if (newRow < 0 || newRow >= row || newCol < 0 || newCol >= col)
        continue
      expect(result[newRow][newCol].isMine).toBeFalsy()
    }
  })
})
