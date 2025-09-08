import sanitizeHtml from "sanitize-html";
import validator from "validator";

export class SanitizationUtils {
  /**
   * Sanitize HTML content
   */
  static sanitizeHtml(html: string): string {
    return sanitizeHtml(html, {
      allowedTags: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li"],
      allowedAttributes: {},
      disallowedTagsMode: "discard",
    });
  }

  /**
   * Sanitize plain text
   */
  static sanitizeText(text: string): string {
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .replace(/[<>]/g, "")
      .trim();
  }

  /**
   * Sanitize email
   */
  static sanitizeEmail(email: string): string {
    return validator.normalizeEmail(email) || email;
  }

  /**
   * Sanitize URL
   */
  static sanitizeUrl(url: string): string {
    if (!validator.isURL(url, { require_protocol: true })) {
      throw new Error("Invalid URL");
    }
    return url;
  }

  /**
   * Sanitize phone number
   */
  static sanitizePhone(phone: string): string {
    return validator.normalizeEmail(phone) || phone;
  }

  /**
   * Sanitize object properties
   */
  static sanitizeObject<T extends Record<string, unknown>>(
    obj: T,
    rules: Partial<Record<keyof T, "html" | "text" | "email" | "url">>
  ): T {
    const sanitized = { ...obj } as Record<string, unknown>;

    for (const [key, rule] of Object.entries(rules)) {
      if (typeof sanitized[key] === "string") {
        switch (rule) {
          case "html":
            sanitized[key] = this.sanitizeHtml(sanitized[key] as string);
            break;
          case "text":
            sanitized[key] = this.sanitizeText(sanitized[key] as string);
            break;
          case "email":
            sanitized[key] = this.sanitizeEmail(sanitized[key] as string);
            break;
          case "url":
            sanitized[key] = this.sanitizeUrl(sanitized[key] as string);
            break;
        }
      }
    }

    return sanitized as T;
  }

  /**
   * Validate and sanitize file upload
   */
  static validateFileUpload(
    file: File,
    options: {
      maxSize?: number;
      allowedTypes?: string[];
      allowedExtensions?: string[];
    } = {}
  ): { isValid: boolean; error?: string } {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ["image/jpeg", "image/png", "image/webp"],
      allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"],
    } = options;

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
      };
    }

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed`,
      };
    }

    // Check file extension
    const extension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));
    if (!allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `File extension ${extension} is not allowed`,
      };
    }

    return { isValid: true };
  }

  /**
   * Generate secure filename
   */
  static generateSecureFilename(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalName.substring(originalName.lastIndexOf("."));
    return `${timestamp}_${random}${extension}`;
  }

  /**
   * Validate SQL injection patterns
   */
  static containsSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(--|\#|\/\*|\*\/)/,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(\b(OR|AND)\s+['"]\s*=\s*['"])/i,
      /(\bUNION\s+SELECT\b)/i,
      /(\bDROP\s+TABLE\b)/i,
      /(\bDELETE\s+FROM\b)/i,
      /(\bINSERT\s+INTO\b)/i,
      /(\bUPDATE\s+SET\b)/i,
    ];

    return sqlPatterns.some((pattern) => pattern.test(input));
  }

  /**
   * Validate XSS patterns
   */
  static containsXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
      /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi,
    ];

    return xssPatterns.some((pattern) => pattern.test(input));
  }

  /**
   * Comprehensive input validation
   */
  static validateInput(
    input: string,
    type: "text" | "email" | "url" | "html"
  ): {
    isValid: boolean;
    sanitized?: string;
    errors: string[];
  } {
    const errors: string[] = [];
    let sanitized = input;

    // Check for SQL injection
    if (this.containsSQLInjection(input)) {
      errors.push("Input contains potential SQL injection");
    }

    // Check for XSS
    if (this.containsXSS(input)) {
      errors.push("Input contains potential XSS");
    }

    // Type-specific validation
    switch (type) {
      case "email":
        if (!validator.isEmail(input)) {
          errors.push("Invalid email format");
        } else {
          sanitized = this.sanitizeEmail(input);
        }
        break;
      case "url":
        if (!validator.isURL(input)) {
          errors.push("Invalid URL format");
        } else {
          sanitized = this.sanitizeUrl(input);
        }
        break;
      case "html":
        sanitized = this.sanitizeHtml(input);
        break;
      case "text":
      default:
        sanitized = this.sanitizeText(input);
        break;
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors,
    };
  }
}
