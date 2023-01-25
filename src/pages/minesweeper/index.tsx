import MinesweeperItem from '~/components/MinesweeperItem'

export default () => {
  const arr: number[][] = new Array(16).fill(new Array(30).fill(0))
  return (
    <div className="b-1">
      {arr.map((row, i) => (
        <div key={i} className="flex">
          {row.map((_, j) => (
            <div key={j} className="b-1">
              <MinesweeperItem row={i} col={j} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
