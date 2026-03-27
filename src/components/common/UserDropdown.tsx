import {
  InfoCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Button, Dropdown, Spin, type MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import AboutModal from './AboutModal'
import SettingsModal from './SettingsModal'
import { useState } from 'react'
import { useUserStore } from '@/store/user'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/api/front/user'
import ProfileModal from './ProfileModal'

export default function UserDropdown(): React.JSX.Element {
  const { t } = useTranslation('userDropdown')
  const { logout } = useUserStore()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  })

  const { avatarPath, username } = data?.data ?? {}

  const list: MenuProps['items'] = [
    {
      key: 'profile',
      label: t('profile'),
      icon: <UserOutlined />
    },
    {
      key: 'settings',
      label: t('settings'),
      icon: <SettingOutlined />
    },
    {
      key: 'about',
      label: t('about'),
      icon: <InfoCircleOutlined />
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: t('logout'),
      icon: <LogoutOutlined />,
      danger: true
    }
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        setIsProfileModalOpen(true)
        break
      case 'settings':
        setIsSettingsModalOpen(true)
        break
      case 'about':
        setIsAboutModalOpen(true)
        break
      case 'logout':
        logout()
        break
    }
  }

  return (
    <>
      <Dropdown
        menu={{ items: list, onClick }}
        placement="bottomLeft"
        trigger={['click']}
        classNames={{
          itemContent: 'select-none'
        }}
      >
        <Spin spinning={isLoading}>
          <Button size="large" color="default" variant="filled">
            <Avatar
              size="small"
              src={'/oss' + avatarPath}
              icon={<UserOutlined />}
              draggable={false}
            />
            {username}
          </Button>
        </Spin>
      </Dropdown>
      <ProfileModal open={isProfileModalOpen} onCancel={() => setIsProfileModalOpen(false)} />
      <SettingsModal open={isSettingsModalOpen} onCancel={() => setIsSettingsModalOpen(false)} />
      <AboutModal open={isAboutModalOpen} onCancel={() => setIsAboutModalOpen(false)} />
    </>
  )
}
