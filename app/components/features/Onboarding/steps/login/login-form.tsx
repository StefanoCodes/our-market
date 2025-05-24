import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
// import { useOnboarding } from '~/components/features/Onboarding/onboarding-provider'
import CheckBoxIcon from '~/components/ui/icons/checkbox'

import { EyeIcon, EyeOffIcon } from 'lucide-react'
import type { z } from 'zod'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { loginSchema } from '~/lib/validations/onboarding'
import CustomInput from '../../input'
import CustomLabel from '../../label'

type LoginFormData = z.infer<typeof loginSchema>
interface LoginFormProps {
  form: UseFormReturn<LoginFormData>
}

export default function LoginForm({ form }: LoginFormProps) {
  // const { setCurrentStep } = useOnboarding()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-1">
      <Form {...form}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="loginEmail"
            render={({ field }) => (
              <FormItem>
                <CustomLabel htmlFor="loginEmail">Email</CustomLabel>
                <CustomInput
                  id={'loginEmail'}
                  placeholder={'mail@gmail.com'}
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
            name="loginPassword"
            render={({ field }) => (
              <FormItem>
                <CustomLabel htmlFor="loginPassword">Password</CustomLabel>
                <div className="relative">
                  <CustomInput
                    id={'loginPassword'}
                    placeholder={'*******************'}
                    autoComplete="off"
                    aria-label="Password"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                  />
                  {showPassword ? (
                    <EyeIcon
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-grey-800 opacity-75"
                    />
                  ) : (
                    <EyeOffIcon
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-grey-800 opacity-75"
                    />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* remember */}
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-1">
              <CheckBoxIcon />
              <span className="font-helvetica text-xs font-medium text-brand-green">
                Remember Password
              </span>
            </div>
            <span
              className="cursor-pointer font-helvetica text-xs font-medium text-grey-800"
              // onClick={() => setCurrentStep(1)}
            >
              Forgot Password
            </span>
          </div>
        </div>
      </Form>
    </div>
  )
}
