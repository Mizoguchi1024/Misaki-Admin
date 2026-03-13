export type SearchFeedbackAdminRequest = {
  id?: string
  userId?: string
  replierId?: string
  type?: number
  title?: string
  content?: string
  reply?: string
  status?: number
  deleteFlag?: boolean
  createTime?: string
  updateTime?: string
}

export type FeedbackAdminResponse = {
  id: string
  userId: string
  replierId: string
  type: number
  title: string
  content: string
  reply: string
  status: number
  deleteFlag: boolean
  createTime: string
  updateTime: string
  version: number
}

export type UpdateFeedbackAdminRequest = {
  replierId?: string
  type?: number
  title?: string
  content?: string
  reply?: string
  status?: number
  deleteFlag?: boolean
  version: number
}
