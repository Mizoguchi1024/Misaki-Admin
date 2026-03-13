export type WorkspaceAdminResponse = {
  mcpStats: McpStatsAdminResponse
  userStats: UserStatsAdminResponse
  assistantStats: AssistantStatsAdminResponse
  chatStats: ChatStatsAdminResponse
  feedbackStats: FeedbackStatsAdminResponse
}

export type McpStatsAdminResponse = {
  totalServers: number
  totalTools: number
}

export type UserStatsAdminResponse = {
  totalUsers: number
  newUsers: number
}

export type AssistantStatsAdminResponse = {
  totalPublicAssistants: number
  totalAssistants: number
  newAssistants: number
}

export type ChatStatsAdminResponse = {
  totalChats: number
  newChats: number
}

export type FeedbackStatsAdminResponse = {
  newFeedbacks: number
  processingFeedbacks: number
}