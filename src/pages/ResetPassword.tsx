import { resetPassword, sendVerifyCode } from '@/api/common/auth'
import GlassBox from '@/components/common/GlassBox'
import { useSettingsStore } from '@/store/settings'
import type { ResetPasswordRequest } from '@/types/auth'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { App, Button, Divider, Form, Input, Space } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import MisakiLogo from '@/assets/img/misaki-logo-symbol.svg?react'

export default function ResetPassword() {
  const { t } = useTranslation('resetPassword')
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { language } = useSettingsStore()
  const [form] = Form.useForm<ResetPasswordRequest>()
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false)
  const [sendVerifyCodeLoading, setSendVerifyCodeLoading] = useState(false)

  const onSendVerifyCode = async (): Promise<void> => {
    try {
      const { email } = await form.validateFields(['email'])
      setSendVerifyCodeLoading(true)
      await sendVerifyCode(email, language)
      message.success(t('verifyCodeSent'))
    } finally {
      setTimeout(() => {
        setSendVerifyCodeLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-24">
      <div className="flex items-center text-8xl select-none">
        <div className="flex items-center gap-2">
          <MisakiLogo className="w-32" />
          <span className="font-semibold">Misaki</span>
        </div>
        <Divider vertical className="h-full mx-8" />
        <span className="font-normal">{t('resetPassword')}</span>
      </div>
      <GlassBox className="px-12 py-10 w-90">
        <Form
          form={form}
          variant="filled"
          onFinish={async (values) => {
            try {
              await resetPassword(values)
              setSubmitButtonLoading(false)
              message.success(t('passwordReset'))
              navigate('/', { viewTransition: true })
            } catch {
              setTimeout(() => {
                setSubmitButtonLoading(false)
              }, 1000)
            }
          }}
        >
          <Form.Item<ResetPasswordRequest>
            name="email"
            rules={[
              { type: 'email', message: t('emailTypeMessage') },
              { required: true, message: t('emailRequiredMessage') }
            ]}
          >
            <Space.Compact>
              <Input prefix={<MailOutlined />} placeholder={t('email')} spellCheck={false} />
              <Button
                color="primary"
                variant="filled"
                loading={sendVerifyCodeLoading}
                onClick={onSendVerifyCode}
              >
                {t('sendVerifyCode')}
              </Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item<ResetPasswordRequest>
            name="password"
            rules={[
              { required: true, message: t('newPasswordRequiredMessage') },
              { min: 6, message: t('newPasswordTypeMessage') },
              { max: 20, message: t('newPasswordTypeMessage') }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t('newPassword')} />
          </Form.Item>
          <Form.Item<ResetPasswordRequest>
            name="verifyCode"
            rules={[{ required: true, message: t('verifyCodeRequiredMessage') }]}
          >
            <Input.OTP  className="w-full justify-between"/>
          </Form.Item>
          <Form.Item label={null} className="m-0">
            <Button type="primary" block htmlType="submit" loading={submitButtonLoading}>
              {t('reset')}
            </Button>
          </Form.Item>
        </Form>
      </GlassBox>
    </div>
  )
}
