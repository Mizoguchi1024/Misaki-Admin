export type AddAssistantAdminRequest = {
  name: string
  personality?: string
  detail?: string
  gender: number
  birthday?: string
  modelId: number
  creatorId: number
  ownerId: number
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
  personality: string
  detail: string
  gender: number
  birthday: string
  modelId: number
  creatorId: number
  ownerId: number
  publicFlag: boolean
  deleteFlag: boolean
  createTime: string
  updateTime: string
  version: number
}

export type UpdateAssistantAdminRequest = {
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
  version: number
}
