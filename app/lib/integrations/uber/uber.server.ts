import { CartLine } from '@shopify/hydrogen/storefront-api-types'
import {
  Address,
  CreateDeliveryPayload,
  ManifestItem,
  QuoteRequest,
  UBER_ERROR_MESSAGES,
  UberErrorCode,
} from './types'

const createAuthTokenUrl = 'https://auth.uber.com/oauth/v2/token'

// generate auth token for uber direct api calls
export const getUberDirectToken = async (clientId: string, clientSecret: string) => {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: 'eats.deliveries',
  })

  try {
    const response = await fetch(createAuthTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })

    if (!response.ok) {
      return {
        success: false,
        error: response.status,
      }
    }

    const data = await response.json()
    // @ts-ignore (unknown property)
    return data.access_token
  } catch (error) {
    console.error('Error getting Uber Direct token:', error)
    return {
      success: false,
      error: error,
      status: 500,
    }
  }
}
// (get the price)
export const createQuote = async (
  token: string,
  customerId: string,
  quoteRequest: QuoteRequest,
) => {
  try {
    const response = await fetch(
      `https://api.uber.com/v1/customers/${customerId}/delivery_quotes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pickup_address: JSON.stringify(quoteRequest.pickup_address),
          dropoff_address: JSON.stringify(quoteRequest.dropoff_address.dropoff_address),
        }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data,
        status: response.status,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('Error creating quote:', error)
    return {
      success: false,
      error,
      status: 500,
    }
  }
}
// (create the order)
export const createDelivery = async (
  customerId: string,
  token: string,
  payload: CreateDeliveryPayload,
) => {
  const url = `https://api.uber.com/v1/customers/${customerId}/deliveries`

  const requiredPayload = {
    pickup_name: payload.pickup_name,
    pickup_address: JSON.stringify(payload.pickup_address),
    pickup_phone_number: payload.pickup_phone_number,
    dropoff_name: payload.dropoff_name,
    dropoff_address: payload.dropoff_address.dropoff_address,
    dropoff_phone_number: payload.dropoff_phone_number,
    manifest_items: payload.manifest_items,
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requiredPayload),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data,
        status: response.status,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('Error creating delivery:', error)
    return {
      success: false,
      error,
      status: 500,
    }
  }
}
// (format the cart items to the manifest)
export const formatCartItemsToManifest = (cartItems: CartLine[]): ManifestItem[] => {
  return cartItems.map((item) => {
    const priceInCents = Math.round(parseFloat(item.merchandise.price.amount) * 100)
    let size: 'small' | 'medium' | 'large' | 'xlarge' = 'small'

    const weight = item.merchandise.weight ?? undefined
    if (typeof weight === 'number') {
      if (weight > 10000) size = 'xlarge'
      else if (weight > 5000) size = 'large'
      else if (weight > 2000) size = 'medium'
    }

    const manifestItem: ManifestItem = {
      name: item.merchandise.product.title,
      quantity: item.quantity,
      size,
      price: priceInCents,
    }

    if (typeof weight === 'number') {
      manifestItem.weight = weight
    }

    return manifestItem
  })
}

export const formatUberAddress = (address: Address) => {
  // Create the formatted address object
  return {
    dropoff_address: JSON.stringify({
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      country: address.country,
    }),
  }
}

// error handling

function getUberErrorMessage(code: string): string {
  return UBER_ERROR_MESSAGES[code as UberErrorCode] || 'An unexpected error occurred'
}

export function handleUberApiError(error: any, errorName: string = 'create_quote') {
  console.error('Uber API Error :', error)

  if (error) {
    const errorCode = error.code
    switch (errorCode) {
      case 'invalid_params':
        return {
          error: {
            [errorName]:
              typeof error.metadata === 'object'
                ? Object.entries(error.metadata)
                    .map(([key, value]) => `${value}`)
                    .join(', ')
                : getUberErrorMessage('invalid_params'),
          },
        }
      case 'unauthorized':
        return {
          error: {
            [errorName]: 'Authentication failed',
          },
        }
      case 'customer_suspended':
        return {
          error: {
            [errorName]: getUberErrorMessage('customer_suspended'),
          },
        }
      case 'customer_blocked':
        return {
          error: {
            [errorName]: getUberErrorMessage('customer_blocked'),
          },
        }
      case 'customer_not_found':
        return {
          error: {
            [errorName]: getUberErrorMessage('customer_not_found'),
          },
        }
      case 'request_timeout':
        return {
          error: {
            [errorName]: getUberErrorMessage('request_timeout'),
          },
        }
      case 'customer_limited':
        return {
          error: {
            [errorName]: getUberErrorMessage('customer_limited'),
          },
        }
      case 'internal_server_error':
        return {
          error: {
            [errorName]: getUberErrorMessage('internal_server_error'),
          },
        }
      case 'address_undeliverable':
        return {
          error: {
            [errorName]: getUberErrorMessage('address_undeliverable'),
          },
        }
      case 'address_undeliverable_limited_couriers':
        return {
          error: {
            [errorName]: getUberErrorMessage('address_undeliverable_limited_couriers'),
          },
        }
      case 'unknow_location':
        return {
          error: {
            [errorName]: getUberErrorMessage('unknow_location'),
          },
        }
      case 'duplicate_delivery':
        return {
          error: {
            [errorName]: getUberErrorMessage('duplicate_delivery'),
          },
        }
      default:
        return {
          error: {
            [errorName]: 'An unexpected error occurred please try again',
          },
        }
    }
  }

  // Handle network or other errors
  return {
    error: {
      [errorName]: 'Unable to connect to delivery service',
    },
    message: 'Please check your connection and try again',
  }
}
