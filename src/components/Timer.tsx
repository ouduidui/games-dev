const currentSecond = () => new Date().getTime() / 1000

enum TIMER_STATUS {
  NOT_START,
  START,
  PAUSE,
  CONTINUE,
  STOP,
}

export interface TimerRef {
  pause: () => void
  continue: () => void
  stop: () => void
  start: () => void
  reset: () => void
  getTime: () => number
  getStatus: () => TIMER_STATUS
}

export default forwardRef<TimerRef>((_, ref) => {
  const [start, setStart] = useState(currentSecond())
  const [now, setNow] = useState(currentSecond())
  const [status, setStatus] = useState<TIMER_STATUS>(TIMER_STATUS.NOT_START)

  const time = useMemo(() => Math.round(now - start < 0 ? 0 : now - start), [now])

  useImperativeHandle(ref, () => ({
    pause: () => setStatus(TIMER_STATUS.PAUSE),
    continue: () => setStatus(TIMER_STATUS.CONTINUE),
    stop: () => setStatus(TIMER_STATUS.STOP),
    start: () => setStatus(TIMER_STATUS.START),
    reset: () => {
      setStart(currentSecond())
      setNow(currentSecond())
      setStatus(TIMER_STATUS.NOT_START)
    },
    getTime: () => time,
    getStatus: () => status,
  }))

  useEffect(() => {
    let flag = false
    if (status === TIMER_STATUS.START) {
      setStart(currentSecond())
      flag = true
    }
    else if (status === TIMER_STATUS.CONTINUE) {
      const nowTime = currentSecond()
      setStart(start + nowTime - now)
      flag = true
    }
    else if (status === TIMER_STATUS.STOP) {
      setStart(now)
    }

    if (flag) {
      const timer = setInterval(() => {
        setNow(currentSecond())
      }, 500)

      return () => clearInterval(timer)
    }
  }, [status])

  return <>{time}</>
})
