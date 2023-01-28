import { KEY_CODE } from '~/constants'
import { MINESWEEPER_DIFFICULTY, MINESWEEPER_DIFFICULTY_LABEL } from '~/constants/minesweeper'
import { useStores } from '~/stores'

export default () => {
  const { minesweeperStore } = useStores()
  const { startGame } = minesweeperStore
  const [activeKey, setActiveKey] = useState<MINESWEEPER_DIFFICULTY>(MINESWEEPER_DIFFICULTY.EASY)
  const options = Object.keys(MINESWEEPER_DIFFICULTY_LABEL) as MINESWEEPER_DIFFICULTY[]

  const handleArrowChange = (changed: 1 | -1) => {
    const idx = options.indexOf(activeKey)
    const nextIdx = idx + changed
    if (nextIdx < 0)
      setActiveKey(options[options.length - 1])
    else
      setActiveKey(options[nextIdx % options.length])
  }

  const handleOnClick = () => startGame(activeKey)

  useEventListener('keydown', (e: KeyboardEvent) => {
    switch (e.code) {
      case KEY_CODE.ARROW_UP:
        handleArrowChange(-1)
        break
      case KEY_CODE.ARROW_DOWN:
        handleArrowChange(+1)
        break
      case KEY_CODE.ENTER:
        handleOnClick()
        break
      default:
        break
    }
  })

  return <div>
    {
     options.map((key) => {
       const isActive = activeKey === key
       return (
        <div key={key} className={classnames('cursor-pointer', 'mb-3', {
          'op-70': !isActive,
          'op-100': isActive,
        })}>
          <span
            onMouseEnter={() => setActiveKey(key)}
            onClick={handleOnClick}
            className={
              classnames('text-xl', 'font-200', 'b-b', {
                'border-transparent': !isActive,
              })
            }>
            {MINESWEEPER_DIFFICULTY_LABEL[key]}
          </span>
        </div>
       )
     },

     )
    }
  </div>
}
