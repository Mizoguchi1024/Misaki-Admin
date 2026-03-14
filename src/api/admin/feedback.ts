import api from '../index'
import type { PageResult, Result } from '@/types/result'
import type { SearchFeedbackAdminRequest, UpdateFeedbackAdminRequest, FeedbackAdminResponse } from '@/types/feedback'

export const searchFeedbacks = (
  pageIndex: number,
  pageSize: number,
  sortField?: string,
  sortOrder?: string,
  data?: SearchFeedbackAdminRequest
): Promise<PageResult<FeedbackAdminResponse[]>> =>
  api.post<PageResult<FeedbackAdminResponse[]>>('/admin/feedbacks/search', data, { params: { pageIndex, pageSize, sortField, sortOrder } }).then((res) => res.data)

export const updateFeedback = (id: string, data: UpdateFeedbackAdminRequest): Promise<Result<void>> =>
  api.put<Result<void>>(`/admin/feedbacks/${id}`, data).then((res) => res.data)

export const deleteFeedback = (id: string): Promise<Result<void>> =>
  api.delete<Result<void>>(`/admin/feedbacks/${id}`).then((res) => res.data)
