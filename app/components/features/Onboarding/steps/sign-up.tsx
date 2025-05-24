import { SignupFormData } from '~/lib/validations/onboarding'
import CustomInput from '../input'
import CustomLabel from '../label'
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { PhoneInput } from '~/components/ui/phone-input'
import { UseFormReturn } from 'react-hook-form'

interface PersonalInfoProps {
  error?: {
    firstName?: string
    phoneNumber?: string
    email?: string
  }
  form: UseFormReturn<SignupFormData>
}

export default function PersonalInfo({ error, form }: PersonalInfoProps) {
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <CustomLabel htmlFor="firstName">First Name</CustomLabel>
            <CustomInput
              id="firstName"
              placeholder="Kabir"
              autoComplete="given-name"
              aria-label="First Name"
              {...field}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <CustomLabel htmlFor="email">Email</CustomLabel>
            <CustomInput
              id="email"
              placeholder="mail@gmail.com"
              autoComplete="email"
              aria-label="Email"
              {...field}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <CustomLabel htmlFor="phoneNumber">Phone Number</CustomLabel>
            <PhoneInput
              {...field}
              name="phoneNumber"
              placeholder="Enter your phone number"
              autoComplete="phone"
              className="flex items-center"
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}
