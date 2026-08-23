import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // This app fetches data with plain useEffect + async handlers (no
      // Suspense/data-fetching library), which is exactly the pattern this
      // rule flags; the standard "loading" state initialized to true instead
      // of set synchronously already avoids the cascading-render issue.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
