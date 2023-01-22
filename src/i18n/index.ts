import type { InitOptions } from 'i18next'
import i18n from 'i18next'
import en from './en'
import cn from './cn'

export const __TEXT__ = i18n.t
export const t = i18n.t

const DEFAULT_LANGUAGE = 'en'

const i18nOptions: InitOptions = {
  resources: {
    en: {
      translation: en,
    },
    cn: {
      translation: cn,
    },
  },
  lng: DEFAULT_LANGUAGE,
}

i18n.init(i18nOptions)
