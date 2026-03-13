import { Modal } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

declare const __APP_VERSION__: string

type AboutModalProps = {
  open: boolean
  onCancel: () => void
} & React.HTMLAttributes<HTMLDivElement>

export default function AboutModal({ open, onCancel }: AboutModalProps): React.JSX.Element {
  const { t } = useTranslation('aboutModal')

  return (
    <Modal
      title={t('about')}
      centered
      footer={null}
      open={open}
      onCancel={onCancel}
      className="select-none"
    >
      <div className="max-h-120 py-2 overflow-y-auto scrollbar-none">
        <div className=" flex flex-col gap-2 mb-4">
          <div className="w-full flex justify-between">
            <span>{t('misakiVersion')}</span>
            <span>{__APP_VERSION__}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>{t('reactVersion')}</span>
            <span>{React.version}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
