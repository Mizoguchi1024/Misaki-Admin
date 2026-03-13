import { deleteAccount } from '@/api/front/user'
import { LanguageMap, useSettingsStore } from '@/store/settings'
import { useUserStore } from '@/store/user'
import { Button, Modal, Segmented, Select, Slider, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'

type SettingsModalProps = {
  open: boolean
  onCancel: () => void
} & React.HTMLAttributes<HTMLDivElement>

export default function SettingsModal({ open, onCancel }: SettingsModalProps): React.JSX.Element {
  const { t } = useTranslation('settingsModal')
  const { jwt } = useUserStore()
  const { language, fontSize, appearance, borderRadius, setPartial, resetLocalSettings } =
    useSettingsStore()

  const tabItems = [
    {
      key: '1',
      label: t('general'),
      children: (
        <div className="h-86 w-full flex flex-col gap-4 p-2 ml-4 overflow-y-auto scrollbar-style">
          <div className="flex justify-between items-center min-h-8 flex-none">
            <span>{t('language')}</span>
            <Select
              className="w-24"
              defaultValue={language}
              options={[
                { value: 0, label: LanguageMap[0] },
                { value: 1, label: LanguageMap[1] },
                { value: 2, label: LanguageMap[2] }
              ]}
              onChange={(value) => {
                setPartial({ language: value })
              }}
            />
          </div>
          <div className="flex justify-between items-center min-h-8 flex-none">
            <span>{t('appearance')}</span>
            <Segmented<string>
              defaultValue={appearance.toString()}
              shape="round"
              options={[
                { label: t('auto'), value: '0' },
                { label: t('light'), value: '1' },
                { label: t('dark'), value: '2' }
              ]}
              onChange={(value) => {
                setPartial({ appearance: Number(value) })
              }}
            />
          </div>
          <div className="flex justify-between items-center min-h-8 flex-none">
            <span>{t('fontSize')}</span>
            <Select
              className="w-24"
              defaultValue={fontSize}
              options={[
                { value: 12, label: '12' },
                { value: 14, label: '14' },
                { value: 16, label: '16' },
                { value: 18, label: '18' },
                { value: 20, label: '20' },
                { value: 22, label: '22' },
                { value: 24, label: '24' },
                { value: 26, label: '26' },
                { value: 28, label: '28' },
                { value: 30, label: '30' },
                { value: 32, label: '32' }
              ]}
              onChange={(value) => {
                setPartial({ fontSize: value })
              }}
            />
          </div>
          <div className="flex justify-between items-center min-h-8 flex-none">
            <span>{t('borderRadius')}</span>
            <Slider
              min={0}
              max={16}
              defaultValue={borderRadius}
              className="w-36 mr-2"
              marks={{ 0: '0', 12: '12', 16: '16' }}
              onChange={(value) => setPartial({ borderRadius: value })}
            />
          </div>
          <div className="flex justify-between items-center min-h-8 flex-none">
            <span>{t('resetSettings')}</span>
            <Button
              danger
              onClick={() => {
                resetLocalSettings()
              }}
            >
              {t('reset')}
            </Button>
          </div>
          {jwt && (
            <div className="flex justify-between items-center min-h-8 flex-none">
              <span>{t('deleteAccount')}</span>
              <Button
                danger
                onClick={async () => {
                  await deleteAccount()
                  // TODO Logout
                }}
              >
                {t('delete')}
              </Button>
            </div>
          )}
        </div>
      )
    }
  ]

  return (
    <Modal
      title={t('settings')}
      centered
      footer={null}
      open={open}
      onCancel={onCancel}
      className="select-none"
      destroyOnHidden
    >
      <Tabs
        animated
        items={tabItems}
        tabPlacement="start"
        classNames={{
          item: 'pl-0.5',
          header: 'pt-1',
          content: 'p-0'
        }}
      />
    </Modal>
  )
}
