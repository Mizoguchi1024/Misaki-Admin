import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import zh_CN from 'antd/locale/zh_CN'
import en_US from 'antd/locale/en_US'
import ja_JP from 'antd/locale/ja_JP'
import type { MessageInstance } from 'antd/es/message/interface'

interface SettingsState {
  staticMessage: MessageInstance | null

  language: number // 0:中文 1:英文 2:日文
  fontSize: number
  appearance: number // 0:跟随系统 1:浅色 2:暗色
  borderRadius: number

  setStaticMessage: (staticMessage: MessageInstance) => void
  setPartial: (patch: Partial<SettingsState>) => void

  reset: () => void
  resetLocalSettings: () => void
}

const initialState = {
  staticMessage: null,
  appearance: 0,
  language: 0,
  fontSize: 14,
  borderRadius: 12
}

const initialLocalState = {
  language: 0,
  fontSize: 14,
  appearance: 0,
  borderRadius: 12
}

export const LanguageI18nMap = {
  [0]: 'zh',
  [1]: 'en',
  [2]: 'jp'
}

export const LanguageAntdMap = {
  [0]: zh_CN,
  [1]: en_US,
  [2]: ja_JP
}

export const LanguageMap = {
  [0]: '中文',
  [1]: 'English',
  [2]: '日本語'
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      setStaticMessage: (staticMessage) => set({ staticMessage }),
      setPartial: (patch) => set((state) => ({ ...state, ...patch })),
      reset: () => set(initialState),
      resetLocalSettings: () => set(initialLocalState)
    }),
    {
      name: 'settings-store'
    }
  )
)