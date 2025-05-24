import { PhoneNumber } from 'react-phone-number-input'
import { z } from 'zod'

export const customerUpdateSchema = z.object({
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

export const addressSchema = z.object({
  address1: z.string({ message: 'Address is required' }).min(1, { message: 'Address is required' }),
  address2: z.string().optional(),
  city: z.string({ message: 'City is required' }).min(1, { message: 'City is required' }),
  company: z.string().optional(),
  firstName: z.string({ message: 'First name is required' }).min(1, { message: 'First name is required' }),
  lastName: z.string({ message: 'Last name is required' }).min(1, { message: 'Last name is required' }),
  phoneNumber: z.string({ message: 'Phone number is required' }).min(1, { message: 'Phone number is required' }),
  territoryCode: z
    .string({ message: 'Country is required' })
    .min(2, { message: 'Please select a country' })
    .max(2, { message: 'Invalid country code' }),
  zip: z.string({ message: 'Zip code is required' }).min(1, {
    message: 'Zip Code is required'
  }),
  zoneCode: z.string().min(1, {
    message: 'Province is required'
  }),
})
export const deleteAddressSchema = z.object({
  addressId: z.string({ message: 'Address ID is required' }).min(1),
})

export type CustomerUpdateSchemaType = z.infer<typeof customerUpdateSchema>

export type AddressSchemaType = z.infer<typeof addressSchema>

export type DeleteAddressSchemaType = z.infer<typeof deleteAddressSchema>
