export type AddModelAdminRequest = {
  name: string
  grade: number
  price: number
  path: string
  avatarPath: string
  onSaleFlag: boolean
}

export type SearchModelAdminRequest = {
  id?: string
  name?: string
  grade?: number
  price?: number
  createTime?: string
}

export type ModelAdminResponse = {
  id: string
  name: string
  grade: number
  price: number
  path: string
  avatarPath: string
  onSaleFlag: boolean
  createTime: string
  version: number
}

export type UpdateModelAdminRequest = {
  name?: string
  grade?: number
  price?: number
  path?: string
  avatarPath?: string
  onSaleFlag?: boolean
  version: number
}