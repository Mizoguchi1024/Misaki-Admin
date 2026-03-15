import { App, Button, DatePicker, Form, type FormProps, Input, Modal, Radio, Skeleton } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import ImageUpload from './ImageUpload'
import type { UploadResponse } from '@/types/common'
import { getProfile, updateProfile } from '@/api/front/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type ProfileModalProps = {
  open: boolean
  onCancel: () => void
} & React.HTMLAttributes<HTMLDivElement>

type FieldType = {
  username: string
  gender: number
  birthday: dayjs.Dayjs
  avatarPath: string
  occupation: string
  detail: string
}

export default function ProfileModal({ open, onCancel }: ProfileModalProps): React.JSX.Element {
  const { t } = useTranslation('profileModal')
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  })

  const {
    avatarPath,
    id,
    username,
    email,
    gender,
    birthday,
    occupation,
    detail,
    createTime,
    version
  } = data?.data ?? {}

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      message.success(t('profileSaved'))
      onCancel()
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    mutation.mutate({
      username: values.username,
      gender: values.gender,
      birthday: values.birthday?.format('YYYY-MM-DD') ?? undefined,
      avatarPath: values.avatarPath,
      occupation: values.occupation,
      detail: values.detail,
      version: version!
    })
  }

  return (
    <Modal
      title={t('profile')}
      centered
      footer={null}
      open={open}
      onCancel={onCancel}
      destroyOnHidden
      className="select-none"
    >
      <div className=" flex flex-col p-2 items-center justify-between gap-4 h-160 overflow-y-auto scrollbar-style">
        <ImageUpload
          imgPath={avatarPath ?? ''}
          onSuccess={async (data: UploadResponse) => {
            try {
              await updateProfile({ avatarPath: data.path, version: version! })
              message.success(t('uploadSuccess'))
            } catch {
              return
            }
          }}
        />
        <Skeleton loading={isLoading} active round title={false}>
          <Form
            name="basic"
            autoComplete="off"
            validateTrigger="onSubmit"
            colon={false}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"
            requiredMark={false}
            onFinish={onFinish}
            validateMessages={{ required: t('requiredTemplate') }}
            className="w-full"
          >
            <Form.Item name="id" label={t('id')}>
              <span>{id}</span>
            </Form.Item>
            <Form.Item name="email" label={t('email')}>
              <span>{email}</span>
            </Form.Item>
            <Form.Item<FieldType>
              name="username"
              label={t('username')}
              initialValue={username}
              rules={[{ required: true }]}
            >
              <Input placeholder={t('username')} maxLength={20} showCount spellCheck={false} />
            </Form.Item>
            <Form.Item<FieldType>
              name="gender"
              label={t('gender')}
              initialValue={gender}
              rules={[{ required: true }]}
            >
              <Radio.Group optionType="button" buttonStyle='solid'>
                <Radio.Button value={0}>
                  {t('unknown')}
                </Radio.Button>
                <Radio.Button value={1}>
                  {t('male')}
                </Radio.Button>
                <Radio.Button value={2}>
                  {t('female')}
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item<FieldType>
              name="birthday"
              label={t('birthday')}
              initialValue={birthday && dayjs(birthday)}
            >
              <DatePicker
                placeholder={t('birthday')}
                form="YYYY-MM-DD"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Form.Item>
            <Form.Item<FieldType>
              name="occupation"
              label={t('occupation')}
              initialValue={occupation}
            >
              <Input placeholder={t('occupation')} maxLength={20} showCount spellCheck={false} />
            </Form.Item>
            <Form.Item<FieldType> name="detail" label={t('detail')} initialValue={detail}>
              <Input.TextArea
                placeholder={t('detail')}
                showCount
                maxLength={100}
                spellCheck={false}
                autoSize={{ minRows: 2, maxRows: 4 }}
                className="scrollbar-style"
              />
            </Form.Item>
            <Form.Item name="createTime" label={t('createTime')}>
              <span>{createTime}</span>
            </Form.Item>
            <Button type="primary" block htmlType="submit">
              {t('save')}
            </Button>
          </Form>
        </Skeleton>
      </div>
    </Modal>
  )
}
