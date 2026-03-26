export type WorkspaceAdminResponse = {
  mcpStats: McpStats
  userStats: UserStats
  assistantStats: AssistantStats
  chatStats: ChatStats
  feedbackStats: FeedbackStats
  aiBalance: AiBalance
}

export type McpStats = {
  totalServers: number
  totalTools: number
}

export type UserStats = {
  totalUsers: number
  newUsers: number
}

export type AssistantStats = {
  totalPublicAssistants: number
  totalAssistants: number
  newAssistants: number
}

export type ChatStats = {
  totalChats: number
  newChats: number
}

export type FeedbackStats = {
  newFeedbacks: number
  processingFeedbacks: number
}

export type AiBalance = {
  isAvailable: boolean
  balance: string
  currency: string
}