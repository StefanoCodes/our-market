// zod schemas defined here to be cross-checked on the client & server

import { z } from 'zod'
// step 0 => Login Validation Schema
export const loginSchema = z.object({
  loginEmail: z
    .string({
      message: 'Email is required',
    })
    .email('Invalid email address')
    .min(1, 'Email is required'),
  loginPassword: z
    .string({
      message: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters'),
})
//
export const forgotPasswordSchema = z.object({
  forgotPasswordEmail: z
    .string({
      message: 'Email is required',
    })
    .email('Invalid email address')
    .min(1, 'Email is required'),
})

export const verificationSchema = z.object({
  code: z
    .string({
      message: 'Code is required',
    })
    .min(4, 'Verification code must be 4 characters'),
})

export const passwordSchema = z
  .object({
    password: z
      .string({
        message: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string({
        message: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
// step 4 => sign up validation schema first step of the initial sign up flow
export const signupSchema = z.object({
  firstName: z
    .string({
      message: 'First name is required',
    })
    .min(2, {
      message: 'First name is required',
    }),
  email: z
    .string({
      message: 'Email is required',
    })
    .email('Invalid email address')
    .min(1, 'Email is required'),
  phoneNumber: z
    .string({
      message: 'Phone number is required',
    })
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
})

// Add type definitions for the form data
export type LoginFormData = z.infer<typeof loginSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type VerificationFormData = z.infer<typeof verificationSchema>
export type PasswordFormData = z.infer<typeof passwordSchema>
export type SignupFormData = z.infer<typeof signupSchema>
