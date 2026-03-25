import type { McpServerAdminResponse } from "@/types/mcp";
import type { Result } from "@/types/result";
import api from "..";

export const listMcpServers = (): Promise<Result<McpServerAdminResponse[]>> =>
  api.get<Result<McpServerAdminResponse[]>>('/admin/mcp').then((res) => res.data)
