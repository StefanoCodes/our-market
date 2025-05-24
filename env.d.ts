/// <reference types="vite/client" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset'

import type { HydrogenContext, HydrogenSessionData, HydrogenEnv } from '@shopify/hydrogen'
import type { createAppLoadContext } from '~/lib/context'

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: { env: { NODE_ENV: 'production' | 'development' } }

  interface Env extends HydrogenEnv {
    UBER_DIRECT_CLIENT_ID: string
    UBER_DIRECT_CLIENT_SECRET: string
    UBER_DIRECT_CUSTOMER_ID: string
    KLAVIYO_PUBLIC_KEY: string
    KLAVIYO_PRIVATE_KEY: string
    JUDGE_ME_PRIVATE_KEY: string
    PUBLIC_CHECKOUT_DOMAIN: string
    // declare additional Env parameter use in the fetch handler and Remix loader context here
  }
}

declare module '@shopify/remix-oxygen' {
  interface AppLoadContext extends Awaited<ReturnType<typeof createAppLoadContext>> {
    // to change context type, change the return of createAppLoadContext() instead
  }

  interface SessionData extends HydrogenSessionData {
    // declare local additions to the Remix session data here
  }
}
