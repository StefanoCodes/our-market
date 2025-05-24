import { cn } from '~/lib/utils/utils'
import { Image } from '@shopify/hydrogen'
import { MoneyV2 } from '@shopify/hydrogen/customer-account-api-types'
import {
  CurrentOrderLineItemFullFragment,
  CurrentOrdersQuery,
  CustomerOrdersQuery,
  OrderLineItemFullFragment,
  PastOrdersQuery,
} from 'customer-accountapi.generated'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog/notification-dialog'
import { ImageUploader } from '~/components/ui/image-uploader'
import { Rating } from '~/components/ui/rating'
import { Textarea } from '~/components/ui/textarea'
import { CreateReviewForm } from '~/lib/integrations/judge-me/components/create-review'
import CustomInput from '../Onboarding/input'
import CustomLabel from '../Onboarding/label'
import { redirect, useFetcher } from '@remix-run/react'
import { useRootLoaderData } from '~/root'
import { createReviewSchema, CreateReviewSchemaType } from '~/lib/integrations/judge-me/validations'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { ButtonWithLoading } from '~/components/ui/button/button-with-loading'

type ActionResponse = {
  success: boolean
  error?: string
  message?: string
}
export function OrderOverview({
  order,
}: {
  order:
  | PastOrdersQuery['customer']['orders']['nodes'][0]
  | CurrentOrdersQuery['customer']['orders']['nodes'][0]
}) {
  const data = useRootLoaderData()
  const customer = data?.customer?.data.customer
  if (!customer) redirect('/')
  const [showDialog, setShowDialog] = useState(false)
  const fetcher = useFetcher<ActionResponse>()
  const isSubmitting = fetcher.state === 'submitting'
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false)
  const createReviewForm = useForm<CreateReviewSchemaType>({
    resolver: zodResolver(createReviewSchema),
    mode: 'onSubmit',
    defaultValues: {
      rating: 5,
      name: customer?.firstName ?? '',
      email: customer?.emailAddress?.emailAddress ?? '',
      title: '',
      body: '',
    },
  })

  useEffect(() => {

    if (fetcher.data?.error) {
      toast.error(`Something went wrong while creating the review, please try again later`)
    }
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message)
      setShowDialog(false)
      createReviewForm.reset()
    }
  }, [fetcher.data])

  // todo setup the create reivew form (store level review)
  return (
    <div className="flex flex-col gap-4 px-8 py-6">
      {/* Order iD + Drop a review */}
      <div className="flex flex-col items-center justify-between gap-2 xl:flex-row xl:gap-0">
        <h2 className="font-helvetica text-md font-medium text-black">Order ID: {order.name}</h2>
        {/* dialog trigger */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button
              size={'sm'}
              className="h-auto rounded-md bg-green-100 px-8 py-2 text-brand-green shadow-none hover:bg-green-200"
            >
              Drop a feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="hide-scrollbars max-h-[100dvh] min-h-[240px] max-w-[470px] overflow-y-auto px-8 py-6 xl:top-4">
            <DialogHeader>
              <DialogTitle className="text-left font-helvetica text-md font-medium">
                Submit Review
              </DialogTitle>

              <DialogDescription className="pt-6">
                {/* Rate Your Experience */}
                <fetcher.Form
                  method="post"
                  action="/resource/judge"
                  onSubmit={createReviewForm.handleSubmit((data) => {

                    fetcher.submit(
                      { ...data, intent: 'create-review' },
                      { action: '/resource/judge', method: 'POST' },
                    )
                  })}
                >
                  <Form {...createReviewForm}>
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col items-start gap-3 lg:max-w-64">
                        <h3 className="font-helvetica text-base font-medium text-black">
                          Rate Your Experience
                        </h3>
                        <FormField
                          control={createReviewForm.control}
                          name="rating"
                          render={({ field: { onChange, value } }) => (
                            <FormItem className="flex flex-col items-start">
                              <CustomLabel htmlFor="rating">Rating:</CustomLabel>
                              <Rating
                                interactive={true}
                                rating={0}
                                value={value}
                                onRatingChange={(newRating) => {
                                  onChange(newRating)
                                  createReviewForm.setValue('rating', newRating, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  })
                                }}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {/* Title */}
                      <div className="flex w-full flex-col items-start gap-[6px]">
                        <FormField
                          control={createReviewForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem className="flex w-full flex-col items-start">
                              <CustomLabel htmlFor="title">Title:</CustomLabel>
                              <CustomInput
                                id={'title'}
                                placeholder={'Great product'}
                                autoComplete="title"
                                aria-label="Title"
                                className="w-full"
                                {...field}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {/* Message */}
                      <div className="flex flex-col items-start gap-[6px]">
                        <FormField
                          control={createReviewForm.control}
                          name="body"
                          render={({ field }) => (
                            <FormItem className="flex w-full flex-col items-start">
                              <CustomLabel htmlFor="body">Description:</CustomLabel>
                              <Textarea
                                spellCheck
                                rows={5}
                                placeholder="Review.."
                                id={'body'}
                                autoComplete="description"
                                aria-label="Description"
                                {...field}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {/* @todo figure out if he does plan to upload where are these images hosted ? */}
                      {/* <div className="flex w-full flex-col gap-[6px]">
                    <CustomLabel className="self-start text-sm">Attach Image</CustomLabel>
                    <ImageUploader />
                    </div> */}

                      <ButtonWithLoading isLoading={isSubmitting}>
                        {!isSubmitting ? `Submit` : `Submitting...`}
                      </ButtonWithLoading>
                    </div>
                  </Form>
                </fetcher.Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {/* Timeline */}
      <div className="flex flex-col gap-6 rounded-xl border border-grey-400 p-5">
        {/* title */}
        <div className="flex w-full flex-row items-center justify-between">
          <h3 className="font-helvetica text-base font-medium text-black">Timeline</h3>
          <a
            href={order.statusPageUrl}
            target="_blank"
            rel="noreferrer"
            className="font-helvetica text-sm font-regular text-brand-green"
          >
            View Order Status →
          </a>
        </div>
        {/* timeline items */}
        <div className="flex flex-col">
          {/* in future map over this to make sure hte fullfillment stuff is good to go */}
          <TimeLineItem
            date={order.createdAt}
            status={order.fulfillments.nodes[0]?.status ?? ''}
            title={`Order Confirmed`}
            body={`The order has been successfully confirmed by our system`}
          />
          <TimeLineItem
            date={order.processedAt}
            status={order.fulfillments.nodes[1]?.status ?? ''}
            title={`Order Paid`}
            body={`Your Payment has been received`}
          />
          <TimeLineItem
            // date={order.fulfillments.nodes[2]?.createdAt ?? ''}
            status={order.fulfillments.nodes[2]?.status ?? ''}
          />
          <TimeLineItem
            // date={order.fulfillments.nodes[3]?.createdAt ?? ''}
            status={order.fulfillments.nodes[3]?.status ?? ''}
          />
        </div>
      </div>
      {/* Order Items */}
      <div className="flex flex-col gap-6 rounded-xl border border-grey-400 p-5">
        {/* title */}
        <h3 className="font-helvetica text-base font-medium text-black">Order Items</h3>
        <div className="flex flex-col gap-6">
          {order.lineItems.nodes.map((item) => {
            return (
              <OrderItem
                key={item.id}
                productId={item.productId ?? ''}
                title={item.title}
                price={item.price?.amount ?? ''}
                quantity={item.quantity}
                image={item.image?.url ?? ''}
                variantTitle={item.variantTitle ?? ''}
              />
            )
          })}
        </div>
      </div>
      {/* Summary (total) */}
      <div className="flex flex-col gap-6 rounded-xl border border-grey-400 p-5">
        {/* title */}
        <h3 className="font-helvetica text-base font-medium text-black">Summary</h3>
        <div className="flex flex-col gap-4">
          {order.subtotal && <SummaryItem label="sub total" value={order.subtotal} />}
          {/* todo fix this */}
          {/* {order.discountApplications.nodes.length > 0 && (
            <SummaryItem label="Discounts" value={order.discountApplications.nodes[0]} />
          )} */}
          {order.totalShipping && <SummaryItem label="Delivery" value={order.totalShipping} />}
          {order.totalPrice && <SummaryItem label="Total" value={order.totalPrice} />}
        </div>
      </div>
    </div>
  )
}

function TimeLineItem({
  date,
  status,
  title,
  body,
}: {
  date?: string
  status?: string
  title?: string
  body?: string
}) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    : ''
  const time = date
    ? new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    })
    : ''
  return (
    <div className="relative flex flex-row gap-6 border-l-2 border-dashed border-l-brand-green pb-7">
      {/* dots */}
      <span className="absolute -left-[4px] -top-[8px] h-[6px] w-[6px] rounded-full bg-brand-green" />
      {/* content */}
      <div className="flex w-full flex-row items-center justify-between">
        {/* order status */}
        <div className="flex flex-col gap-1 pl-4">
          <h4 className="font-helvetica text-base font-medium text-[#292D32]">
            {title ?? 'Order Confirmed'}
          </h4>
          <p className="font-helvetica text-xs font-regular text-grey-600">
            {body ?? 'The order has been successfully confirmed by our system'}
          </p>
        </div>
        {/* order time & date  */}
        <div className="flex flex-row items-center gap-1 self-start">
          {/* number of items */}
          <p className="font-helvetica text-xs font-regular text-grey-600">{formattedDate}</p>
          {/* seperator */}
          <span className="h-1 w-1 rounded-full bg-grey-600" />
          {/* total price */}
          <p className="font-helvetica text-xs font-regular text-grey-600">{time}</p>
        </div>
      </div>
    </div>
  )
}

function OrderItem({
  title,
  price,
  quantity,
  image,
  productId,
  variantTitle,
}: {
  title: string
  price: string
  quantity: number
  image: string
  productId: string
  variantTitle: string
}) {
  return (
    <div className="rounded-xl border border-grey-300 bg-grey-100 p-5">
      <div className="flex flex-row items-center justify-between">
        {/* img title qty and price */}
        <div className="flex flex-row items-center gap-4">
          <Image
            alt={'Product Image'}
            aspectRatio="1/1"
            src={image}
            sizes="(min-width: 45em) 50vw, 100vw"
            className="max-w-[70px] rounded-sm"
          />
          <div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1">
                <h5 className="font-helvetica font-medium text-black">{title}</h5>
                <span className="font-helvetica text-sm font-regular text-grey-600">
                  {variantTitle}
                </span>
              </div>
              <div className="flex flex-row items-center gap-1">
                {/* qty */}
                <span className="rounded-md border border-grey-300 bg-grey-100 px-[10px] py-1 font-helvetica text-base font-regular text-black">
                  {quantity}
                </span>
                <span className="font-helvetica text-base font-medium text-black">${price}</span>
                {/* price */}
              </div>
            </div>
          </div>
        </div>
        <CreateReviewForm
          productId={productId}
          className="bg-transparent hover:bg-transparent h-auto rounded-none border-b border-none border-green-200 p-0 pb-1"
        />
      </div>
    </div>
  )
}

export function SummaryItem({
  label,
  value,
  labelClassName,
  valueClassName,
}: {
  label: string
  value: Pick<MoneyV2, 'currencyCode' | 'amount'> | number
  labelClassName?: string
  valueClassName?: string
}) {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <p
        className={cn(
          'font-helvetica text-sm font-regular capitalize text-grey-600',
          labelClassName,
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          'font-helvetica text-sm font-regular capitalize text-grey-600',
          valueClassName,
        )}
      >
        $ {typeof value === 'number' ? value : value.amount}
      </p>
    </div>
  )
}
