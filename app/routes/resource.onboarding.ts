import { ActionFunctionArgs, json } from '@shopify/remix-oxygen'
import {
  handleCloseOnboarding,
  handleCompleteSignup,
  handleCreateNewPassword,
  handleForgotPassword,
  handleLogin,
  handleResendCode,
  handleSignupInitial,
  handleVerifyResetPassword,
  handleVerifySignup,
} from '~/lib/actions/onboarding.server'

// each action is mapped to a form submission intent if none found return 400

export async function loader() {
  //  prevent users coming here
  return json('Not Allowed', { status: 405 })
}

export async function action({ request, context }: ActionFunctionArgs) {
  // pass down the context to the actions that need them for example the shopfiy logic action to enable users to login
  const formData = await request.formData()
  const intent = formData.get('intent') as string

  try {
    const handlers = {
      login: handleLogin,
      'forgot-password': handleForgotPassword,
      'verify-reset-password': handleVerifyResetPassword,
      'create-new-password': handleCreateNewPassword,
      'signup-personal-info': handleSignupInitial,
      'verify-signup': handleVerifySignup,
      'complete-signup': handleCompleteSignup,
      'resend-code': handleResendCode,
      'close-onboarding': handleCloseOnboarding,
    } as const

    const handler = handlers[intent as keyof typeof handlers]

    if (!handler) {
      return json({ error: 'Invalid form submission' }, { status: 400 })
    }
    // run the handler and pass the form data
    return handler(formData, request, context)
  } catch (error) {
    console.error('Action error:', error)
    return json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
