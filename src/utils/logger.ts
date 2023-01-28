/* eslint-disable no-console */
import { IS_DEV } from './../constants/index'

export const log = IS_DEV
  ? (title: string, message: string | Record<string, any>) => {
      let msg = ''
      if (typeof message === 'string')
        msg = message
      else
        msg = JSON.stringify(message, null, 2)

      console.log(title, msg)
    }
  : () => {}
