// zod schema for the create review form
import { z } from 'zod'
export const createReviewSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1, { message: 'Name is required' }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  body: z
    .string({ required_error: 'Review is required' })
    .min(1, { message: 'Review is required' })
    .max(1000, { message: 'Review must be less than 1000 characters' }),
  rating: z.coerce
    .number({ required_error: 'Rating is required', invalid_type_error: 'Rating is required' })
    .min(1, { message: 'Rating is required' })
    .max(5, { message: 'Rating must be between 1 and 5' }),
  pictureUrls: z.string().array().optional().nullable(),
})

export type CreateReviewSchemaType = z.infer<typeof createReviewSchema>
