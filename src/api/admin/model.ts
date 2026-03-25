import api from '../index'
import type { PageResult, Result } from '@/types/result'
import type { AddModelAdminRequest, SearchModelAdminRequest, UpdateModelAdminRequest, ModelAdminResponse } from '@/types/model'

export const createModel = (data: AddModelAdminRequest): Promise<Result<void>> =>
  api.post<Result<void>>('/admin/models', data).then((res) => res.data)

export const searchModels = (
  pageIndex: number,
  pageSize: number,
  sortField?: string,
  sortOrder?: string,
  data?: SearchModelAdminRequest
): Promise<PageResult<ModelAdminResponse[]>> =>
  api.post<PageResult<ModelAdminResponse[]>>('/admin/models/search', data, { params: { pageIndex, pageSize, sortField, sortOrder } }).then((res) => res.data)

export const updateModel = (id: string, data: UpdateModelAdminRequest): Promise<Result<void>> =>
  api.put<Result<void>>(`/admin/models/${id}`, data).then((res) => res.data)

export const deleteModel = (id: string): Promise<Result<void>> =>
  api.delete<Result<void>>(`/admin/models/${id}`).then((res) => res.data)
