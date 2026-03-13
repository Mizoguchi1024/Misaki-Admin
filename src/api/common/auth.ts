import type { LoginRequest, LoginResponse, ResetPasswordRequest } from '@/types/auth'
import type { Result } from '@/types/result'
import api from '../index'

export const login = (data: LoginRequest): Promise<Result<LoginResponse>> =>
  api.post<Result<LoginResponse>>('/auth/login', data).then((res) => res.data)

export const resetPassword = (data: ResetPasswordRequest): Promise<Result<void>> =>
  api.post<Result<void>>('/auth/reset-password', data).then((res) => res.data)

export const sendVerifyCode = (email: string, lang: number): Promise<Result<void>> =>
  api.post<Result<void>>(`/auth/verify/${email}`, { params: { lang } }).then((res) => res.data)
