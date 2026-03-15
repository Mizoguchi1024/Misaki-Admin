import { login } from '@/api/common/auth'
import MisakiLogo from '@/assets/img/misaki-logo-symbol.svg?react'
import GlassBox from '@/components/common/GlassBox'
import { useUserStore } from '@/store/user'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { App, Button, Checkbox, Divider, Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

type FieldType = {
  email: string
  password: string
  rememberMe: boolean
}

export default function Login() {
  const { t } = useTranslation('login')
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { jwt, rememberMe, setAuthInfo, setRememberMe, reset } = useUserStore()
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false)

  useEffect(() => {
    if (jwt) {
      if (!rememberMe) {
        reset()
        return
      }
      message.success(t('loginSuccess'))
      navigate('/workspace', { viewTransition: true })
    }
  }, [jwt])

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-24">
      <div className="flex items-center text-8xl select-none">
        <div className="flex items-center gap-2">
          <MisakiLogo className="w-32" />
          <span className="font-semibold">Misaki</span>
        </div>
        <Divider vertical className="h-full mx-8" />
        <span className="font-normal">{t('admin')}</span>
      </div>
      <GlassBox className="px-12 py-10">
        <Form
          variant="filled"
          onFinish={async (values) => {
            try {
              const loginRes = await login({ email: values.email, password: values.password })
              if (loginRes.data.authRole !== 1) {
                message.error(t('notAdmin'))
                return
              }
              setSubmitButtonLoading(false)
              setRememberMe(values.rememberMe)
              setAuthInfo(loginRes.data)
            } catch {
              setTimeout(() => {
                setSubmitButtonLoading(false)
              }, 1000)
            }
          }}
        >
          <Form.Item<FieldType>
            name="email"
            rules={[
              { type: 'email', message: t('emailTypeMessage') },
              { required: true, message: t('emailRequiredMessage') }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder={t('email')} spellCheck={false} />
          </Form.Item>
          <Form.Item<FieldType>
            name="password"
            rules={[
              { required: true, message: t('passwordRequiredMessage') },
              { min: 6, message: t('passwordTypeMessage') },
              { max: 20, message: t('passwordTypeMessage') }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t('password')} />
          </Form.Item>
          <div className="flex justify-between items-start pl-2">
            <Form.Item<FieldType> name="rememberMe" valuePropName="checked">
              <Checkbox className="select-none">{t('rememberMe')}</Checkbox>
            </Form.Item>
            <Button
              color="primary"
              variant="text"
              onClick={() => {
                navigate('/reset-password', { viewTransition: true })
              }}
            >
              {t('forgotPassword')}
            </Button>
          </div>
          <Form.Item label={null} className="m-0">
            <Button type="primary" block htmlType="submit" loading={submitButtonLoading}>
              {t('login')}
            </Button>
          </Form.Item>
        </Form>
      </GlassBox>
    </div>
  )
}
