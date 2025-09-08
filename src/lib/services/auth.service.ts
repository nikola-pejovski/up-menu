import { AdminUser, UserRole, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { AuthUtils, TokenPair } from "@/lib/utils/auth.utils";
import {
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} from "@/lib/utils/error.utils";
import {
  LoginInput,
  RegisterInput,
  ChangePasswordInput,
  ResetPasswordRequestInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from "@/lib/validations/auth.schema";

export interface AuthResult {
  user: Omit<AdminUser, "password">;
  tokens: TokenPair;
}

export interface SessionInfo {
  id: string;
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  expiresAt: Date;
}

export class AuthService {
  /**
   * Authenticate user with email and password
   */
  async login(
    credentials: LoginInput,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuthResult> {
    const { email, password } = credentials;

    // Find user by email
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Check if user is active
    if (user.status !== "ACTIVE") {
      throw new UnauthorizedError("Account is not active");
    }

    // Verify password
    const isValidPassword = await AuthUtils.comparePassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Generate tokens
    const tokens = AuthUtils.generateTokens(user);

    // Create session
    await this.createSession(
      user.id,
      tokens.refreshToken,
      ipAddress,
      userAgent
    );

    // Update last login
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Log login activity
    await this.logActivity(user.id, "LOGIN", "AdminUser", user.id, null, {
      ipAddress,
      userAgent,
    });

    const { password: _password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  /**
   * Register new admin user
   */
  async register(
    userData: RegisterInput
  ): Promise<Omit<AdminUser, "password">> {
    const { name, email, password, role } = userData;

    // Check if user already exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(password);

    // Create user
    const user = await prisma.adminUser.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        status: "ACTIVE",
      },
    });

    // Log registration activity
    await this.logActivity(user.id, "CREATE", "AdminUser", user.id, null, {
      email,
      role,
    });

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    // Verify refresh token
    AuthUtils.verifyRefreshToken(refreshToken);

    // Find active session
    const session = await prisma.session.findFirst({
      where: {
        refreshToken,
        status: "ACTIVE",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    // Check if user is still active
    if (session.user.status !== "ACTIVE") {
      throw new UnauthorizedError("User account is not active");
    }

    // Generate new tokens
    const tokens = AuthUtils.generateTokens(session.user);

    // Update session with new refresh token
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        updatedAt: new Date(),
      },
    });

    return tokens;
  }

  /**
   * Logout user by invalidating session
   */
  async logout(sessionId: string, userId: string): Promise<void> {
    // Update session status
    await prisma.session.updateMany({
      where: {
        id: sessionId,
        userId,
        status: "ACTIVE",
      },
      data: {
        status: "REVOKED",
        updatedAt: new Date(),
      },
    });

    // Log logout activity
    await this.logActivity(userId, "LOGOUT", "AdminUser", userId, null, {
      sessionId,
    });
  }

  /**
   * Logout from all devices
   */
  async logoutAllDevices(userId: string): Promise<void> {
    // Revoke all active sessions
    await prisma.session.updateMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      data: {
        status: "REVOKED",
        updatedAt: new Date(),
      },
    });

    // Log logout all activity
    await this.logActivity(userId, "LOGOUT", "AdminUser", userId, null, {
      allDevices: true,
    });
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    passwordData: ChangePasswordInput
  ): Promise<void> {
    const { currentPassword, newPassword } = passwordData;

    // Get user
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Verify current password
    const isValidPassword = await AuthUtils.comparePassword(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    // Hash new password
    const hashedNewPassword = await AuthUtils.hashPassword(newPassword);

    // Update password
    await prisma.adminUser.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    // Log password change activity
    await this.logActivity(
      userId,
      "PASSWORD_CHANGE",
      "AdminUser",
      userId,
      null,
      {}
    );
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(data: ResetPasswordRequestInput): Promise<void> {
    const { email } = data;

    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    // Generate reset token
    const resetToken = AuthUtils.generatePasswordResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });

    // TODO: Send email with reset link
    // For now, we'll just log it (in production, send email)
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  /**
   * Reset password using reset token
   */
  async resetPassword(data: ResetPasswordInput): Promise<void> {
    const { token, password } = data;

    // Find valid reset token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!resetToken) {
      throw new UnauthorizedError("Invalid or expired reset token");
    }

    // Hash new password
    const hashedPassword = await AuthUtils.hashPassword(password);

    // Update user password
    await prisma.adminUser.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Mark reset token as used
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    // Revoke all existing sessions
    await prisma.session.updateMany({
      where: {
        userId: resetToken.userId,
        status: "ACTIVE",
      },
      data: {
        status: "REVOKED",
        updatedAt: new Date(),
      },
    });

    // Log password reset activity
    await this.logActivity(
      resetToken.userId,
      "PASSWORD_CHANGE",
      "AdminUser",
      resetToken.userId,
      null,
      { viaReset: true }
    );
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updateData: UpdateProfileInput
  ): Promise<Omit<AdminUser, "password">> {
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Check if email is being changed and if it's already taken
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await prisma.adminUser.findUnique({
        where: { email: updateData.email },
      });

      if (existingUser) {
        throw new ConflictError("Email is already taken");
      }
    }

    // Update user
    const updatedUser = await prisma.adminUser.update({
      where: { id: userId },
      data: updateData,
    });

    // Log profile update activity
    await this.logActivity(
      userId,
      "UPDATE",
      "AdminUser",
      userId,
      user,
      updatedUser
    );

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Get user sessions
   */
  async getUserSessions(userId: string): Promise<SessionInfo[]> {
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        status: "ACTIVE",
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        userId: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return sessions;
  }

  /**
   * Create user session
   */
  private async createSession(
    userId: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({
      data: {
        userId,
        token: AuthUtils.generateSecureToken(),
        refreshToken,
        expiresAt,
        ipAddress,
        userAgent,
        status: "ACTIVE",
      },
    });
  }

  /**
   * Log user activity
   */
  private async logActivity(
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    oldValues: unknown,
    newValues: unknown,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await prisma.auditLog.create({
      data: {
        userId,
        action: action as
          | "CREATE"
          | "UPDATE"
          | "DELETE"
          | "LOGIN"
          | "LOGOUT"
          | "PASSWORD_CHANGE"
          | "ROLE_CHANGE",
        resourceType,
        resourceId,
        oldValues: oldValues as Prisma.InputJsonValue,
        newValues: newValues as Prisma.InputJsonValue,
        ipAddress,
        userAgent,
      },
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(
    userId: string
  ): Promise<Omit<AdminUser, "password"> | null> {
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Verify user has required role
   */
  async verifyUserRole(
    userId: string,
    requiredRole: UserRole
  ): Promise<boolean> {
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return false;
    }

    return AuthUtils.hasRole(user.role, requiredRole);
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<Omit<AdminUser, "password">[]> {
    const users = await prisma.adminUser.findMany({
      orderBy: { createdAt: "desc" },
    });

    return users.map(({ password: _password, ...user }) => user);
  }

  /**
   * Create a new user (admin only)
   */
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<Omit<AdminUser, "password">> {
    // Check if user already exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(data.password);

    // Create user
    const user = await prisma.adminUser.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        status: "ACTIVE",
      },
    });

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user (admin only)
   */
  async updateUser(
    userId: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
      status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    }
  ): Promise<Omit<AdminUser, "password">> {
    // Check if user exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.adminUser.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new ConflictError("User with this email already exists");
      }
    }

    // Prepare update data
    const updateData: any = { ...data };

    // Hash password if provided
    if (data.password) {
      updateData.password = await AuthUtils.hashPassword(data.password);
    }

    // Update user
    const user = await prisma.adminUser.update({
      where: { id: userId },
      data: updateData,
    });

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<void> {
    // Check if user exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    // Delete user
    await prisma.adminUser.delete({
      where: { id: userId },
    });
  }
}
