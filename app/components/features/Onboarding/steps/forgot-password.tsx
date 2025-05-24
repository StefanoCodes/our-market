import type { UseFormReturn } from 'react-hook-form'

import CustomInput from '../input'
import CustomLabel from '../label'
import type { z } from 'zod'
import { forgotPasswordSchema } from '~/lib/validations/onboarding'
import { FormMessage } from '~/components/ui/form'
import { FormField, FormItem, Form } from '~/components/ui/form'

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordProps {
  error?: {
    forgotPasswordEmail?: string
  }
  form: UseFormReturn<ForgotPasswordFormData>
}

export default function ForgotPassword({ error, form }: ForgotPasswordProps) {
  const {
    register,
    formState: { errors },
  } = form
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-helvetica text-xl font-medium text-black">Enter Registered Email</h2>
      <Form {...form}>
        <div className="flex flex-col gap-1">
          <FormField
            control={form.control}
            name="forgotPasswordEmail"
            render={({ field }) => (
              <FormItem>
                <CustomLabel htmlFor="forgotPasswordEmail">Email</CustomLabel>
                <CustomInput
                  id={'forgotPasswordEmail'}
                  placeholder={'mail@gmail.com'}
                  autoComplete="email"
                  aria-label="Email"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  )
}
