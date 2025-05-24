import { UseFormReturn } from 'react-hook-form'
import { PaymentInfoFormData } from '~/lib/validations/checkout'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import CustomLabel from '../Onboarding/label'
import CustomInput from '../Onboarding/input'
interface PaymentDetailsProps {
  form: UseFormReturn<PaymentInfoFormData>
}

export function PaymentDetails({ form }: PaymentDetailsProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* heading */}
      <h3 className="font-base font-helvetica font-medium text-black">Card Details</h3>
      {/* details */}
      <Form {...form}>
        <div className="flex flex-col gap-4">
          {/* card holder name */}
          <div className="flex flex-1 flex-col gap-1">
            <FormField
              control={form.control}
              name="cardHolder"
              render={({ field }) => (
                <FormItem>
                  <CustomLabel htmlFor="card-holder-name">Card Holder Name</CustomLabel>
                  <CustomInput
                    id="card-holder-name"
                    placeholder="Name"
                    autoComplete="card-holder-name"
                    aria-label="Card Holder Name"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* credit card number */}
          <div className="flex flex-1 flex-col gap-1">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <CustomLabel htmlFor="card-number">Card Number</CustomLabel>
                  <CustomInput
                    id="card-number"
                    placeholder="Card Number"
                    autoComplete="card-number"
                    aria-label="Card Number"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* CVV & Expiry Date */}
          <div className="flex flex-1 flex-row gap-4">
            {/* CVV */}
            <div className="flex flex-1 flex-col gap-1">
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <CustomLabel htmlFor="cvv">CVV</CustomLabel>
                    <CustomInput
                      id="cvv"
                      placeholder="CVV"
                      autoComplete="cvv"
                      aria-label="CVV"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Expiry Date */}
            <div className="flex flex-1 flex-col gap-1">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <CustomLabel htmlFor="expiry-date">Expiry Date</CustomLabel>
                    <CustomInput
                      id="expiry-date"
                      placeholder="MM/YY"
                      autoComplete="expiry-date"
                      aria-label="Expiry Date"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </Form>
    </div>
  )
}
