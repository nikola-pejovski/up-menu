// Export all middleware
export * from "./auth.middleware";
export * from "./security.middleware";

// Re-export commonly used middleware
export {
  authenticate,
  authorize,
  adminOnly,
  managerOrAdmin,
  optionalAuthenticate,
  getUserFromRequest,
  hasRole,
  isAdmin,
  isManagerOrAdmin,
  type AuthenticatedRequest,
} from "./auth.middleware";

export {
  securityHeaders,
  csrfProtection,
  rateLimit,
  sanitizeInput,
  requestLogger,
  combineMiddleware,
} from "./security.middleware";
