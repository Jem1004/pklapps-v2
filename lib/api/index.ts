// API Utilities Export
export {
  ApiResponseHelper,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  handleApiError,
  calculatePagination,
  parseQueryParams,
  generateRequestId,
  addCorsHeaders,
  ERROR_CODES
} from './response'

export type {
  ApiResponse,
  PaginationParams,
  PaginationMeta,
  ErrorCode
} from './response'

export {
  withAuth,
  withValidation,
  withQueryValidation,
  withErrorHandling,
  withRateLimit,
  withLogging,
  composeMiddleware,
  withStandardMiddleware,
  withValidatedMiddleware,
  withRateLimitedMiddleware,
  validateResourceOwnership
} from './middleware'

export type {
  AuthenticatedRequest,
  ApiHandler,
  ValidatedApiHandler,
  RoleRequirement
} from './middleware'

// Re-export commonly used utilities
export { default as middleware } from './middleware'