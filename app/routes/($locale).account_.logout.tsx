import { redirect, type ActionFunctionArgs } from '@shopify/remix-oxygen'

// if we don't implement this, /account/logout will get caught by account.$.tsx to do login
export async function loader() {
  return redirect('/')
}

export async function action({ context }: ActionFunctionArgs) {
  // update buyer identity
  const result = await context.cart.updateBuyerIdentity({ customerAccessToken: null })
  const headers = context.cart.setCartId(result.cart.id)
  headers.append('Set-Cookie', await context.session.commit())
  return context.customerAccount.logout()
}
