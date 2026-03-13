import type { Result } from '@/types/result'
import type { UserFrontResponse, UpdateUserFrontRequest } from '@/types/user'
import api from '../index'

export const getProfile = (): Promise<Result<UserFrontResponse>> =>
  api.get<Result<UserFrontResponse>>('/front/users/profiles').then((res) => res.data)

export const updateProfile = (data: UpdateUserFrontRequest): Promise<Result<void>> =>
  api.put<Result<void>>('/front/users/profiles', data).then((res) => res.data)

export const deleteAccount = (): Promise<Result<void>> =>
  api.delete<Result<void>>('/front/users').then((res) => res.data)
