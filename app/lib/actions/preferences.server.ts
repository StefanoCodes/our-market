import { AppLoadContext } from '@remix-run/server-runtime'
import {
  welcomeFlowAccountSchema,
  welcomeFlowBirthOfDateSchema,
  welcomeFlowCountrySchema,
  welcomeFlowDietarySchema,
  welcomeFlowLanguageSchema,
} from '../utils/welcome'
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery'
import { UPDATE_CUSTOMER_METAFIELD } from '~/graphql/customer-account/CustomerMetafieldMutations'
import { json } from '@shopify/remix-oxygen'
import { CustomerUpdateInput } from '@shopify/hydrogen/customer-account-api-types'
import { CUSTOMER_UPDATE_MUTATION } from '~/graphql/customer-account/CustomerUpdateMutation'
import { PhoneNumber } from 'react-phone-number-input'
// update customer profile
export async function handleUpdateCustomerProfile(
  request: Request,
  context: AppLoadContext,
  formData: FormData,
) {
  const customer: CustomerUpdateInput = {}
  const validatedFields = welcomeFlowAccountSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    phoneNumber: formData.get('phoneNumber'),
  })
  if (!validatedFields.success) {
    return json({ message: 'Invalid fields', success: false }, { status: 400 })
  }

  customer.firstName = validatedFields.data.firstName
  customer.lastName = validatedFields.data.lastName
  // to get the customer id
  const customerData = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY)

  try {
    const [customerUpdatePromise, customerPhoneNumberUpdatePromise] = await Promise.all([
      context.customerAccount.mutate(CUSTOMER_UPDATE_MUTATION, {
        variables: { customer },
      }),
      context.customerAccount.mutate(UPDATE_CUSTOMER_METAFIELD, {
        variables: {
          metafields: [
            {
              key: 'phone',
              namespace: 'custom',
              type: 'single_line_text_field',
              value: validatedFields.data.phoneNumber,
              ownerId: customerData.data.customer.id,
            },
          ],
        },
      }),
    ])
    const { data, errors } = customerUpdatePromise
    if (errors?.length) {
      throw new Error(errors[0].message)
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.')
    }

    if (customerPhoneNumberUpdatePromise.data.metafieldsSet?.userErrors[0]) {
      return {
        success: false,
        // @todo can be improve with mapping over all erros and then joining them
        message: 'Something Went Wrong',
      }
    }
  } catch (e) {
    console.error('Error Updating Welcome Flow Account:', e)
  }

  return json(
    {
      success: true,
      message: 'Account Info Updated',
    },
    {
      status: 200,
    },
  )
}
// update language preference
export async function handleUpdateLanguagePreference(
  request: Request,
  context: AppLoadContext,
  formData: FormData,
) {
  const customerData = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY)

  const language = formData.get('language') as string
  const validatedData = {
    language,
  }

  const validationResult = welcomeFlowLanguageSchema.safeParse(validatedData)
  if (!validationResult.success) {
    return {
      success: false,
      message: 'Validation Error',
    }
  }

  try {
    const res = await context.customerAccount.mutate(UPDATE_CUSTOMER_METAFIELD, {
      variables: {
        metafields: [
          {
            key: 'language_preference',
            namespace: 'custom',
            type: 'list.single_line_text_field',
            value: JSON.stringify([validationResult.data.language]),
            ownerId: customerData.data.customer.id,
          },
        ],
      },
    })

    if (res.data.metafieldsSet?.userErrors[0]) {
      return {
        success: false,
        // @todo can be improve with mapping over all erros and then joining them
        message: 'Something Went Wrong',
      }
    }
  } catch (e) {
    return console.error(`Error: Updating Language Preference`, e)
  }

  return json(
    {
      success: true,
      message: 'Language Preference Set',
    },
    {
      status: 200,
    },
  )
}
// update country preference
export async function handleUpdateCountryOfOrigin(
  request: Request,
  context: AppLoadContext,
  formData: FormData,
) {
  const customerData = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY)
  const country = formData.get('country')

  const validatedData = {
    country,
  }

  const validationResult = welcomeFlowCountrySchema.safeParse(validatedData)
  if (!validationResult.success) {
    return {
      success: false,
      message: 'Validation Error',
    }
  }

  // data type safe & in the right shape from here

  // perform mutation

  try {
    const res = await context.customerAccount.mutate(UPDATE_CUSTOMER_METAFIELD, {
      variables: {
        metafields: [
          {
            key: 'country_of_origin',
            namespace: 'custom',
            type: 'list.single_line_text_field',
            value: JSON.stringify([validationResult.data.country]),
            ownerId: customerData.data.customer.id,
          },
        ],
      },
    })

    // // check for any errors from the mutation
    if (res.data.metafieldsSet?.userErrors[0]) {
      return {
        success: false,
        // @todo can be improve with mapping over all erros and then joining them
        message: 'Something Went Wrong',
      }
    }
  } catch (e) {
    return console.error('Error updating country of origin:', e)
  }

  return json(
    {
      success: true,
      message: 'Country Of Origin Set',
    },
    {
      status: 200,
    },
  )
}
// update birth date
export async function handleUpdateDateOfBirth(
  request: Request,
  context: AppLoadContext,
  formData: FormData,
) {
  const customerData = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY)

  const date = formData.get('date') as string

  const validatedData = {
    date,
  }

  const validationResult = welcomeFlowBirthOfDateSchema.safeParse(validatedData)
  if (!validationResult.success) {
    return {
      success: false,
      message: 'Validation Error',
    }
  }

  // data type safe & in the right shape from here

  // perform mutation
  try {
    const res = await context.customerAccount.mutate(UPDATE_CUSTOMER_METAFIELD, {
      variables: {
        metafields: [
          {
            key: 'birth_date',
            namespace: 'facts',
            type: 'date',
            value: validatedData.date,
            ownerId: customerData.data.customer.id,
          },
        ],
      },
    })

    // // check for any errors from the mutation
    if (res.data.metafieldsSet?.userErrors[0]) {
      return {
        success: false,
        // @todo can be improve with mapping over all erros and then joining them
        message: 'Something Went Wrong',
      }
    }
  } catch (e) {
    return console.error('Error: Updating Date Of Birth', e)
  }
  // if all good return success
  return json(
    {
      success: true,
      message: 'Date of Birth Set',
    },
    {
      status: 200,
    },
  )
}
// update dietary Preference
export async function handleUpdateDietaryPreference(
  request: Request,
  context: AppLoadContext,
  formData: FormData,
) {
  const customerData = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY)

  // Get all dietary values from formData (since it's now multiple checkboxes)
  const dietaryValues = formData.getAll('dietary') as string[]

  const validatedData = {
    dietary: dietaryValues,
  }

  const validationResult = welcomeFlowDietarySchema.safeParse(validatedData)
  if (!validationResult.success) {
    return {
      success: false,
      message: 'Validation Error',
    }
  }

  // data type safe & in the right shape from here

  // perform mutation
  try {
    const res = await context.customerAccount.mutate(UPDATE_CUSTOMER_METAFIELD, {
      variables: {
        metafields: [
          {
            key: 'dietary_preferences',
            namespace: 'custom',
            type: 'list.single_line_text_field',
            value: JSON.stringify(validationResult.data.dietary),
            ownerId: customerData.data.customer.id,
          },
        ],
      },
    })

    // // check for any errors from the mutation
    if (res.data.metafieldsSet?.userErrors[0]) {
      return {
        success: false,
        // @todo can be improve with mapping over all erros and then joining them
        message: 'Something Went Wrong',
      }
    }
  } catch (e) {
    return console.error('Error: Updating Dietary Preference', e)
  }

  return json(
    {
      success: true,
      message: 'Dietary Preference Set',
    },
    {
      status: 200,
    },
  )
}
