import { zodResolver } from '@hookform/resolvers/zod'
import { Await, data, useFetcher } from '@remix-run/react'
import { CartForm, Image, Money, useOptimisticCart } from '@shopify/hydrogen'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CartApiQueryFragment } from 'storefrontapi.generated'
import { SummaryItem } from '~/components/features/Orders/order-overview'
import { ButtonWithLoading } from '~/components/ui/button/button-with-loading'
import ChevronRightIcon from '~/components/ui/icons/chevron-right'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { DeliveryInfo } from '~/lib/integrations/uber/types'
import { calculateTotal, cn } from '~/lib/utils/utils'
import {
  CheckoutInfoFormData,
  checkoutInfoSchema,
  PaymentInfoFormData,
  paymentInfoSchema,
} from '~/lib/validations/checkout'
import { useRootLoaderData } from '~/root'
import ApplyDiscountCode from '../Cart/ui/apply-discount-code'
import { CartLineItem, CartLineItemSkeleton } from '../Cart/ui/cart-line-item'
import { DeliveryDetails } from './delivery-details'
import { PaymentDetails } from './payment-detailts'
import { SuccessStep } from './success-step'

interface ActionData {
  error?: Record<string, string>
  success?: boolean
  fields?: Record<string, string>
  step?: number
  message?: string
  delivery?: DeliveryInfo
}

const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '50%' : '-50%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '50%' : '-50%',
    opacity: 0,
  }),
}

const steps = [
  {
    // title: 'Checkout Information',
  },
  {
    // title: 'Payment Information',
  },
  {
    // title: 'Success
  },
]

export default function CheckoutFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)
  const fetcher = useFetcher<ActionData>()
  const isFinalStep = currentStep === steps.length - 1
  const isSubmitting = fetcher.state === 'submitting'

  const checkoutInfoForm = useForm<CheckoutInfoFormData>({
    resolver: zodResolver(checkoutInfoSchema),
    mode: 'onTouched',
  })
  const paymentInfoForm = useForm<PaymentInfoFormData>({
    resolver: zodResolver(paymentInfoSchema),
    mode: 'onTouched',
  })

  useEffect(() => {
    if (fetcher.data?.error) return

    if (fetcher.data?.success) {
      if (fetcher.data?.message) {
        toast.success(fetcher.data?.message)

      }
      handleSuccessfulSubmission(fetcher.data)
    }
  }, [fetcher.data])

  const handleSuccessfulSubmission = (data: ActionData) => {
    if (data.step !== undefined) {
      setDirection(data.step > currentStep ? 1 : -1)
      setCurrentStep(data.step)
      return
    }

    // If it was successful and final step
    if (isFinalStep) {
      // Reset forms and handle completion
      checkoutInfoForm.reset()
      paymentInfoForm.reset()
      // Navigate to success page or show success message
      return
    }

    // Move to next step
    nextStep()
  }
  const nextStep = () => {
    setDirection(1)
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    setDirection(-1)
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <fetcher.Form
            action="/resource/checkout"
            method="POST"
            className="flex flex-col gap-6"
            onSubmit={checkoutInfoForm.handleSubmit((data) => {
              fetcher.submit(
                { ...data, intent: 'checkout-info' },
                { action: '/resource/checkout', method: 'POST' },
              )
            })}
          >
            <DeliveryDetails form={checkoutInfoForm} error={fetcher.data?.error} />
            <ButtonWithLoading isLoading={isSubmitting}>Proceed</ButtonWithLoading>
            {/* error messages related to the create quote request */}
            <div className="flex flex-col gap-2">
              {fetcher.data?.error?.create_quote && (
                <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
                  <p>{fetcher.data.error.create_quote}</p>
                </div>
              )}
            </div>
          </fetcher.Form>
        )

      case 1:
        return (
          <fetcher.Form
            action="/resource/checkout"
            method="POST"
            className="flex flex-col gap-6"
            onSubmit={paymentInfoForm.handleSubmit((data) => {
              fetcher.submit(
                { ...data, intent: 'payment-info' },
                { action: '/resource/checkout', method: 'POST' },
              )
            })}
          >
            <div className="w-full">
              <div className="mb-6 flex items-center gap-4">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-grey-600 hover:text-grey-800"
                >
                  <ChevronRightIcon className="h-5 w-5 rotate-180" />
                  <span className="font-helvetica text-sm">Back to delivery details</span>
                </button>
              </div>

              <Tabs defaultValue="credit" className="flex w-full flex-col gap-5">
                <TabsList className="flex w-full flex-row gap-5 bg-white px-0">
                  <TabsTrigger value="credit">Credit Card</TabsTrigger>
                  <TabsTrigger value="mobile">Mobile Money</TabsTrigger>
                  <TabsTrigger value="debit">Debit Card</TabsTrigger>
                </TabsList>
                <TabsContent value="credit">
                  <div className="flex flex-col gap-6">
                    <PaymentDetails form={paymentInfoForm} />
                    <ButtonWithLoading isLoading={isSubmitting}>Make Payment</ButtonWithLoading>
                    <div className="flex flex-col gap-2">
                      {fetcher.data?.error?.create_delivery && (
                        <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
                          <p>{fetcher.data.error.create_delivery}</p>
                        </div>
                      )}

                      {fetcher.data?.error?.create_delivery && (
                        <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
                          <p>{fetcher.data.error.create_delivery}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="mobile">Mobile Money</TabsContent>
                <TabsContent value="debit">Debit Card</TabsContent>
              </Tabs>
            </div>
          </fetcher.Form>
        )
      case 2:
        return <SuccessStep delivery={fetcher.data?.delivery as DeliveryInfo} />
      default:
        return null
    }
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-container px-4 xl:px-16">
        <div className="flex flex-col items-center xl:flex-row xl:items-start xl:gap-10">
          <div className="min-h-checkout-form-details-container w-full flex-1 overflow-hidden pt-7 xl:mb-[5.25rem] xl:mt-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <CheckoutOrderDetails />
        </div>
      </div>
    </section>
  )
}

