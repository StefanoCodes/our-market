import { createCookie, createCookieSessionStorage } from '@shopify/remix-oxygen'
import { AppLoadContext } from '@remix-run/server-runtime'
// for the signup flow
export const createOnboardingSession = (context: AppLoadContext) =>
  createCookieSessionStorage({
    cookie: {
      name: '__onboarding',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 5, // 5 minutes
      // @ts-ignore
      secrets: [context.env.SESSION_SECRET], // Using environment variable from context
      secure: process.env.NODE_ENV === 'production',
    },
  })

//   this is for the password reset flow
export const createPasswordResetSession = (context: AppLoadContext) =>
  createCookieSessionStorage({
    cookie: {
      name: '__password_reset',
      httpOnly: true,
      maxAge: 60 * 5, // 5 minutes
      path: '/',
      sameSite: 'lax',
      // @ts-ignore
      secrets: [context.env.SESSION_SECRET],
      secure: process.env.NODE_ENV === 'production',
    },
  })

//   announcement bar (when the user clickes the close button on the announcement bar, we want to store that in a cookie)

export const createAnnouncementBarSession = (context: AppLoadContext) =>
  createCookie('__announcement_bar', {
    // @ts-ignore
    secrets: [context.env.SHOP_ID],
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  })

export const createCheckoutSession = (context: AppLoadContext) =>
  createCookieSessionStorage({
    cookie: {
      name: '__checkout',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      // @ts-ignore
      secrets: [context.env.SESSION_SECRET],
      secure: process.env.NODE_ENV === 'production',
    },
  })

export function createOnboardingFlowSession(context: AppLoadContext) {
  return createCookie('__onboarding_flow', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    // @ts-ignore
    secrets: [context.env.SHOP_ID],
  })
}
