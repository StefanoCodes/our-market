// defin the schema for the klaviyo form
import { z } from 'zod'
import { splitFullName } from '~/lib/utils/utils'

export const klaviyoFormSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .refine((value) => value.trim().includes(' '), {
      message: 'Please enter both your first and last name separated by a space',
    })
    .refine(
      (value) => {
        const nameParts = value
          .trim()
          .split(' ')
          .filter((part) => part.length > 0)
        return nameParts.length >= 2
      },
      {
        message: 'Please enter both your first and last name',
      },
    )
    .transform((value) => value.trim()),
  email: z.string().email('Invalid email address'),
  // phoneNumber: z
  //   .string({
  //     message: 'Phone number is required',
  //   })
  //   .min(10, 'Phone number must be at least 10 digits')
  //   .max(15, 'Phone number is too long')
  //   .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  list_id: z.string().optional(),
})

export type KlaviyoFormData = z.infer<typeof klaviyoFormSchema>
