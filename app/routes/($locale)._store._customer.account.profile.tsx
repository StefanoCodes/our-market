import { useLoaderData, useRouteLoaderData } from '@remix-run/react'
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/server-runtime'
import { CustomerAddressInput } from '@shopify/hydrogen/customer-account-api-types'
import { CustomerUpdateInput } from '@shopify/hydrogen/storefront-api-types'
import { json } from '@shopify/remix-oxygen'
import { ListOfAddresses } from '~/graphql/customer-account/components/addresses-list'
import { CreateNewAddress } from '~/graphql/customer-account/components/create-new-address'
import { UpdateProfileInfo } from '~/graphql/customer-account/components/update-profile-info'
import { UserDetail } from '~/graphql/customer-account/components/user-detail'
import {
  CREATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
  UPDATE_DEFAULT_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations'
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery'
import { UPDATE_CUSTOMER_METAFIELD } from '~/graphql/customer-account/CustomerMetafieldMutations'
import {
  QUERY_PHONE_NUMBER,
  QUERY_STARTED_WELCOME_FLOW,
} from '~/graphql/customer-account/CustomerMetafieldQuery'
import { CUSTOMER_UPDATE_MUTATION } from '~/graphql/customer-account/CustomerUpdateMutation'
import { DEFAULT_WELCOME_FLOW_ROUTE } from '~/lib/integrations/klaviyo/constants'
import {
  addressSchema,
  customerUpdateSchema,
  deleteAddressSchema,
} from '~/lib/validations/customer'
import { useRootLoaderData } from '~/root'

export type AccountRouteLoader = typeof loader

export async function loader({ context }: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus()

  const token = await context.customerAccount.getAccessToken()
  const result = await context.cart.updateBuyerIdentity({ customerAccessToken: token })
  const headers = context.cart.setCartId(result.cart.id)
  headers.append('Set-Cookie', await context.session.commit())
  const [customerStartedWelcomeFlow, customerPhoneNumberQuery] = await Promise.all([
    context.customerAccount.query(QUERY_STARTED_WELCOME_FLOW),
    context.customerAccount.query(QUERY_PHONE_NUMBER),
  ])
  const phoneNumber = customerPhoneNumberQuery.data.customer.metafield?.value ?? ''
  const hasStartedWelcomeFlow = customerStartedWelcomeFlow.data.customer.metafield?.value
  if (hasStartedWelcomeFlow === undefined || hasStartedWelcomeFlow === 'false') {
    return redirect(DEFAULT_WELCOME_FLOW_ROUTE, {
      status: 301,
    })
  }
  return json({ phoneNumber })
}

export function UseAccountProfileLoaderData() {
  return useRouteLoaderData<AccountRouteLoader>('routes/($locale)._store._customer.account.profile')
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { customerAccount } = context
  const form = await request.formData()
  const intent = form.get('intent')

  try {
    switch (intent) {
      case 'customer-update': {
        const customer: CustomerUpdateInput = {}
        const validatedFields = customerUpdateSchema.safeParse({
          firstName: form.get('firstName'),
          lastName: form.get('lastName'),
          phoneNumber: form.get('phoneNumber'),
        })

        if (!validatedFields.success) {
          return json({ error: 'Invalid fields', customer: null, success: false }, { status: 400 })
        }

        customer.firstName = validatedFields.data.firstName
        customer.lastName = validatedFields.data.lastName

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
          return json({
            error: null,
            customer: data?.customerUpdate?.customer,
            success: true,
            intent: 'customer-update',
          })
        } catch (e) {
          console.error('Error Updating Welcome Flow Account:', e)
          return json(
            { error: 'Something Went Wrong', customer: null, success: false },
            { status: 400 },
          )
        }
      }
      case 'address-create': {
        // zod validation
        const validatedFields = addressSchema.safeParse({
          firstName: form.get('firstName'),
          lastName: form.get('lastName'),
          address1: form.get('address1'),
          address2: form.get('address2'),
          company: form.get('company'),
          city: form.get('city'),
          zip: form.get('zip'),
          territoryCode: form.get('territoryCode'),
          zoneCode: form.get('zoneCode'),
          phoneNumber: form.get('phoneNumber'),
        })

        if (!validatedFields.success) {
          return json({ error: 'Invalid fields', success: false }, { status: 400 })
        }

        const address: CustomerAddressInput = {
          address1: validatedFields.data.address1,
          address2: validatedFields.data.address2,
          city: validatedFields.data.city,
          zip: validatedFields.data.zip,
          company: validatedFields.data.company,
          territoryCode: validatedFields.data.territoryCode,
          zoneCode: validatedFields.data.zoneCode,
          phoneNumber: validatedFields.data.phoneNumber,
          firstName: validatedFields.data.firstName,
          lastName: validatedFields.data.lastName,
        }

        const { data, errors } = await customerAccount.mutate(CREATE_ADDRESS_MUTATION, {
          variables: {
            address,
          },
        })

        if (errors?.length) {
          throw new Error(errors[0].message)
        }

        if (data?.customerAddressCreate?.userErrors?.length) {
          throw new Error(data.customerAddressCreate.userErrors[0].message)
        }

        if (!data?.customerAddressCreate?.customerAddress) {
          throw new Error('Address creation failed.')
        }

        return json({
          error: null,
          customer: data?.customerAddressCreate?.customerAddress,
          success: true,
          intent: 'address-create',
        })
      }
      case 'update-address': {
        // reads this from the hidden input
        const defaultAddressId = form.get('defaultAddressId')
        const { success, data: addressId } = deleteAddressSchema.safeParse({
          addressId: form.get('addressId'),
        })
        if (!success) {
          return json(
            {
              error: 'Invalid Address Id',
              success: false,
            },
            {
              status: 400,
            },
          )
        }
        // zod validation
        const validatedFields = addressSchema.safeParse({
          firstName: form.get('firstName'),
          lastName: form.get('lastName'),
          address1: form.get('address1'),
          address2: form.get('address2'),
          city: form.get('city'),
          zip: form.get('zip'),
          territoryCode: form.get('territoryCode'),
          zoneCode: form.get('zoneCode'),
          phoneNumber: form.get('phoneNumber'),
          company: form.get('company'),
        })

        if (!validatedFields.success) {
          return json({ error: 'Invalid fields', success: false }, { status: 400 })
        }

        const address: CustomerAddressInput = {
          address1: validatedFields.data.address1,
          address2: validatedFields.data.address2,
          city: validatedFields.data.city,
          zip: validatedFields.data.zip,
          territoryCode: validatedFields.data.territoryCode,
          zoneCode: validatedFields.data.zoneCode,
          phoneNumber: validatedFields.data.phoneNumber,
          firstName: validatedFields.data.firstName,
          lastName: validatedFields.data.lastName,
          company: validatedFields.data.company,
        }

        const { data, errors } = await customerAccount.mutate(UPDATE_ADDRESS_MUTATION, {
          variables: {
            addressId: addressId.addressId,
            address,
            defaultAddress: defaultAddressId === addressId.addressId,
          },
        })

        if (errors?.length) {
          throw new Error(errors[0].message)
        }

        if (data?.customerAddressUpdate?.userErrors?.length) {
          throw new Error(data.customerAddressUpdate.userErrors[0].message)
        }

        if (!data?.customerAddressUpdate?.customerAddress) {
          throw new Error('Address creation failed.')
        }

        return json({
          error: null,
          customer: data?.customerAddressUpdate?.customerAddress,
          success: true,
          intent: 'update-address',
        })
      }
      case 'delete-address': {
        // address id
        const addressId = form.get('addressId')
        // validate
        const validatedFields = deleteAddressSchema.safeParse({
          addressId,
        })

        if (!validatedFields.success) {
          return json({ error: 'Invalid fields', success: false }, { status: 400 })
        }
        const { data, errors } = await customerAccount.mutate(DELETE_ADDRESS_MUTATION, {
          variables: { addressId: validatedFields.data.addressId },
        })

        if (errors?.length) {
          throw new Error(errors[0].message)
        }
        return json({ error: null, success: true, intent: 'delete-address' }, { status: 200 })
      }
      case 'update-default-address': {
        const addressId = form.get('addressId') as string
        const { data, errors } = await customerAccount.mutate(UPDATE_DEFAULT_ADDRESS_MUTATION, {
          variables: { addressId },
        })
        if (errors?.length) {
          throw new Error(errors[0].message)
        }
        return json(
          {
            error: null,
            success: true,
            intent: 'update-default-address',
            customer: data?.customerAddressUpdate?.customerAddress,
          },
          { status: 200 },
        )
      }
      default:
        return json({ error: 'Invalid intent', success: false }, { status: 400 })
    }
  } catch (error: any) {
    return json({ error: error.message, customer: null, success: false }, { status: 400 })
  }
}

