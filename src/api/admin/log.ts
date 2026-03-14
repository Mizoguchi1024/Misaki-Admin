import api from '../index'
import type { PageResult, Result } from '@/types/result'
import type {
  SearchEmailLogAdminRequest,
  SearchExceptionLogAdminRequest,
  EmailLogAdminResponse,
  ExceptionLogAdminResponse
} from '@/types/log'

export const searchEmailLogs = (
  pageIndex: number,
  pageSize: number,
  sortField?: string,
  sortOrder?: string,
  data?: SearchEmailLogAdminRequest
): Promise<PageResult<EmailLogAdminResponse[]>> =>
  api
    .post<
      PageResult<EmailLogAdminResponse[]>
    >('/admin/logs/email/search', data, { params: { pageIndex, pageSize, sortField, sortOrder } })
    .then((res) => res.data)

export const deleteEmailLogs = (date: string): Promise<Result<void>> =>
  api.delete<Result<void>>('/admin/logs/email', { params: { date } }).then((res) => res.data)

export const searchExceptionLogs = (
  pageIndex: number,
  pageSize: number,
  sortField?: string,
  sortOrder?: string,
  data?: SearchExceptionLogAdminRequest
): Promise<PageResult<ExceptionLogAdminResponse[]>> =>
  api
    .post<
      PageResult<ExceptionLogAdminResponse[]>
    >('/admin/logs/exception/search', data, { params: { pageIndex, pageSize, sortField, sortOrder } })
    .then((res) => res.data)

export const deleteExceptionLogs = (date: string): Promise<Result<void>> =>
  api.delete<Result<void>>('/admin/logs/exception', { params: { date } }).then((res) => res.data)
