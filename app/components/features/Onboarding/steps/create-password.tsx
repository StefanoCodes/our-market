import { Eye, EyeIcon, EyeOff, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import CustomInput from '../input'
import CustomLabel from '../label'
import { UseFormReturn } from 'react-hook-form'
import { PasswordFormData } from '~/lib/validations/onboarding'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'

interface CreatePasswordStepProps {
  type?: 'signup' | 'reset-password'
  error?: {
    password?: string
    confirmPassword?: string
  }
  form: UseFormReturn<PasswordFormData>
}

export default function CreatePasswordStep({
  type = 'signup',
  error,
  form,
}: CreatePasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const title = type === 'signup' ? 'Create a secure password' : 'Create new password'

  const subtitle =
    type === 'signup'
      ? 'Your password must be at least 8 characters long'
      : 'Please create a new password for your account'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-center font-helvetica text-lg font-medium text-black">{title}</h3>
        <p className="text-center font-helvetica text-sm text-grey-600">{subtitle}</p>
      </div>
      <Form {...form}>
        <div className="flex flex-col gap-4">
          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <CustomLabel htmlFor="password">Password</CustomLabel>
                <div className="relative">
                  <CustomInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="*******************"
                    aria-label="Password"
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
          {/* confirm password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <CustomLabel htmlFor="confirmPassword">Confirm Password</CustomLabel>
                <div className="relative">
                  <CustomInput
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="*******************"
                    aria-label="Confirm Password"
                    {...field}
                  />
                  {showConfirmPassword ? (
                    <EyeIcon
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-grey-800 opacity-75"
                    />
                  ) : (
                    <EyeOffIcon
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-grey-800 opacity-75"
                    />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  )
}
