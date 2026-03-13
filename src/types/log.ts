export type SearchEmailLogAdminRequest = {
  id?: string
  sender?: string
  receiver?: string
  subject?: string
  createTime?: string
}

export type EmailLogAdminResponse = {
  id: string
  sender: string
  receiver: string
  subject: string
  createTime: string
}

export type SearchExceptionLogAdminRequest = {
  id?: string
  exception?: string
  message?: string
  ip?: string
  uri?: string
  method?: string
  createTime?: string
}

export type ExceptionLogAdminResponse = {
  id: string
  exception: string
  message: string
  ip: string
  uri: string
  method: string
  createTime: string
}
