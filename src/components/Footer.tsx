import useDark from '../hooks/useDark'
// import { useStores } from '~/stores'

export default function Footer() {
  const { isDark, toggleDark } = useDark()
  // const { settingStore } = useStores()
  return (
    <nav className="text-xl mt-6 inline-flex gap-2 pb-6 flex justify-center items-center">
      <button className="icon-btn !outline-none" onClick={() => toggleDark()}>
        {isDark ? <div className="i-carbon-moon" /> : <div className="i-carbon-sun" />}
      </button>
      <a
        className="icon-btn i-carbon-logo-github"
        rel="noreferrer"
        href="https://github.com/ouduidui/games-dev"
        target="_blank"
        title="GitHub"
      />
      {/* <div
        onClick={settingStore.changeLanguage}
        className='icon-btn i-carbon-ibm-watson-language-translator'
      /> */}
    </nav>
  )
}
