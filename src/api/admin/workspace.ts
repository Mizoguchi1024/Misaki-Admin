import api from '../index'
import type { Result } from '@/types/result'


export const getWorkspaceData = (): Promise<Result<WorkspaceAdminResponse>> =>
  api.get<Result<WorkspaceAdminResponse>>('/admin/workspace').then((res) => res.data)
