export interface QuoteRequest {
  pickup_address: Address // update this too to be a stringfied string like the dropoff_address
  dropoff_address: {
    dropoff_address: string
  }
}

export interface Address {
  street_address: string[]
  city: string
  state: string
  zip_code: string
  country: string
}
export interface ManifestItem {
  name: string
  quantity: number
  size?: string
  dimensions?: {
    length: number
    height: number
    depth: number
  }
  price?: number
  weight?: number
}
export interface CreateDeliveryPayload {
  // Required fields
  quoteId: string
  pickup_name: string
  pickup_address: Address
  pickup_phone_number: string
  dropoff_name: string
  dropoff_address: {
    dropoff_address: string
  }
  dropoff_phone_number: string
  manifest_items: ManifestItem[]
  // Optional fields
  pickup_business_name?: string
  pickup_latitude?: number
  pickup_longitude?: number
  pickup_notes?: string
  dropoff_business_name?: string
  dropoff_latitude?: number
  dropoff_longitude?: number
  dropoff_notes?: string
  dropoff_seller_notes?: string
  deliverable_action?: 'deliverable_action_meet_at_door' | 'deliverable_action_leave_at_door'
}

export interface DeliveryInfo {
  id: string
  tracking_url: string
  status: string
  dropoff_name: string
  dropoff_phone_number: string
  pickup_name: string
  pickup_phone_number: string
  created_at: string
  manifest_items: ManifestItem[]
  dropoff_address: {
    dropoff_address: string
  }
}
export type UberErrorCode = keyof typeof UBER_ERROR_MESSAGES

export const UBER_ERROR_MESSAGES = {
  invalid_params: 'The delivery information provided is invalid',
  address_undeliverable: 'The address is undeliverable ',
  duplicate_delivery: 'This delivery has already been created',
  pickup_window_too_small: 'The pickup window is too small',
  customer_suspended: 'Service is temporarily suspended',
  customer_blocked: 'Service is not available',
  customer_not_found: 'Customer account not found',
  request_timeout: 'Request timed out, please try again',
  customer_limited: 'Checkout temporarily unavailable',
  internal_server_error: 'Checkout temporarily unavailable',
  address_undeliverable_limited_couriers:
    'The specified location is not in a deliverable area at this time because all couriers are currently busy.',
  unknow_location: 'The location provided is not correct please check it again',
  // note:
  // there are more errros but i noticed the default answer if there is no match for the error is the best since they are kind of hard to understand and the client may be consfued
} as const

// sample pikcup data (factory location)
export const MOCK_PICKUP_ADDRESS = {
  pickup_name: 'Our Market Store',
  street_address: ['120 5th Avenue'],
  city: 'New York',
  state: 'NY',
  zip_code: '10011',
  country: 'US',
}
