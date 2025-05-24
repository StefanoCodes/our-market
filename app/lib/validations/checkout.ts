// schema for the checkout page which needs to be in line with uber direct api schema
import { z } from 'zod'

export const checkoutInfoSchema = z.object({
  firstName: z
    .string({
      message: 'First Name is required',
    })
    .min(2, 'First name must be at least 2 characters')
    .trim(),
  lastName: z
    .string({
      message: 'Last Name is required',
    })
    .min(2, 'Last name must be at least 2 characters')
    .trim(),
  phone: z
    .string({
      message: 'Phone number is required',
    })
    .min(10, 'Please enter a valid phone number')
    .trim(),
  address: z
    .string({
      message: 'Address is required',
    })
    .min(5, 'Please enter a valid address')
    .trim(),
  province: z
    .string({
      message: 'Province is required',
    })
    .min(2, 'Please enter a valid province')
    .trim(),
  zipCode: z
    .string({
      message: 'Zip code is required',
    })
    .min(4, 'Zip code must be at least 4 characters')
    .max(5, 'Zip code must be at most 5 characters')
    .trim(),
  country: z
    .string({
      message: 'Country is required',
    })
    .min(2, 'Please enter a valid country')
    .trim(),
})

export const paymentInfoSchema = z.object({
  cardNumber: z
    .string({
      message: 'Card number is required',
    })
    .min(16, 'Please enter a valid card number'),
  cardHolder: z
    .string({
      message: 'Cardholder name is required',
    })
    .min(3, 'Please enter the cardholder name'),
  expiryDate: z
    .string({
      message: 'Expiry date is required',
    })
    .min(5, 'Please enter a valid expiry date'),
  cvv: z
    .string({
      message: 'CVV is required',
    })
    .min(3, 'Please enter a valid CVV'),
})

export type CheckoutInfoFormData = z.infer<typeof checkoutInfoSchema>
export type PaymentInfoFormData = z.infer<typeof paymentInfoSchema>
