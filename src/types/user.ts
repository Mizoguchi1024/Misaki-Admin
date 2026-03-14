export type UpdateUserFrontRequest = {
  username?: string
  gender?: number
  birthday?: string
  avatarPath?: string
  occupation?: string
  detail?: string
  version: number
}

export type UserFrontResponse = {
  id: string
  email: string
  username: string
  gender: number
  birthday: string
  avatarPath: string
  occupation: string
  detail: string
  token: number
  crystal: number
  puzzle: number
  stardust: number
  lastLoginTime: string
  lastCheckInDate: string
  createTime: string
  version: number
}

export type AddUserAdminRequest = {
  authRole: number
  email: string
  password: string
  username: string
  gender: number
  birthday?: string
  avatarPath?: string
  occupation?: string
  detail?: string
}

export type SearchUserAdminRequest ={
  id?: string
  authRole?: number
  email?: string
  username?: string
  gender?: number
  birthday?: string
  occupation?: string
  detail?: string
  lastCheckInDate?: string
  lastLoginTime?: string
  deletePendingFlag?: boolean
  deleteFlag?: boolean
  createTime?: string
  updateTime?: string
}

export type UserAdminResponse = {
  id: string,
  email: string,
  username: string,
  gender: number,
  birthday: string,
  avatarPath: string,
  occupation: string,
  detail: string,
  authRole: number,
  token: string,
  crystal: number,
  puzzle: number,
  stardust: number,
  lastLoginTime: string,
  lastCheckInDate: string,
  deletePendingFlag: boolean,
  deleteFlag: boolean,
  createTime: string,
  updateTime: string,
  version: number
}

export type UpdateUserAdminRequest ={
  email?: string
  password?: string
  username?: string
  gender?: number
  birthday?: string
  avatarPath?: string
  occupation?: string
  detail?: string
  authRole?: number
  lastLoginTime?: string
  token?: number
  crystal?: number
  puzzle?: number
  stardust?: number
  lastCheckInDate?: string
  deletePendingFlag?: boolean
  deleteFlag?: boolean
  version: number
}