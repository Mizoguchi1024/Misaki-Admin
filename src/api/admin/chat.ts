import api from '../index'
import type { PageResult, Result } from '@/types/result'
import type { SearchChatAdminRequest, UpdateChatAdminRequest, ChatAdminResponse } from '@/types/chat'

export const searchChats = (
  pageIndex: number,
  pageSize: number,
  sortField?: string,
  sortOrder?: string,
  data?: SearchChatAdminRequest
): Promise<PageResult<ChatAdminResponse>> =>
  api.post<PageResult<ChatAdminResponse>>('/admin/chats/search', data, { params: { pageIndex, pageSize, sortField, sortOrder } }).then((res) => res.data)

export const updateChat = (id: number, data: UpdateChatAdminRequest): Promise<Result<void>> =>
  api.put<Result<void>>(`/admin/chats/${id}`, data).then((res) => res.data)

export const deleteChat = (id: number): Promise<Result<void>> =>
  api.delete<Result<void>>(`/admin/chats/${id}`).then((res) => res.data)
