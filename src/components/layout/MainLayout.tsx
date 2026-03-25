import { App, Layout, Menu, type MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Icon, {
  ClockCircleOutlined,
  HeartOutlined,
  MessageOutlined,
  ProductOutlined,
  SendOutlined,
  StarOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import MisakiButton from '../common/MisakiButton'
import UserDropdown from '../common/UserDropdown'
import { useUserStore } from '@/store/user'
import McpLogo from '@/assets/img/mcp-logo.svg?react'
import { useSettingsStore } from '@/store/settings'

const { Header, Content, Sider } = Layout

export default function MainLayout(): React.JSX.Element {
  const { t } = useTranslation('mainLayout')
  const { message } = App.useApp()
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { jwt } = useUserStore()
  const { setStaticMessage } = useSettingsStore()

  useEffect(() => {
    setStaticMessage(message)
  }, [])

  useEffect(() => {
    if (!jwt) {
      navigate('/', { viewTransition: true })
    }
  }, [jwt])

  const menuItems: MenuProps['items'] = [
    {
      key: '/workspace',
      label: t('workspace'),
      icon: <ProductOutlined />
    },
    {
      type: 'divider'
    },
    {
      key: '/mcp',
      label: t('mcp'),
      icon: <Icon component={McpLogo} />
    },
    {
      key: '/user',
      label: t('user'),
      icon: <UserOutlined />
    },
    {
      key: '/assistant',
      label: t('assistant'),
      icon: <HeartOutlined />
    },
    {
      key: '/model',
      label: t('model'),
      icon: <StarOutlined />
    },
    {
      key: '/chat',
      label: t('chat'),
      icon: <MessageOutlined />
    },
    {
      key: '/feedback',
      label: t('feedback'),
      icon: <SendOutlined />
    },
    {
      key: '/log',
      label: t('log'),
      icon: <ClockCircleOutlined />
    }
  ]

  return (
    <Layout className="h-screen w-screen overflow-hidden relative z-0">
      <Header className="flex items-center justify-between h-16 px-10 bg-white dark:bg-neutral-900">
        <MisakiButton />
        <UserDropdown />
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
          className="bg-white dark:bg-neutral-800"
        >
          <Menu
            className="select-none h-full overflow-y-auto scroll-smooth scrollbar-none bg-transparent mask-b-from-94%"
            theme="light"
            selectedKeys={[location.pathname]}
            onClick={(e) => navigate(e.key, { viewTransition: true })}
            mode="inline"
            items={menuItems}
            disabled={!jwt}
          />
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