function CheckoutOrderDetails() {
  const data = useRootLoaderData()
  if (!data?.cart) return null

  return (
    <div className="relative min-h-checkout-order-details w-full flex-1 pb-10 xl:py-10">
      {/* Background image */}
      <div className="absolute inset-0 hidden bg-brand-green xl:block">
        <Image
          src={`/backgrounds/marketing-announcement-background-green.svg`}
          className={cn('absolute h-full w-full object-cover opacity-20 mix-blend-hard-light')}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      </div>

      {/* Main content container */}
      <div className="md:max-h-auto relative z-20 mx-auto max-h-[var(--checkout-order-details-content)] w-full overflow-hidden rounded-2xl bg-white md:h-[var(--checkout-order-details-content)] xl:max-w-checkout-order-details-width">
        <div className="flex h-full w-full flex-col">
          <Suspense fallback={<LoadingCartSkeleton />}>
            <Await resolve={data.cart}>
              {(resolvedCart) => {
                const cart = resolvedCart
                const optimisticCart = useOptimisticCart(cart)
                const subtotal = optimisticCart.cost?.subtotalAmount
                const total = optimisticCart.cost?.totalAmount

                return (
                  <>
                    {/* Header - Fixed */}
                    <div className="flex min-h-checkout-order-details-header w-full flex-row items-center justify-between px-8 py-6">
                      <h2 className="font-helvetica text-md font-medium text-black">
                        Order Details
                      </h2>
                      <ApplyDiscountCode discountCodes={cart?.discountCodes ?? []} />
                    </div>

                    {/* Scrollable cart items */}
                    <div className="hide-scrollbars flex-1 overflow-y-auto px-8">
                      <CheckoutOrderCartLineItems cart={cart} />
                    </div>

                    {/* Footer - Fixed */}
                    <div className="min-h-checkout-order-details-footer border-t border-grey-300 px-8">
                      <div className="flex flex-col gap-4 py-8">
                        {/* {cart?.discountCodes?.length &&
                          // map over all the discount codes and display them
                          cart?.discountCodes?.map((code, idx) => (
                            <div
                              key={idx}
                              className="flex w-full flex-row items-center justify-between rounded-sm bg-green-100 p-[10px] text-brand-green"
                            >
                              <p className="font-helvetica text-sm font-medium uppercase">
                                discount code applied
                              </p>
                              <div className="flex flex-row items-center gap-[6px]">
                                <span className="font-helvetica text-sm font-medium uppercase">
                                  {code.code}
                                </span>

                                <CartForm
                                  route="/cart"
                                  inputs={{ discountCodes: [code.code] }}
                                  action={CartForm.ACTIONS.DiscountCodesUpdate}
                                >
                                  <X className="h-4 w-4 text-black" type="submit" />
                                </CartForm>
                              </div>
                            </div>
                          ))} */}

                        {/* Summary Items */}
                        <div className="flex flex-col gap-4">
                          {/* item */}
                          <div className="flex flex-row items-center justify-between">
                            <dt>Subtotal:</dt>
                            <dd>
                              {optimisticCart.cost?.subtotalAmount?.amount ? (
                                <Money data={optimisticCart.cost?.subtotalAmount} />
                              ) : (
                                '-'
                              )}
                            </dd>
                          </div>

                          {/* Discounts */}

                          <div className="flex flex-row items-center justify-between">
                            <dt>Discounts:</dt>
                            <dd>$0.00</dd>
                          </div>

                          {/* Delivery */}
                          <div className="flex flex-row items-center justify-between">
                            <dt>Delivery:</dt>
                            <dd>
                              {optimisticCart.cost?.checkoutChargeAmount ? (
                                <Money data={optimisticCart.cost?.checkoutChargeAmount} />
                              ) : (
                                '-'
                              )}
                            </dd>
                          </div>

                          {/* Total */}
                          <div className="flex flex-row items-center justify-between">
                            <dt className="font-helvetica text-base font-regular capitalize text-grey-600">
                              Total:
                            </dt>
                            <dd className="text-md text-[#292D32]">
                              {optimisticCart.cost?.totalAmount?.amount ? (
                                <Money data={optimisticCart.cost?.totalAmount} />
                              ) : (
                                '-'
                              )}
                            </dd>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function CheckoutOrderCartLineItems({ cart: originalCart }: { cart: CartApiQueryFragment | null }) {
  const cart = useOptimisticCart(originalCart)
  const isThereCartLineItems = cart?.lines.nodes.length > 0 // will have an empty page if there are no items in the cart

  return (
    <div className="flex h-full flex-col gap-4 px-2">
      {cart?.lines.nodes.map((line) => (
        <CartLineItem key={line.id} line={line} hideQuantityAdjusters />
      ))}
    </div>
  )
}

function LoadingCartSkeleton() {
  return (
    <div className="min-h-[calc(var(--checkout-order-details-height) - var(--checkout-order-details-header-height) - var(--checkout-order-details-footer-height))] w-full flex-1 overflow-y-auto px-8 py-4">
      <div className="flex flex-col gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <CartLineItemSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
