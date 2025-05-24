import { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@shopify/remix-oxygen'
import { handleCheckoutInfo, handlePaymentInfo } from '~/lib/actions/checkout.server'

export async function loader() {
  return json('Not Allowed', { status: 405 })
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData()
  const intent = formData.get('intent') as string

  try {
    const handlers = {
      'checkout-info': handleCheckoutInfo,
      'payment-info': handlePaymentInfo,
    } as const

    const handler = handlers[intent as keyof typeof handlers]

    if (!handler) {
      return json({ error: 'Invalid form submission' }, { status: 400 })
    }

    return handler(formData, context, request)
  } catch (error) {
    console.error('Action error:', error)
    return json(
      {
        error: { _form: 'Something went wrong' },
        message: 'An error occurred while processing your request',
      },
      { status: 500 },
    )
  }
}
