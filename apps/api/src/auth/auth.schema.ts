import { z } from 'zod';

export const registerInputSchema = z
  .object({
    email: z.email().max(254),
    password: z.string().min(8).max(128),
    displayName: z.string().trim().min(1).max(100),
    locale: z.enum(['tr', 'en']).optional(),
    turnstileToken: z.string().optional(),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z
  .object({
    email: z.email().max(254),
    password: z.string().min(1).max(128),
    turnstileToken: z.string().optional(),
  })
  .strict();

export type LoginInput = z.infer<typeof loginInputSchema>;

export const resendVerificationSchema = z
  .object({
    email: z.email().max(254),
  })
  .strict();

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

export const forgotPasswordSchema = z
  .object({
    email: z.email().max(254),
  })
  .strict();

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(16).max(256),
    password: z.string().min(8).max(128),
  })
  .strict();

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  locale: string;
  emailVerified: boolean;
}
