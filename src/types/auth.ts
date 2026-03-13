export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  jwt: string
  authRole: number
}

export type ResetPasswordRequest = {
  email: string
  password: string
  verifyCode: string
}
