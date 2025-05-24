const BASE_URL = 'https://a.klaviyo.com/api/events'
const KLAVIYO_API_VERSION = '2025-01-15'

function getKlaviyoHeaders(apiKey: string) {
  return {
    accept: 'application/json',
    revision: KLAVIYO_API_VERSION,
    'content-type': 'application/json',
    Authorization: `Klaviyo-API-Key ${apiKey}`,
  }
}

export async function trackKlaviyoEvent(
  apiKey: string,
  url: string,
  title: string,
  request: Request,
  properties: Record<string, any>,
  customerEmail: string,
  // customerId: string,
) {
  const headers = getKlaviyoHeaders(apiKey)
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        data: {
          type: 'event',
          attributes: {
            properties: {
              url,
              title,
              userAgent: request.headers.get('user-agent') || '',
              referrer: request.headers.get('referer') || '',
              properties,
            },
            metric: {
              data: {
                type: 'metric',
                attributes: {
                  name: title,
                },
              },
            },
            profile: {
              data: {
                type: 'profile',
                // id: customerId,
                attributes: {
                  email: customerEmail,
                },
              },
            },
          },
        },
      }),
    })
    if (response.ok) {
      return true
    } else {
      console.error('Failed to track Klaviyo event')
      return false
    }
  } catch (error) {
    console.error('Klaviyo tracking error:', error)
    return false
  }
}
