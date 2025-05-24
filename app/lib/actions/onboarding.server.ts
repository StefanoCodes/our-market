import { json } from '@shopify/remix-oxygen'
import {
  loginSchema,
  forgotPasswordSchema,
  verificationSchema,
  passwordSchema,
  signupSchema,
} from '~/lib/validations/onboarding'
import { formatZodErrors } from '../utils/utils'
import { AppLoadContext } from '@remix-run/server-runtime'
import {
  createOnboardingFlowSession,
  createOnboardingSession,
  createPasswordResetSession,
} from '~/cookies.server'
import { trackKlaviyoEvent } from '../integrations/klaviyo/events/tracking-events'

const PASSWORD_RESET_PERMITTED_TIME = 30 * 60 * 1000 // 30 minutes
const SIGNUP_PERMITTED_TIME = 30 * 60 * 1000 // 30 minutes

// NOTES
// make the errors and message consistent on the frontend like do we awnat to dsiplay a toast or not ?

// sessions use to track and store the data through the onboarding flow
// create a session for the onboarding flow

// create a session for the password reset flow

// handlers for the actions to be run on the server side
// 1 step flow
// login ✅ (all validation and data collection)
export async function handleLogin(formData: FormData, request: Request, context: AppLoadContext) {
  const { storefront, session } = context

  const { success, data, error } = loginSchema.safeParse({
    loginEmail: formData.get('loginEmail'),
    loginPassword: formData.get('loginPassword'),
  })

  if (!success) {
    return json(
      {
        error: formatZodErrors(error),
        fields: Object.fromEntries(formData),
      },
      { status: 400 },
    )
  }

  // First try to login
  // const { customerAccessTokenCreate } = await storefront.mutate(CUSTOMER_LOGIN_MUTATION, {
  //   variables: {
  //     input: {
  //       email: data.loginEmail,
  //       password: data.loginPassword,
  //     },
  //   },
  // })



  // if (customerAccessTokenCreate?.customerUserErrors?.length) {
  //   return json({ errors: customerAccessTokenCreate.customerUserErrors }, { status: 400 })
  // }

  // if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
  //   return json({ error: 'Login failed' }, { status: 400 })
  // }

  // const accessToken = customerAccessTokenCreate.customerAccessToken.accessToken


  // // Set the customer access token in the session
  // session.set('customerAccessToken', accessToken)

  // // Get customer data immediately after login
  // const { customer } = await storefront.query(CUSTOMER_QUERY, {
  //   variables: { customerAccessToken: accessToken },
  // })


  // Track successful login
  // await KlaviyoTracking.trackPageView(request, context, {
  //   url: '/login',
  //   title: 'Login Success',
  //   customer: {
  //     email: data.loginEmail,
  //     source: 'login',
  //   },
  // })

  // Commit the session with the token
  const sessionCookie = await session.commit()

  return json(
    {
      success: true,
      message: 'Login successful',
      // customer,
    },
    {
      headers: {
        'Set-Cookie': sessionCookie,
      },
    },
  )
}
// 3 step flow
// forgot password ✅ (all validation and data collection)
export async function handleForgotPassword(
  formData: FormData,
  request: Request,
  context: AppLoadContext,
) {
  const result = forgotPasswordSchema.safeParse({
    forgotPasswordEmail: formData.get('forgotPasswordEmail'),
  })

  if (!result.success) {
    return json(
      {
        error: formatZodErrors(result.error),
        fields: Object.fromEntries(formData),
      },
      { status: 400 },
    )
  }

  const passwordResetSession = createPasswordResetSession(context)
  const session = await passwordResetSession.getSession(request.headers.get('Cookie'))
  session.unset('forgotPasswordData')
  session.unset('forgotPasswordRequestedAt')
  session.set('forgotPasswordData', result.data)
  session.set('forgotPasswordRequestedAt', new Date().toISOString()) // to use in the second step of the flow to check if the request was made more than 30 minutes ago that way we can let the user know the code has expired and needs to be requested again

  // we would generate the code token here and trigger the email to be sent to the user and then we would store the code token in the session and read it on the second step of the flow to verify it matches the code inserted by the user
  //
  session.set('forgotPasswordCode', '2222')

  await new Promise((resolve) => setTimeout(resolve, 4000))

  return json(
    {
      success: true,
      message: 'Password reset email sent',
    },
    {
      headers: {
        'Set-Cookie': await passwordResetSession.commitSession(session), // update the session with the new code and timestamp
      },
    },
  )
}
// verify reset code (reset password / forgot password)
export async function handleVerifyResetPassword(
  formData: FormData,
  request: Request,
  context: AppLoadContext,
) {
  const result = verificationSchema.safeParse({
    code: formData.get('code'),
  })

  if (!result.success) {
    return json(
      {
        error: formatZodErrors(result.error),
        fields: Object.fromEntries(formData),
      },
      { status: 400 },
    )
  }

  const passwordResetSession = createPasswordResetSession(context)
  const session = await passwordResetSession.getSession(request.headers.get('Cookie'))

  const forgotPasswordData = session.get('forgotPasswordData')
  const forgotPasswordRequestedAt = session.get('forgotPasswordRequestedAt')
  const forgotPasswordCode = session.get('forgotPasswordCode')
  if (!forgotPasswordRequestedAt || !forgotPasswordData || !forgotPasswordCode) {
    return json(
      {
        error: 'Reset request not found. Please start the forgot password process again.',
      },
      { status: 400 },
    )
  }

  const requestDate = new Date(forgotPasswordRequestedAt)
  const now = new Date()
  const timeDiff = now.getTime() - requestDate.getTime()

  // this is to check if the request was made more than 30 minutes ago we can change it based on the provider we will use to send the code etc
  if (timeDiff > PASSWORD_RESET_PERMITTED_TIME) {
    return json(
      {
        error: 'Reset request expired. Please start the forgot password process again.',
      },
      { status: 400 },
    )
  }

  // TODO: Implement actual verification logic here
  if (result.data.code !== forgotPasswordCode) {
    return json(
      {
        error: 'Invalid code. Please try again.',
        message: 'Invalid code. Please try again.',
      },
      { status: 400 },
    )
  }

  await new Promise((resolve) => setTimeout(resolve, 4000))

  return json({
    success: true,
    message: 'Code verified successfully',
  })
}
// create new password (reset password / forgot password)
export async function handleCreateNewPassword(
  formData: FormData,
  request: Request,
  context: AppLoadContext,
) {
  const result = passwordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!result.success) {
    return json(
      {
        error: formatZodErrors(result.error),
        fields: Object.fromEntries(formData),
      },
      { status: 400 },
    )
  }

  // get the data in session + the new password
  const passwordResetSession = createPasswordResetSession(context)
  const session = await passwordResetSession.getSession(request.headers.get('Cookie'))
  const forgotPasswordData = session.get('forgotPasswordData')

  if (!forgotPasswordData) {
    return json(
      {
        error: 'Session expired or invalid. Please start the forgot password process again.',
      },
      { status: 400 },
    )
  }
  const finalData = {
    ...forgotPasswordData,
    ...result.data,
  }

  // TODO: Implement actual password update logic here
  try {
    await new Promise((resolve) => setTimeout(resolve, 4000))
  } catch (error) {
    console.error('Password update failed:', error)
    return json(
      {
        success: false,
        message: 'Failed to update password. Please try again.',
      },
      { status: 500 },
    )
  }

  session.unset('forgotPasswordData')
  session.unset('forgotPasswordRequestedAt')
  session.unset('forgotPasswordCode')

  return json(
    {
      success: true,
      message: 'Password updated successfully',
    },
    {
      headers: {
        'Set-Cookie': await passwordResetSession.destroySession(session), // destroy the session
      },
    },
  )
}
// 3 step flow
// sign up (personal info)
export async function handleSignupInitial(
  formData: FormData,
  request: Request,
  context: AppLoadContext,
) {
  const result = signupSchema.safeParse({
    firstName: formData.get('firstName'),
    email: formData.get('email'),
    phoneNumber: formData.get('phoneNumber'),
  })

  if (!result.success) {
    return json(
      {
        error: formatZodErrors(result.error),
        fields: Object.fromEntries(formData),
      },
      { status: 400 },
    )
  }

  const onboardingSession = createOnboardingSession(context)
  const session = await onboardingSession.getSession(request.headers.get('Cookie'))
  // this is incase the user refreshes the page and the session is not destroyed or leaves and comes back and starts the sign up from start
  session.unset('signupData')
  session.unset('signupCode')
  session.unset('signupRequestedAt')
  // Set new data
  session.set('signupData', result.data)
  session.set('signupRequestedAt', new Date().toISOString())

  // token  & email generation here then store that in the session to retrive in the second step to compare to the code inserted by the user
  session.set('signupCode', '1234')

  // todo trigger email verification code to be sent to the user
  await new Promise((resolve) => setTimeout(resolve, 4000))

  return json(
    {
      success: true,
      message: 'Verification code sent',
    },
    {
      headers: {
        'Set-Cookie': await onboardingSession.commitSession(session, {}),
      },
    },
  )
}
// sign up (verification code)
export async function handleVerifySignup(
  formData: FormData,
  request: Request,
  context: AppLoadContext,
) {
  const result = verificationSchema.safeParse({
    code: formData.get('code'),
  })

  if (!result.success) {
    return json(
      {
        error: formatZodErrors(result.error),
        fields: Object.fromEntries(formData),
      },
      { status: 400 },
    )
  }

  const onboardingSession = createOnboardingSession(context)
  const session = await onboardingSession.getSession(request.headers.get('Cookie'))
  const signupRequestedAt = session.get('signupRequestedAt')
  const signupData = session.get('signupData')
  const signupCode = session.get('signupCode')

  if (!signupRequestedAt || !signupData || !signupCode) {
    return json(
      {
        error: 'Signup request not found. Please start the signup process again.',
      },
      { status: 400 },
    )
  }
  // Check if code has expired first before validating it
  const requestDate = new Date(signupRequestedAt)
  const now = new Date()
  const timeDiff = now.getTime() - requestDate.getTime()

  // If code has expired, no need to validate it
  if (timeDiff > SIGNUP_PERMITTED_TIME) {
    return json(
      {
        error: 'Signup request expired. Please start the signup process again.',
      },
      { status: 400 },
    )
  }

  // Only validate code if it hasn't expired

  if (result.data.code !== signupCode) {
    return json(
      {
        error: 'Invalid code. Please try again.',
        message: 'Invalid code. Please try again.',
      },
      { status: 400 },
    )
  }

  // TODO: Implement actual signup verification logic here
  await new Promise((resolve) => setTimeout(resolve, 4000))

  return json({
    success: true,
    message: 'Code verified successfully',
  })
}
// sign up (create password)
export async function handleCompleteSignup(
  formData: FormData,
  request: Request,
  context: AppLoadContext,
) {
  try {
    // 1. Validate the password data
    const result = passwordSchema.safeParse({
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    })

    if (!result.success) {
      return json(
        {
          error: formatZodErrors(result.error),
          fields: Object.fromEntries(formData),
        },
        { status: 400 },
      )
    }

    // 2. Get and validate session
    const onboardingSession = createOnboardingSession(context)
    const session = await onboardingSession.getSession(request.headers.get('Cookie'))
    const signupData = session.get('signupData')

    if (!signupData) {
      return json(
        {
          error: 'Session expired or invalid. Please start the signup process again.',
        },
        { status: 400 },
      )
    }

    // 3. Combine all signup data
    const finalData = {
      ...signupData,
      ...result.data,
    }

    // const { storefront } = context
    // // Create customer in Shopify
    // const { customerCreate } = await storefront.mutate(CREATE_CUSTOMER_MUTATION, {
    // variables: {
    //   input: {
    //     email: finalData.email,
    //     password: finalData.password,
    //     firstName: finalData.firstName,
    //     phone: finalData.phoneNumber,
    //   },
    // },
    // })

    // if (customerCreate?.customerUserErrors?.length) {
    //   return json({ errors: customerCreate.customerUserErrors }, { status: 400 })
    // }

    // // Login the newly created customer
    // const { customerAccessTokenCreate } = await storefront.mutate(CUSTOMER_LOGIN_MUTATION, {
    //   variables: {
    //     input: {
    //       email: finalData.email,
    //       password: finalData.password,
    //     },
    //   },
    // })

    // if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
    //   return json(
    //     {
    //       error: 'Account creation successful but login failed',
    //       errors: customerAccessTokenCreate?.customerUserErrors,
    //     },
    //     { status: 400 },
    //   )
    // }

    // // Set the customer access token in the session
    // session.set('customerAccessToken', customerAccessTokenCreate.customerAccessToken.accessToken)

    // Track successful signup
    // const response = await context.customerAccount.mutate(CUSTOMER_CREATE_MUTATION, {
    //   variables: {
    //     input: {
    //       firstName: finalData.firstName,
    //       emailAddress: {
    //         emailAddress: finalData.email,
    //         marketing: { marketingState: 'NOT_SUBSCRIBED' },
    //       },
    //       phoneNumber: {
    //         phoneNumber: finalData.phoneNumber,
    //         marketingState: 'NOT_SUBSCRIBED',
    //       },
    //     },
    //   },
    // })

    await trackKlaviyoEvent(
      context.env.KLAVIYO_PRIVATE_KEY,
      '/',
      'User Sign Up',
      request,
      {
        // customer: {
        //   email: finalData.email,
        //   firstName: finalData.firstName,
        //   phoneNumber: finalData.phoneNumber,
        //   source: 'signup',
        // },
      },
      'stefanovidmar9@gmail.com',
    )

    // 5. Set signup completion flag and clear sensitive data
    session.unset('signupData')
    session.unset('signupCode')
    session.unset('signupRequestedAt')
    session.set('signUpCompleted', true)

    return json(
      {
        success: true,
        message: 'Account created successfully!',
      },
      {
        headers: {
          'Set-Cookie': await onboardingSession.commitSession(session),
        },
      },
    )
  } catch (error) {
    console.error('Signup completion error:', error)
    return json(
      {
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 },
    )
  }
}
// resend code (handles both sign up and reset password based on the type which is passed in the form data)
export async function handleResendCode(
  formData: FormData,
  request: Request,
  context: AppLoadContext,
) {
  //  read email from session if it does not eister we will return
  const type = formData.get('type')

  // we can set up a zod schema for this but for now this works

  if (type !== 'sign-up' && type !== 'reset-password') {
    return json(
      {
        success: false,
        message: 'Method not allowed',
      },
      { status: 405 },
    )
  }

  switch (type) {
    case 'sign-up':
      const onboardingSession = createOnboardingSession(context)
      const session = await onboardingSession.getSession(request.headers.get('Cookie'))
      const signupData = session.get('signupData')
      const signupCode = session.get('signupCode')
      const signupRequestedAt = session.get('signupRequestedAt')
      if (!signupData) {
        return json(
          {
            success: false,
            message: 'Something went wrong',
          },
          { status: 400 },
        )
      }

      // update the session with the new requested timestamp that way when they insert the new code and then click verify it will have updated and the logic will check that again
      session.set('signupRequestedAt', new Date().toISOString())
      session.set('signupCode', '4321')

      return json(
        {
          success: true,
          message: 'Code resent successfully',
        },
        {
          headers: {
            'Set-Cookie': await onboardingSession.commitSession(session),
          },
        },
      )

      break
    case 'reset-password':
      const passwordResetSession = createPasswordResetSession(context)
      const forgotPasswordSession = await passwordResetSession.getSession(
        request.headers.get('Cookie'),
      )
      const forgotPasswordData = forgotPasswordSession.get('forgotPasswordData')
      const forgotPasswordCode = forgotPasswordSession.get('forgotPasswordCode')
      const forgotPasswordRequestedAt = forgotPasswordSession.get('forgotPasswordRequestedAt')
      if (!forgotPasswordData) {
        return json(
          {
            success: false,
            message: 'Something went wrong',
          },
          { status: 400 },
        )
      }

      forgotPasswordSession.set('forgotPasswordRequestedAt', new Date().toISOString())
      forgotPasswordSession.set('forgotPasswordCode', '4444')

      return json(
        {
          success: true,
          message: 'Code resent successfully',
        },
        {
          headers: {
            'Set-Cookie': await passwordResetSession.commitSession(forgotPasswordSession),
          },
        },
      )
      break
    default:
      return json(
        {
          success: false,
          message: 'Something went wrong',
        },
        { status: 400 },
      )
  }
}

// close onboarding flow
export async function handleCloseOnboarding(
  formData: FormData,
  request: Request,
  context: AppLoadContext,
) {
  const onboardingFlowSession = createOnboardingFlowSession(context)
  const onboardingFlowCookie = await onboardingFlowSession.serialize({
    hideOnboardingFlow: true,
  })

  return json(
    { success: true, onboardingFlowClosed: true },
    { headers: { 'Set-Cookie': onboardingFlowCookie } },
  )
}

// mutation

const CUSTOMER_LOGIN_MUTATION = `#graphql
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      firstName
      lastName
      email
      phone
      acceptsMarketing
    }
    customerUserErrors {
      field
      message
      code
    }
  }
}` as const

const CUSTOMER_QUERY = `#graphql
  query Customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
    }
  }
` as const
