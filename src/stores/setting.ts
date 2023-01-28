import { PERSIST_NAME, STORAGE } from '~/constants/stores'

enum LANGUAGE {
  EN = 'en',
  CN = 'cn',
}

class SettingStore {
  language: LANGUAGE = LANGUAGE.EN

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    makePersistable(this, {
      name: PERSIST_NAME.SETTING,
      properties: ['language'],
      storage: STORAGE,
    })
  }

  changeLanguage() {
    this.language = this.language === LANGUAGE.EN ? LANGUAGE.CN : LANGUAGE.EN
    setTimeout(() => window.location.reload())
  }
}

export default new SettingStore()
