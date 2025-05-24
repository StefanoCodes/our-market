import type { UseFormReturn } from 'react-hook-form'
import { Form as ShadForm, FormField, FormItem, FormMessage } from '~/components/ui/form'
import VerifyMailIcon from '~/components/ui/icons/verify-mail'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '~/components/ui/input-otp'
import { VerificationFormData } from '~/lib/validations/onboarding'
import CustomLabel from '../label'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { formatTime } from '~/lib/utils/utils'
import { data, useFetcher } from '@remix-run/react'
import { toast } from 'sonner'
import { c } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'

interface VerificationStepProps {
  type?: 'signup' | 'reset-password'
  email?: string
  error?: {
    code?: string
  }
  form: UseFormReturn<VerificationFormData>
}

interface ActionData {
  error?: string
  success?: boolean
}

const RESEND_CODE_TIMER = 1 * 60 * 1000
const MAX_LIMIT_COUNT = 3
// we want to setup a 5 minute timer after whcih will show the the resend button to be active

export default function VerificationStep({
  type = 'signup',
  email,
  error,
  form,
}: VerificationStepProps) {
  const [isResendButtonActive, setIsResendButtonActive] = useState(false)
  const [resendCodeTimer, setResendCodeTimer] = useState(RESEND_CODE_TIMER)
  const [limitCount, setLimitCount] = useState(0)
  const fetcher = useFetcher<ActionData>()
  const isSubmiting = fetcher.state === 'submitting'
  // add some rate limiting here
  const handleResendCode = () => {
    // update the limit count
    setLimitCount((prev) => prev + 1)
    if (limitCount >= MAX_LIMIT_COUNT) {
      toast.error('You have reached the maximum limit for resending the code')
      return
    }
    // otherwise send the request
    fetcher.submit(
      { intent: 'resend-code', type: type },
      { action: '/resource/onboarding', method: 'POST' },
    )
  }
  useEffect(() => {
    if (fetcher?.data?.error) return
    // if the code is resent successfully
    if (fetcher?.data?.success) {
      toast.success('Code resent successfully')
      // reset the timer
      setResendCodeTimer(RESEND_CODE_TIMER)
      // show the button active
      setIsResendButtonActive(false)
      return
    }
  }, [fetcher.data])

  // handle the timer for the resend code button
  useEffect(() => {
    // show the button active once the timer is over
    if (resendCodeTimer <= 0) {
      setIsResendButtonActive(true)
      return
    }
    // show the timer in the UI
    const timer = setInterval(() => {
      setResendCodeTimer((prev) => prev - 1000)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCodeTimer])

  const title =
    type === 'signup'
      ? "We've sent a code to your mail for verification"
      : "We've sent a code to reset your password"

  const subtitle = email ? (
    <p className="text-center font-helvetica text-sm text-grey-600">
      Please enter the code sent to {email}
    </p>
  ) : null

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-1">
      <VerifyMailIcon />
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-center font-helvetica text-lg font-medium text-black">{title}</h3>
        {subtitle}
      </div>
      <ShadForm {...form}>
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <CustomLabel htmlFor="code">Verification Code</CustomLabel>
              <InputOTP maxLength={4} {...field}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
              <FormMessage />
            </FormItem>
          )}
        />
      </ShadForm>
      <div className="flex flex-col items-center gap-1">
        <Button
          type="submit"
          variant="link"
          className="select-none font-helvetica text-sm font-medium text-brand-green hover:underline disabled:text-grey-600"
          disabled={!isResendButtonActive || isSubmiting}
          onClick={handleResendCode}
        >
          {isSubmiting ? 'Resending...' : 'Resend Code'}
        </Button>
        {/* hide the timer if the duration expired */}
        {!isResendButtonActive && (
          <span className="font-helvetica text-sm text-grey-600">
            {formatTime(resendCodeTimer)}
          </span>
        )}
      </div>
    </div>
  )
}
