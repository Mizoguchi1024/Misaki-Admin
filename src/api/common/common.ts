import type { UploadResponse } from '@/types/common'
import type { Result } from '@/types/result'
import api from '../index'

export const upload = (data: FormData): Promise<Result<UploadResponse>> =>
  api.post<Result<UploadResponse>>('/common/files', data).then((res) => res.data)

