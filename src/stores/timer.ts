import { PERSIST_NAME, STORAGE } from '~/constants/stores'

const INTERVAL = 500

class TimerStore {
  timer = {
    startTime: 0,
    endTime: 0,
  }

  private _intervalTimer: NodeJS.Timer | null = null

  constructor(persistName: PERSIST_NAME) {
    makeAutoObservable(this, {}, { autoBind: true })
    makePersistable(this, {
      name: persistName,
      properties: ['timer'],
      storage: STORAGE,
    })
  }

  get duration(): string {
    const { startTime, endTime } = this.timer
    let duration = endTime - startTime
    if (duration <= 0)
      duration = 0

    return dayjs(duration).format('mm:ss')
  }

  get currentSecond(): number {
    return dayjs().valueOf()
  }

  startTimer() {
    this.timer.startTime = this.currentSecond
    this.timer.endTime = this.currentSecond
    this._intervalTimer = setInterval(() => {
      this.timer.endTime = this.currentSecond
    }, INTERVAL)
  }

  resetTimer() {
    this.timer.startTime = this.currentSecond
    this.timer.endTime = this.currentSecond
    this.stopTimer()
  }

  stopTimer() {
    if (this._intervalTimer) {
      clearInterval(this._intervalTimer)
      this._intervalTimer = null
    }
  }

  continueTimer() {
    const currentSecond = this.currentSecond
    const { startTime, endTime } = this.timer
    this.timer = {
      startTime: currentSecond - (endTime - startTime),
      endTime: currentSecond,
    }
    this._intervalTimer = setInterval(() => {
      this.timer.endTime = this.currentSecond
    }, INTERVAL)
  }
}

export const minesweeperTimer = new TimerStore(PERSIST_NAME.MINESWEEPER_TIMER)
