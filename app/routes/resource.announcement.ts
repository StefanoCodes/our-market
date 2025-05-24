import { ActionFunctionArgs, json } from '@shopify/remix-oxygen'
import { createAnnouncementBarSession } from '~/cookies.server'

export async function loader() {
  return json('Not Allowed', { status: 405 })
}
export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ success: false, message: 'Invalid request method' }, { status: 400 })
  }

  const announcementBarSession = createAnnouncementBarSession(context)
  const announcementBarCookie = await announcementBarSession.serialize({
    hideAnnouncementBar: true,
  })

  return json({ success: true }, { headers: { 'Set-Cookie': announcementBarCookie } })
}
