export type McpServerAdminResponse = {
  name: string
  tools: McpToolAdminResponse[]
}

export type McpToolAdminResponse = {
  name: string
  description: string
}