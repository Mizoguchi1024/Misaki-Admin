import { App, Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import MisakiButton from '../common/MisakiButton'
import { useEffect } from 'react'
import { useSettingsStore } from '@/store/settings'
import HelpDropdown from '../common/HelpDropdown'

const { Header, Content, Footer } = Layout

export default function AuthLayout(): React.JSX.Element {
  const { message } = App.useApp()
  const { setStaticMessage } = useSettingsStore()

  useEffect(() => {
    setStaticMessage(message)
  }, [])

  return (
    <Layout className="h-screen w-screen overflow-hidden relative">
      <Header className="flex items-center justify-between bg-white dark:bg-neutral-900 px-10">
        <MisakiButton />
        <HelpDropdown />
      </Header>
      <Content>
        <Outlet />
      </Content>
      <Footer className="absolute bottom-0 w-full bg-transparent text-center select-none">
        Developed by Mizoguchi. All rights reserved.
      </Footer>
    </Layout>
  )
}
