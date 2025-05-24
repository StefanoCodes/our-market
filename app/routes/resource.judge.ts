import { ActionFunctionArgs, json } from '@remix-run/server-runtime'
import { handleCreateReview } from '~/lib/integrations/judge-me/actions'

const intents = ['create-review']

export async function loader() {
  return json('Not Allowed', { status: 405 })
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData()
  const intent = formData.get('intent') as string
  const productId = formData.get('productId') as string | null
  if (!intent || !intents.includes(intent)) {
    return json({ error: 'Invalid form submission' }, { status: 400 })
  }

  try {
    const handlers = {
      'create-review': handleCreateReview,
    } as const

    const handler = handlers[intent as keyof typeof handlers]
    return handler(formData, context, productId)
  } catch (error) {
    console.error('Action error:', error)
    return json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
