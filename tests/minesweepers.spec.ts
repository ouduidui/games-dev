import { describe, expect, it } from 'vitest'
import { MinesweeperController } from '../src/controllers/minesweeper'

describe('MinesweeperController', () => {
  const minesweeper = new MinesweeperController()
  const row = 16
  const col = 30
  const mines = 99

  it('should return row ✖️ col arr and has mines', () => {
    const result = minesweeper.init(row, col, mines)
    expect(result).toHaveLength(row)
    expect(result[0]).toHaveLength(col)
    expect(result.flat().filter(item => item.isMines).length).toEqual(mines)
  })

  it('should calculate number', () => {
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
    const result = minesweeper.init(row, col, mines)
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
})
