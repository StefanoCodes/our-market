import { json, type ActionFunctionArgs } from '@shopify/remix-oxygen'
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery'
import { klaviyoListIds } from '~/lib/integrations/klaviyo/constants'
import { klaviyoFormSchema } from '~/lib/integrations/klaviyo/klaviyo-validations'
import { formatZodErrors, splitFullName } from '~/lib/utils/utils'

// Constants
const BASE_URL_CREATE_LIST = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs'
const BASE_URL_CREATE_PROFILE = 'https://a.klaviyo.com/api/profiles'
const KLAVIYO_API_VERSION = '2025-01-15'

// Helper Functions
function getKlaviyoHeaders(apiKey: string) {
  return {
    accept: 'application/json',
    revision: KLAVIYO_API_VERSION,
    'content-type': 'application/json',
    Authorization: `Klaviyo-API-Key ${apiKey}`,
  }
}

async function validateFormData(
  formData: FormData,
): Promise<
  { email: string; firstName: string; lastName: string } | { error: Record<string, string> }
> {
  const email = formData.get('email')
  const fullName = formData.get('fullName')

  const validatedData = klaviyoFormSchema.safeParse({
    fullName,
    email,
  })

  if (!validatedData.success) {
    return { error: formatZodErrors(validatedData.error) }
  }

  const { firstName, lastName } = splitFullName(validatedData.data.fullName)
  return { email: validatedData.data.email, firstName, lastName }
}

// API CALLS

async function createKlaviyoProfile(
  data: { email: string; firstName: string; lastName: string },
  apiKey: string,
  additionalAttributes?: Record<string, string | number | boolean | object>,
) {
  const response = await fetch(BASE_URL_CREATE_PROFILE, {
    method: 'POST',
    headers: getKlaviyoHeaders(apiKey),
    body: JSON.stringify({
      data: {
        type: 'profile',
        attributes: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          ...additionalAttributes,
        },
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    // @ts-ignore
    return { success: false, error: errorData.errors?.[0]?.detail || 'Failed to create profile' }
  }

  // @ts-ignore
  return response.json().then((res) => res.data.id)
}

async function addProfileToList(
  profileId: string | null,
  email: string,
  listId: string,
  apiKey: string,
) {
  const response = await fetch(BASE_URL_CREATE_LIST, {
    method: 'POST',
    headers: getKlaviyoHeaders(apiKey),
    body: JSON.stringify({
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          profiles: {
            data: [
              {
                type: 'profile',
                ...(profileId && { id: profileId }),
                attributes: {
                  email,
                  subscriptions: {
                    email: {
                      marketing: {
                        consent: 'SUBSCRIBED',
                        // consent_timestamp: new Date().toISOString(),
                        // double_opt_in: true, double check this
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        relationships: {
          list: {
            data: {
              type: 'list',
              id: listId,
            },
          },
        },
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()

    // @ts-ignore
    throw new Error(errorData.errors?.[0]?.detail || 'Failed to add profile to list')
  }

  return response
}

// Route Handlers

export async function loader() {
  return json('Not Allowed', { status: 405 })
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Invalid request method.' })
  }
  const isLoggedIn = await context.customerAccount.getAccessToken()

  try {
    const formData = await request.formData()
    const validatedData = await validateFormData(formData)
    if ('error' in validatedData) {
      return json({
        success: false,
        error: validatedData.error,
      })
    }

    const { email, firstName, lastName } = validatedData

    // Create profile and add to list
    if (!isLoggedIn) {
      const profileId = await createKlaviyoProfile(
        { email, firstName, lastName },
        context.env.KLAVIYO_PRIVATE_KEY,
      )
      await addProfileToList(
        profileId,
        email,
        klaviyoListIds.CHECKOUT_DISCOUNT_LIST,
        context.env.KLAVIYO_PRIVATE_KEY,
      )
      return json({ success: true })
    }
    // if they are logged in it means they are have a profile on klaviyio so they just simply need to use the email as a way to lookup
    else {
      // before we add to the list we need to check if the email that is inserted by the user is different than the one he created the accoint with because we would then need to create the profile first
      // query the customer
      const data = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY)
      const emailUsedToLogin = data.data.customer.emailAddress?.emailAddress

      if (emailUsedToLogin !== email) {
        const additionalAttributes = {
          location: {
            address1:
              data.data.customer.defaultAddress?.address1 ??
              data.data.customer.addresses.nodes[0].address1,
            address2:
              data.data.customer.defaultAddress?.address2 ??
              data.data.customer.addresses.nodes[0].address2,
            city:
              data.data.customer.defaultAddress?.city ?? data.data.customer.addresses.nodes[0].city,
            country:
              data.data.customer.defaultAddress?.territoryCode ??
              data.data.customer.addresses.nodes[0].territoryCode,
            region:
              data.data.customer.defaultAddress?.zoneCode ??
              data.data.customer.addresses.nodes[0].zoneCode,
            zip:
              data.data.customer.defaultAddress?.zip ?? data.data.customer.addresses.nodes[0].zip,
          },
        }
        // create the profile first
        const profileId = await createKlaviyoProfile(
          { email, firstName, lastName },
          context.env.KLAVIYO_PRIVATE_KEY,
          additionalAttributes,
        )
        await addProfileToList(
          profileId,
          email,
          klaviyoListIds.CHECKOUT_DISCOUNT_LIST,
          context.env.KLAVIYO_PRIVATE_KEY,
        )
      } else {
        await addProfileToList(
          null,
          email,
          klaviyoListIds.CHECKOUT_DISCOUNT_LIST,
          context.env.KLAVIYO_PRIVATE_KEY,
        )
      }
      return json({ success: true })
    }
  } catch (error) {
    console.error('Klaviyo API error:', error)
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Something went wrong.',
    })
  }
}
