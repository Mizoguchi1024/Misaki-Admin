import api from '../index'
import type { Result } from '@/types/result'
import type { WorkspaceAdminResponse } from '@/types/workspace'

export const getWorkspaceData = (
  range: string
): Promise<Result<WorkspaceAdminResponse>> =>
  api
    .get<Result<WorkspaceAdminResponse>>('/admin/workspace', { params: { range } })
    .then((res) => res.data)
