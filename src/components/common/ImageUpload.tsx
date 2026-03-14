import { upload } from '@/api/common/common'
import { useSettingsStore } from '@/store/settings'
import type { UploadResponse } from '@/types/common'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { App, Tooltip, Upload } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type ImageUploadProps = {
  imgPath: string
  onSuccess: (data: UploadResponse) => void
} & React.HTMLAttributes<HTMLDivElement>

export default function ImageUpload({ imgPath, onSuccess }: ImageUploadProps): React.JSX.Element {
  const { t } = useTranslation('imageUpload')
  const { message } = App.useApp()
  const { borderRadius } = useSettingsStore()
  const [avatarLoading, setAvatarLoading] = useState(false)

  const beforeUpload = (file: File): boolean => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.warning(t('onlyImage'))
    }
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      message.warning(t('sizeLimit'))
    }
    return isImage && isLt10M
  }

  return (
    <Tooltip
      title={t('sizeLimit')}
      arrow={false}
      classNames={{
        container: 'select-none'
      }}
    >
      <Upload
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={async (options) => {
          const { file, onSuccess: uploadOnSuccess } = options
          const formData = new FormData()
          formData.append('file', file as File)
          try {
            setAvatarLoading(true)
            const uploadRes = await upload(formData)
            uploadOnSuccess?.(uploadRes.data, file)
            onSuccess?.(uploadRes.data)
          } catch {
            return
          } finally {
            setAvatarLoading(false)
          }
        }}
      >
        {imgPath ? (
          <img
            src={'http://www.localhost:9000' + imgPath}
            alt="avatar"
            draggable={false}
            className="w-full h-full object-cover"
            style={{ borderRadius }}
          />
        ) : (
          <button>
            {avatarLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div>{t('upload')}</div>
          </button>
        )}
      </Upload>
    </Tooltip>
  )
}
