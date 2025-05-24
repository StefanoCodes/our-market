import { redirect } from '@remix-run/server-runtime'

export async function loader() {
  return redirect('/account/orders/current')
}
