import { ActionFunctionArgs, json } from '@shopify/remix-oxygen'
export async function loader() {
    //  prevent users coming here
    return json('Not Allowed', { status: 405 })
}

export async function action({ request, context }: ActionFunctionArgs) {
    const formData = await request.formData()
    const intent = formData.get('intent') as string


    try {
        const handlers = {
            // add the different handles
            // create list
            // delete list
            // etc.
        } as const

        const handler = handlers[intent as keyof typeof handlers]

        if (!handler) {
            return json({ error: 'Invalid form submission' }, { status: 400 })
        }

        // run the handler and pass the form data
        // return handler(request, context, formData)
    } catch (error) {
        console.error('Action error:', error)
        return json({ error: 'An unexpected error occurred' }, { status: 500 })
    }
}
