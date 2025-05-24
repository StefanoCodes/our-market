import { CustomerDetailsQuery } from 'customer-accountapi.generated'
import { UserDetail } from '~/graphql/customer-account/components/user-detail'
import { DeleteAddress } from './delete-address'
import { EditAddress } from './update-address'
import { UpdateDefaultAddress } from './update-default-address'

export function ListOfAddresses({ customer }: { customer: CustomerDetailsQuery['customer'] }) {
  return (
    <>
      {customer.addresses.nodes.map((address) => (
        <UserDetail
          key={address.id}
          className="max-w-44"
          value={address.formatted.join(', ')}
          label="Address"
        >
          <div className="flex w-full flex-row items-center gap-4">
            {/* if the default address is the same as the address, then hide the delete default address button */}
            {customer.defaultAddress?.id !== address.id && <DeleteAddress addressId={address.id} />}
            <EditAddress address={address} defaultAddressId={customer.defaultAddress?.id ?? ''} />
            <UpdateDefaultAddress customer={customer} addressId={address.id} />
          </div>
        </UserDetail>
      ))}
    </>
  )
}
