import { GAMES_CMD, KEY_CODE } from '~/constants'

export default () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()

  const handleArrowChange = (nextIndex: number) => {
    const lastIndex = GAMES_CMD.length - 1
    if (nextIndex < 0)
      nextIndex = lastIndex
    else if (nextIndex > lastIndex)
      nextIndex = 0

    setActiveIndex(nextIndex)
  }

  const handleOnClick = (ops: (typeof GAMES_CMD)[number]) => {
    const { id } = ops
    navigate(`/${id}`)
  }

  useEventListener('keydown', (e: KeyboardEvent) => {
    switch (e.code) {
      case KEY_CODE.ARROW_UP:
        handleArrowChange(activeIndex - 1)
        break
      case KEY_CODE.ARROW_DOWN:
        handleArrowChange(activeIndex + 1)
        break
      case KEY_CODE.ENTER:
        handleOnClick(GAMES_CMD[activeIndex])
        break
      default:
        break
    }
  })

  const renderNav = () => {
    return GAMES_CMD.map((game, idx) => {
      const isActive = activeIndex === idx
      return (
        <div
          key={game.id}
          onMouseEnter={() => setActiveIndex(idx)}
          onClick={() => handleOnClick(game)}
          className={classnames('flex', 'items-center', 'justify-center', 'cursor-pointer', 'mb-3', {
            'op-70': !isActive,
            'op-100': isActive,
          })}>
          <div className={classnames(game.iconCls, 'mr-2', 'text-xl', 'font-800')} />
          <div className={classnames('text-xl', 'font-200', 'b-b', { 'border-transparent': !isActive })}>
            {game.label}
          </div>
        </div>
      )
    })
  }
  return (
    <div className="select-none mt-20">
      {renderNav()}
    </div>
  )
}
