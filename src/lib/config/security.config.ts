export const securityConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  // Password Configuration
  password: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12"),
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "X-Requested-With",
    ],
  },

  // Security Headers
  headers: {
    contentSecurityPolicy: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "https:"],
      "font-src": ["'self'"],
      "connect-src": ["'self'"],
      "frame-ancestors": ["'none'"],
      "base-uri": ["'self'"],
      "form-action": ["'self'"],
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  },

  // File Upload Security
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || "10485760"), // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    uploadDir: process.env.UPLOAD_DIR || "./public/uploads",
  },

  // Session Security
  session: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict" as const,
  },

  // CSRF Protection
  csrf: {
    enabled: process.env.ENABLE_CSRF_PROTECTION === "true",
    tokenLength: 32,
    cookieName: "csrf-token",
    headerName: "x-csrf-token",
  },

  // Security Features
  features: {
    securityHeaders: process.env.ENABLE_SECURITY_HEADERS === "true",
    rateLimiting: process.env.ENABLE_RATE_LIMITING === "true",
    requestLogging: process.env.ENABLE_REQUEST_LOGGING === "true",
    securityLogging: process.env.ENABLE_SECURITY_LOGGING === "true",
  },

  // Input Validation
  validation: {
    maxStringLength: 1000,
    maxArrayLength: 100,
    maxObjectDepth: 10,
    sanitizeHtml: true,
    sanitizeText: true,
  },

  // Database Security
  database: {
    connectionLimit: 10,
    queryTimeout: 30000, // 30 seconds
    enableLogging: process.env.NODE_ENV === "development",
  },

  // Redis Security
  redis: {
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === "true",
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
  },
} as const;

// Validation function to ensure all required environment variables are set
export function validateSecurityConfig(): void {
  const required = ["JWT_SECRET", "JWT_REFRESH_SECRET", "DATABASE_URL"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET!.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
  }

  if (process.env.JWT_REFRESH_SECRET!.length < 32) {
    throw new Error("JWT_REFRESH_SECRET must be at least 32 characters long");
  }
}

// Generate secure secrets for development
export function generateSecureSecrets(): {
  jwtSecret: string;
  jwtRefreshSecret: string;
  nextAuthSecret: string;
} {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto");

  return {
    jwtSecret: crypto.randomBytes(64).toString("hex"),
    jwtRefreshSecret: crypto.randomBytes(64).toString("hex"),
    nextAuthSecret: crypto.randomBytes(32).toString("hex"),
  };
}
