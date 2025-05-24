import { AppLoadContext, redirect } from '@remix-run/server-runtime'

export function shouldRevalidate() {
  return true
}

export async function loader({ context }: { context: AppLoadContext }) {
  await context.customerAccount.handleAuthStatus()

  // update the buyer 

  return redirect('/account/profile')
}
