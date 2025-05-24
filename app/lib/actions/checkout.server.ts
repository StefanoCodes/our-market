import { CartLine } from '@shopify/hydrogen/storefront-api-types'
import { AppLoadContext, json } from '@shopify/remix-oxygen'
import { createCheckoutSession } from '~/cookies.server'
import { checkoutInfoSchema, paymentInfoSchema } from '~/lib/validations/checkout'
import {
  CreateDeliveryPayload,
  DeliveryInfo,
  MOCK_PICKUP_ADDRESS,
} from '../integrations/uber/types'
import {
  createDelivery,
  createQuote,
  formatCartItemsToManifest,
  formatUberAddress,
  getUberDirectToken,
  handleUberApiError,
} from '../integrations/uber/uber.server'
import { getCountryNameFromCode } from '../utils/checkout'
import { capitalize } from '../utils/utils'

export async function handleCheckoutInfo(
  formData: FormData,
  context: AppLoadContext,
  request: Request,
) {
  // server side validation
  const validatedFields = checkoutInfoSchema.safeParse(Object.fromEntries(formData))

  if (!validatedFields.success) {
    return json({
      error: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid checkout information',
    })
  }

  try {
    const token = await getUberDirectToken(
      context.env.UBER_DIRECT_CLIENT_ID,
      context.env.UBER_DIRECT_CLIENT_SECRET,
    )

    const dropoffCity = getCountryNameFromCode(
      validatedFields.data.province,
      validatedFields.data.country,
    )

    const dropoffAddress = formatUberAddress({
      street_address: [validatedFields.data.address],
      city: dropoffCity!,
      state: validatedFields.data.province,
      zip_code: validatedFields.data.zipCode,
      country: validatedFields.data.country,
    })

    const quoteRequest = {
      pickup_address: {
        street_address: MOCK_PICKUP_ADDRESS.street_address,
        city: MOCK_PICKUP_ADDRESS.city,
        state: MOCK_PICKUP_ADDRESS.state,
        zip_code: MOCK_PICKUP_ADDRESS.zip_code,
        country: MOCK_PICKUP_ADDRESS.country,
      },
      dropoff_address: dropoffAddress,
    }

    try {
      const quoteResponse = await createQuote(
        token,
        context.env.UBER_DIRECT_CUSTOMER_ID,
        quoteRequest,
      )

      if (!quoteResponse.success) {
        return json(handleUberApiError(quoteResponse.error, 'create_quote'), {
          status: quoteResponse.status || 400,
        })
      }

      // store in session the results so we can use in the payment step

      const checkoutData = {
        ...validatedFields.data,
        dropoffCity,
        quote: quoteResponse.data,
      }
      // create session
      const checkoutSession = createCheckoutSession(context)
      const session = await checkoutSession.getSession(request.headers.get('Cookie'))
      session.unset('checkoutData')
      session.set('checkoutData', checkoutData)

      return json(
        {
          success: true,
          message: 'Checkout information saved',
          step: 1, // Move to payment step
        },
        {
          headers: {
            'Set-Cookie': await checkoutSession.commitSession(session),
          },
        },
      )
    } catch (error: any) {
      return json(handleUberApiError(error), { status: 400 })
    }
  } catch (error) {
    console.error('Error in checkout process:', error)
    return json({
      error: {
        create_quote: 'Failed to process checkout',
      },
      message: error instanceof Error ? error.message : 'Something went wrong',
    })
  }
}

export async function handlePaymentInfo(
  formData: FormData,
  context: AppLoadContext,
  request: Request,
) {
  const validatedFields = paymentInfoSchema.safeParse(Object.fromEntries(formData))
  if (!validatedFields.success) {
    return json({
      error: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid payment information',
    })
  }

  const cart = await context.cart.get()
  if (!cart) {
    return json({
      error: 'Cart not found',
      message: 'Your cart is empty',
    })
  }

  // Format cart items for Uber Direct manifest
  const manifestItems = formatCartItemsToManifest(cart.lines.nodes as CartLine[])

  // read the session of the checkout data
  const checkoutSession = createCheckoutSession(context)
  const session = await checkoutSession.getSession(request.headers.get('Cookie'))
  const checkoutData = session.get('checkoutData')

  if (!checkoutData) {
    return json({
      error: 'Checkout data not found',
      message: 'Something went wrong checking out please try again',
    })
  }

  const testDelivery: CreateDeliveryPayload = {
    quoteId: checkoutData.quote.id,
    pickup_name: MOCK_PICKUP_ADDRESS.pickup_name,
    pickup_address: {
      street_address: MOCK_PICKUP_ADDRESS.street_address,
      city: MOCK_PICKUP_ADDRESS.city,
      state: MOCK_PICKUP_ADDRESS.state,
      zip_code: MOCK_PICKUP_ADDRESS.zip_code,
      country: MOCK_PICKUP_ADDRESS.country,
    },
    pickup_phone_number: '+15555555555', // the factory phone number
    dropoff_name: checkoutData.firstName + ' ' + checkoutData.lastName,
    dropoff_address: formatUberAddress({
      street_address: [checkoutData.address],
      city: checkoutData.dropoffCity,
      state: checkoutData.province,
      zip_code: checkoutData.zipCode,
      country: checkoutData.country,
    }),
    dropoff_phone_number: checkoutData.phone,
    manifest_items: manifestItems,
  }

  const token = await getUberDirectToken(
    context.env.UBER_DIRECT_CLIENT_ID,
    context.env.UBER_DIRECT_CLIENT_SECRET,
  )

  // Process payment

  // create the delivery

  try {
    const deliveryResponse = await createDelivery(
      context.env.UBER_DIRECT_CUSTOMER_ID,
      token,
      testDelivery,
    )

    if (!deliveryResponse.success) {
      return json(handleUberApiError(deliveryResponse.error, 'create_delivery'), {
        status: 400,
      })
    }

    const delivery = deliveryResponse.data
    // sent to the client
    const deliveryDTO: DeliveryInfo = {
      // @ts-ignore (unknown property)
      id: delivery.id,
      // @ts-ignore (unknown property)
      tracking_url: delivery.tracking_url,
      // @ts-ignore (unknown property)
      status: delivery.status,
      // @ts-ignore (unknown property)
      dropoff_name: capitalize(delivery.dropoff.name),
      // @ts-ignore (unknown property)
      dropoff_phone_number: delivery.dropoff.phone_number,
      // @ts-ignore (unknown property)
      created_at: delivery.created,
      // @ts-ignore (unknow property)
      manifestItems: delivery.manifest_items,
    }

    // notes
    // create customer in the shopify ?
    // create order in the shopify ?
    // create checkout in the shopify ?
    // to update the quantiy of the products in the shopify ?

    return json(
      {
        success: true,
        message: 'Payment processed successfully',
        delivery: deliveryDTO,
        step: 2, // Move to success step
      },
      {
        headers: {
          'Set-Cookie': await checkoutSession.destroySession(session),
        },
      },
    )
  } catch (error) {
    console.error('Error in payment process:', error)
    return json(
      {
        error: {
          create_delivery: 'An unexpected error occurred during payment processing',
        },
        message: 'Unable to process your payment at this time',
      },
      { status: 500 },
    )
  }
}