export default function AccountProfile() {
  const data = useRootLoaderData()
  const routeData = useLoaderData<AccountRouteLoader>()
  const defaultPhoneNumber = routeData.phoneNumber
  const customer = data?.customer?.data?.customer
  if (!customer) {
    return redirect('/')
  }

  return (
    <div className="flex min-h-[300px] flex-col gap-6 rounded-2xl bg-white p-4 lg:flex-row lg:px-8 lg:py-6">
      <div className="mx-auto w-full flex-1 rounded-2xl border border-grey-300 p-5 xl:mx-0">
        {/* left side user deatils */}
        <div className="flex flex-col gap-6">
          {/* title */}
          <div className="flex w-full flex-row items-center justify-between py-2">
            <h2 className="font-helvetica text-base font-medium text-black">User Details</h2>
            {/* dialog for updaing the customer info */}
            <UpdateProfileInfo customer={customer} />
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-grey-300 bg-grey-100 p-4">
            <UserDetail value={customer?.firstName ?? ''} label="First Name" />
            <UserDetail value={customer?.lastName ?? ''} label="Last Name" />
            <UserDetail value={customer?.emailAddress?.emailAddress ?? ''} label="Email" />
            <UserDetail value={defaultPhoneNumber} label="Phone Number" />
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-2xl flex-1 rounded-2xl border border-grey-300 bg-white p-5 xl:mx-0">
        <div className="flex flex-col gap-6">
          {/* title */}
          <div className="flex w-full flex-row items-center justify-between border-b border-grey-300 py-2">
            <h2 className="font-helvetica text-base font-medium text-black">Saved Address</h2>
            <CreateNewAddress customer={customer} phoneNumber={defaultPhoneNumber} />
          </div>
          {customer.addresses.nodes.length > 0 && (
            <div className="flex w-full flex-col gap-6 rounded-xl border border-grey-300 bg-grey-100 p-4">
              <ListOfAddresses customer={customer} />
            </div>
          )}
          {/* if the customer has no addresses, then show a message */}
          {customer.addresses.nodes.length === 0 && (
            <div className="flex h-full items-center justify-center font-helvetica text-sm text-grey-600">
              You have no saved addresses.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
