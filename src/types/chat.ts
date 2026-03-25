export type SearchChatAdminRequest = {
  id?: string
  userId?: string
  title?: string
  pinnedFlag?: boolean
  deleteFlag?: boolean
  createTime?: string
  updateTime?: string
}

export type ChatAdminResponse = {
  id: string
  userId: string
  title: string
  token: number
  pinnedFlag: boolean
  deleteFlag: boolean
  createTime: string
  updateTime: string
  version: number
}

export type UpdateChatAdminRequest = {
  title?: string
  pinnedFlag?: boolean
  deleteFlag?: boolean
  version: number
}
