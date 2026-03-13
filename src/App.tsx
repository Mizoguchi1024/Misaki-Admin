import { App as AntdApp, ConfigProvider, theme } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import { LanguageAntdMap, useSettingsStore } from './store/settings'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App({ children }: { children?: React.ReactNode }): React.JSX.Element {
  const { appearance, fontSize, borderRadius, language } = useSettingsStore()

  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  useEffect(() => {
    const root = document.documentElement
    if (appearance === 2 || (appearance === 0 && isSystemDark)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isSystemDark, appearance])

  return (
    <StyleProvider layer>
      <ConfigProvider
        theme={{
          algorithm:
            appearance === 2 || (appearance === 0 && isSystemDark)
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
          token: {
            fontSize: fontSize,
            colorPrimary: '#3142EF',
            borderRadius: borderRadius
          },
          components: {
            Menu: {
              activeBarBorderWidth: 0
            }
          }
        }}
        locale={LanguageAntdMap[language]}
      >
        <AntdApp message={{ maxCount: 5 }}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </AntdApp>
      </ConfigProvider>
    </StyleProvider>
  )
}
