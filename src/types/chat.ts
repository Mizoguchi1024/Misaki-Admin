export type SearchChatAdminRequest = {
  id?: string
  userId?: string
  title?: string
  deleteFlag?: boolean
  createTime?: string
  updateTime?: string
}

export type ChatAdminResponse = {
  id: string
  userId: string
  title: string
  token: number
  deleteFlag: boolean
  createTime: string
  updateTime: string
  version: number
}

export type UpdateChatAdminRequest = {
  title?: string
  token?: number
  deleteFlag?: boolean
  version: number
}
