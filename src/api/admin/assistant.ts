import api from '../index'
import type { PageResult, Result } from '@/types/result'
import type { AddAssistantAdminRequest, SearchAssistantAdminRequest, UpdateAssistantAdminRequest, AssistantAdminResponse } from '@/types/assistant'

export const createAssistant = (data: AddAssistantAdminRequest): Promise<Result<void>> =>
  api.post<Result<void>>('/admin/assistants', data).then((res) => res.data)

export const searchAssistants = (
  pageIndex: number,
  pageSize: number,
  sortField?: string,
  sortOrder?: string,
  data?: SearchAssistantAdminRequest
): Promise<PageResult<AssistantAdminResponse[]>> =>
  api.post<PageResult<AssistantAdminResponse[]>>('/admin/assistants/search', data, { params: { pageIndex, pageSize, sortField, sortOrder } }).then((res) => res.data)

export const updateAssistant = (id: number, data: UpdateAssistantAdminRequest): Promise<Result<void>> =>
  api.put<Result<void>>(`/admin/assistants/${id}`, data).then((res) => res.data)

export const deleteAssistant = (id: number): Promise<Result<void>> =>
  api.delete<Result<void>>(`/admin/assistants/${id}`).then((res) => res.data)
