import { z } from 'zod'

// enums

const languageEnum = z.enum(['English', 'Français', 'عربي'], {
  message: 'Please Select a Language',
})
const dietaryEnum = z.enum(
  [
    'Halal',
    'Keto',
    'Diabetes-Friendly',
    'Vegetarian',
    'Vegan',
    'Paleo',
    'Gluten-Free',
    'Low-Sodium',
    'Dairy-Free',
    'Kosher',
    'FODMAP-Friendly',
    'Rastafarian',
  ],
  {
    message: 'Please Select a preference',
  },
)

// Schemas

export const welcomeFlowAccountSchema = z.object({
  firstName: z
    .string({ message: 'First name is required' })
    .min(1)
    .trim()
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()),
  lastName: z
    .string({ message: 'Last name is required' })
    .min(1)
    .trim()
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()),
  phoneNumber: z
    .string({
      message: 'Phone number is required',
    })
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
})

export const welcomeFlowLanguageSchema = z.object({
  language: languageEnum,
})

export const welcomeFlowCountrySchema = z.object({
  country: z.string().min(1, 'Please Select a Country'),
})

export const welcomeFlowBirthOfDateSchema = z.object({
  date: z
    .string()
    .min(1, 'Please Select a Birth Date')
    .refine(
      (val) => {
        return /^\d{4}-\d{2}-\d{2}$/.test(val)
      },
      {
        message: 'Invalid date format, must be YYYY-MM-DD',
      },
    ),
})

export const welcomeFlowDietarySchema = z.object({
  dietary: z.array(dietaryEnum).min(1, 'Please select at least one dietary preference'),
})

// Types
export type welcomeFlowAccountSchema = z.infer<typeof welcomeFlowAccountSchema>
export type welcomeFlowLanguageSchemaType = z.infer<typeof welcomeFlowLanguageSchema>
export type welcomeFlowCountrySchemaType = z.infer<typeof welcomeFlowCountrySchema>
export type welcomeFlowBirthOfDateSchemaType = z.infer<typeof welcomeFlowBirthOfDateSchema>
export type welcomeFlowDietarySchemaType = z.infer<typeof welcomeFlowDietarySchema>
