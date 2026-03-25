export type AddAssistantAdminRequest = {
  name: string
  gender: number
  birthday?: string
  personality?: string
  detail?: string
  modelId: string
  creatorId: string
  ownerId: string
  publicFlag: boolean
}

export type SearchAssistantAdminRequest = {
  id?: string
  name?: string
  personality?: string
  detail?: string
  gender?: number
  birthday?: string
  modelId?: number
  creatorId?: number
  ownerId?: number
  publicFlag?: boolean
  deleteFlag?: boolean
  createTime?: string
  updateTime?: string
}

export type AssistantAdminResponse = {
  id: string
  name: string
  gender: number
  birthday: string
  personality: string
  detail: string
  modelId: string
  creatorId: string
  ownerId: string
  publicFlag: boolean
  deleteFlag: boolean
  createTime: string
  updateTime: string
  version: number
}

export type UpdateAssistantAdminRequest = {
  name?: string
  gender?: number
  birthday?: string
  personality?: string
  detail?: string
  modelId?: number
  creatorId?: number
  ownerId?: number
  publicFlag?: boolean
  deleteFlag?: boolean
  version: number
}
