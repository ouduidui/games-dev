/// <reference types="vitest" />

import * as path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import Pages from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      'constants/': `${path.resolve(__dirname, 'src/constants')}/`,
      'components/': `${path.resolve(__dirname, 'src/components')}/`,
      'hooks/': `${path.resolve(__dirname, 'src/hooks')}/`,
      'i18n/': `${path.resolve(__dirname, 'src/i18n')}/`,
      'pages/': `${path.resolve(__dirname, 'src/pages')}/`,
      'stores/': `${path.resolve(__dirname, 'src/stores')}/`,
    },
  },
  plugins: [
    // https://github.com/antfu/unocss
    Unocss(),

    react(),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.md$/, // .md
      ],
      imports: [
        'react',
        'react-router-dom',
        'mobx',
        {
          'usehooks-ts': ['useDarkMode', 'useEventListener', 'useEffectOnce'],
          'mobx': ['configure'],
          'react': ['createContext'],
          'mobx-react-lite': ['observer'],
          'mobx-persist-store': ['makePersistable'],
          'i18next': [
            ['default', 'i18n'],
          ],
          'dayjs': [
            ['default', 'dayjs'],
          ],
          'classnames': [
            ['default', 'classnames'],
          ],
        },
      ],
      dts: 'src/auto-imports.d.ts',
    }),
  ],
  server: {
    host: true,
  },
  test: {
    environment: 'jsdom',
  },
})
