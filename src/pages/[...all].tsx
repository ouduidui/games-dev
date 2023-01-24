import { t } from '~/i18n'

export default () => {
  const navigate = useNavigate()
  const handleToHomeClick = () => navigate('/')
  return (
    <>
    <div className="text-2xl font-200 mt-20 select-none mb-5">{t('error_tip')}</div>
    <button
      className='text font-200 b-1 px-5 py-1 op-50 hover:op-100'
      onClick={handleToHomeClick}
    >
      {t('to_home')}
    </button>
    </>
  )
}
