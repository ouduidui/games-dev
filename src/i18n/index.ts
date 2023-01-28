import type { InitOptions } from 'i18next'
import en from './en'
import cn from './cn'
import setting from '~/stores/setting'

export const __TEXT__ = i18n.t
export const t = i18n.t

const i18nOptions: InitOptions = {
  resources: {
    en: {
      translation: en,
    },
    cn: {
      translation: cn,
    },
  },
  lng: setting.language,
}

i18n.init(i18nOptions)
