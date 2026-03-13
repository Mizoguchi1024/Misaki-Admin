import api from '../index'
import type { PageResult, Result } from '@/types/result'
import type { AddUserAdminRequest, SearchUserAdminRequest, UpdateUserAdminRequest, UserAdminResponse } from '@/types/user'

export const createUser = (data: AddUserAdminRequest): Promise<Result<void>> =>
  api.post<Result<void>>('/admin/users', data).then((res) => res.data)

export const searchUsers = (
  pageIndex: number,
  pageSize: number,
  sortField?: string,
  sortOrder?: string,
  data?: SearchUserAdminRequest
): Promise<PageResult<UserAdminResponse>> =>
  api.post<PageResult<UserAdminResponse>>('/admin/users/search', data, { params: { pageIndex, pageSize, sortField, sortOrder } }).then((res) => res.data)

export const updateUser = (id: number, data: UpdateUserAdminRequest): Promise<Result<void>> =>
  api.put<Result<void>>(`/admin/users/${id}`, data).then((res) => res.data)

export const deleteUser = (id: number): Promise<Result<void>> =>
  api.delete<Result<void>>(`/admin/users/${id}`).then((res) => res.data)
