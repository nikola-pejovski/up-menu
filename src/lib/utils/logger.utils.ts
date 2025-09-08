import winston from "winston";

export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  HTTP = "http",
  DEBUG = "debug",
}

export interface LogContext {
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  error?: Error;
  [key: string]: unknown;
}

class Logger {
  private logger: winston.Logger;

  constructor() {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.prettyPrint()
    );

    const transports: winston.transport[] = [];

    // Console transport for development
    if (process.env.NODE_ENV === "development") {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        })
      );
    }

    // File transports for production
    if (process.env.NODE_ENV === "production") {
      transports.push(
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
          format: logFormat,
        }),
        new winston.transports.File({
          filename: "logs/combined.log",
          format: logFormat,
        })
      );
    }

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: logFormat,
      transports,
      exceptionHandlers: [
        new winston.transports.File({ filename: "logs/exceptions.log" }),
      ],
      rejectionHandlers: [
        new winston.transports.File({ filename: "logs/rejections.log" }),
      ],
    });
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const baseMessage = `[${level.toUpperCase()}] ${message}`;

    if (context && Object.keys(context).length > 0) {
      return `${baseMessage} | Context: ${JSON.stringify(context)}`;
    }

    return baseMessage;
  }

  error(message: string, context?: LogContext): void {
    this.logger.error(this.formatMessage(LogLevel.ERROR, message, context));
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(this.formatMessage(LogLevel.INFO, message, context));
  }

  http(message: string, context?: LogContext): void {
    this.logger.http(this.formatMessage(LogLevel.HTTP, message, context));
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(this.formatMessage(LogLevel.DEBUG, message, context));
  }

  // Security-specific logging
  securityEvent(event: string, context?: LogContext): void {
    this.warn(`SECURITY: ${event}`, {
      ...context,
      securityEvent: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Authentication logging
  authEvent(event: string, context?: LogContext): void {
    this.info(`AUTH: ${event}`, {
      ...context,
      authEvent: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Database operation logging
  dbEvent(operation: string, context?: LogContext): void {
    this.debug(`DB: ${operation}`, {
      ...context,
      dbEvent: true,
      timestamp: new Date().toISOString(),
    });
  }

  // API request logging
  apiRequest(method: string, url: string, context?: LogContext): void {
    this.http(`${method} ${url}`, {
      ...context,
      apiRequest: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Performance logging
  performance(operation: string, duration: number, context?: LogContext): void {
    this.info(`PERF: ${operation} took ${duration}ms`, {
      ...context,
      performance: true,
      duration,
      timestamp: new Date().toISOString(),
    });
  }
}

// Create singleton instance
export const logger = new Logger();

// Request logging middleware
export function logRequest(
  request: unknown,
  response: unknown,
  next: unknown
): void {
  const start = Date.now();
  const req = request as {
    method: string;
    url: string;
    headers: Record<string, string>;
  };
  const res = response as {
    on: (event: string, callback: () => void) => void;
    statusCode: number;
  };

  logger.apiRequest(req.method, req.url, {
    ip: req.headers["x-forwarded-for"] || req.headers["x-real-ip"],
    userAgent: req.headers["user-agent"],
    requestId: req.headers["x-request-id"],
  });

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.http(`${req.method} ${req.url} ${res.statusCode}`, {
      statusCode: res.statusCode,
      responseTime: duration,
      ip: req.headers["x-forwarded-for"] || req.headers["x-real-ip"],
      userAgent: req.headers["user-agent"],
      requestId: req.headers["x-request-id"],
    });
  });

  if (typeof next === "function") {
    next();
  }
}

// Error logging middleware
export function logError(error: Error, context?: LogContext): void {
  logger.error("Unhandled error", {
    ...context,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  });
}

// Security event logging
export function logSecurityEvent(event: string, context?: LogContext): void {
  logger.securityEvent(event, context);
}

// Authentication event logging
export function logAuthEvent(event: string, context?: LogContext): void {
  logger.authEvent(event, context);
}
