import { UseFormReturn } from 'react-hook-form'
import CustomInput from '~/components/features/Onboarding/input'
import CustomLabel from '~/components/features/Onboarding/label'
import { Checkbox } from '~/components/ui/checkbox'
import { CountryDropdown } from '~/components/ui/country-selector-input'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { PhoneInput } from '~/components/ui/phone-input'
import RegionSelect from '~/components/ui/region-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { cn } from '~/lib/utils/utils'
import { CheckoutInfoFormData } from '~/lib/validations/checkout'
interface DeliveryDetailsProps {
  form: UseFormReturn<CheckoutInfoFormData>
  error?: {
    firstName?: string
    phoneNumber?: string
    email?: string
  }
}

const deliveryTypes = [
  {
    id: 1,
    title: 'Standard',
    code: 'st',
  },
  {
    id: 2,
    title: 'Premium',
    code: 'pr',
  },
  {
    id: 3,
    title: 'Exclusive',
    code: 'ex',
  },
]

export function DeliveryDetails({ form, error }: DeliveryDetailsProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <div className="flex flex-row items-center gap-5">
          <h3 className="font-helvetica text-base font-medium text-black">Delivery Details</h3>
          <span className="h-[1px] w-full flex-1 bg-grey-300" />
        </div>
        <Form {...form}>
          <div className="flex flex-col gap-4 border-b border-grey-300 pb-5">
            {/* first segment (personal info) */}
            <div className="flex flex-row items-center gap-4">
              {/* first name */}
              <div className="flex flex-1 flex-col gap-1">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <CustomLabel htmlFor="firstName">First Name</CustomLabel>
                      <CustomInput
                        id="firstName"
                        placeholder="Kabir"
                        autoComplete="given-name"
                        aria-label="First Name"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* last name */}
              <div className="flex flex-1 flex-col gap-1">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <CustomLabel htmlFor="lastName">Last Name</CustomLabel>
                      <CustomInput
                        id="lastName"
                        placeholder="Lanre"
                        autoComplete="family-name"
                        aria-label="Last Name"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* phone number */}
            <div className="flex flex-1 flex-col gap-1">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <CustomLabel htmlFor="phone">Phone Number</CustomLabel>
                    <PhoneInput
                      {...field}
                      name="phone"
                      placeholder="Enter your phone number"
                      autoComplete="phone"
                      className="flex items-center"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* second segment (delivery address) */}
          <div className="flex flex-col gap-4">
            {/* delivery address */}
            <div className="flex flex-1 flex-col gap-1">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <CustomLabel htmlFor="address">Delivery Address</CustomLabel>
                    <CustomInput
                      id="address"
                      placeholder="No. 2"
                      autoComplete="street-address"
                      aria-label="Delivery Address"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row items-center gap-4">
              {/* zip code */}
              <div className="flex flex-1 flex-col gap-1">
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <CustomLabel htmlFor="zipCode">Zip Code</CustomLabel>
                      <CustomInput
                        id="zipCode"
                        placeholder="123456"
                        autoComplete="postal-code"
                        aria-label="Zip Code"
                        type="number"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Country */}
              <div className="flex flex-1 flex-col gap-1">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <CustomLabel>Country</CustomLabel>
                      <CountryDropdown
                        value={field.value}
                        onChange={(country) => {
                          field.onChange(country.alpha2)
                          // Reset city when country changes
                          form.setValue('province', '')
                        }}
                        placeholder="Select country"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Province */}
              <div className="flex flex-1 flex-col gap-1">
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => {
                    const countryCode = form.watch('country')
                    return (
                      <FormItem>
                        <CustomLabel htmlFor="province">Province</CustomLabel>
                        <RegionSelect
                          countryCode={countryCode}
                          value={field.value}
                          onChange={field.onChange}
                          className="flex h-full w-full justify-between rounded-lg border-grey-300 bg-white px-4 py-[0.59375rem] font-dm-sans font-medium text-grey-500 shadow-none"
                        />
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </div>
            </div>
            {/* Delivery Type */}
            <div className="flex flex-1 flex-col gap-1">
              <CustomLabel>Delivery Type</CustomLabel>
              <Select defaultValue="st">
                <SelectTrigger
                  className={cn(
                    'flex h-full w-full justify-between rounded-lg border-grey-300 bg-white px-4 py-[0.59375rem] font-dm-sans font-medium text-grey-500 shadow-none',
                  )}
                >
                  <SelectValue
                    placeholder="Select Religious Preference"
                    className="flex-1 text-grey-500"
                  />
                </SelectTrigger>
                <SelectContent>
                  {deliveryTypes.map(({ id, title, code }) => (
                    <SelectItem key={id} value={code} className="flex items-center gap-2">
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-row items-center gap-[10px] rounded-md bg-grey-100 px-4 py-3">
              <Checkbox />
              <p className="font-helvetica text-sm font-medium text-grey-800">Schedule Delivery</p>
            </div>
            <div className="flex flex-row items-center gap-[10px] rounded-md bg-grey-100 px-4 py-3 xl:hidden">
              <Checkbox />
              <p className="font-helvetica text-sm font-medium text-grey-800">
                Save Delivery Details
              </p>
            </div>
          </div>
        </Form>
      </div>
      {/* PROCEED CTA */}

      <div className="hidden flex-col gap-3 xl:flex">
        <div className="flex flex-row items-center gap-[10px]">
          <Checkbox />
          <p className="font-helvetica text-sm font-medium text-grey-800">Save Delivery Details</p>
        </div>
      </div>
    </div>
  )
}
