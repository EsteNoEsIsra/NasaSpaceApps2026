// Shared TypeScript types

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}
