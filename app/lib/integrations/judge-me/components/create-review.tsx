import { zodResolver } from '@hookform/resolvers/zod'
import { useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import CustomInput from '~/components/features/Onboarding/input'
import CustomLabel from '~/components/features/Onboarding/label'
import { ButtonWithLoading } from '~/components/ui/button/button-with-loading'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Rating } from '~/components/ui/rating'
import { createReviewSchema, CreateReviewSchemaType } from '../validations'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from '~/components/ui/button/button'
import { cn } from '~/lib/utils/utils'
import { useRootLoaderData } from '~/root'
type ActionResponse = {
  success: boolean
  error?: string
  message?: string
}

// note email & name & picture urls wont show as fiels when we have the authenciation stuff since we can pull that from the customer account api
export const CreateReviewForm = ({
  productId,
  className,
}: {
  productId: string
  className?: string
}) => {
  const data = useRootLoaderData()
  const customer = data?.customer?.data.customer
  const [showDialog, setShowDialog] = useState(false)
  // customer info to prefill the fields
  const fetcher = useFetcher<ActionResponse>()
  const isSubmitting = fetcher.state === 'submitting'

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

  return (
    // dialog
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            'rounded-md border border-green-200 bg-green-100 px-8 py-3 font-helvetica text-sm font-medium leading-[18px] text-brand-green shadow-none hover:bg-green-300',
            className,
          )}
        >
          Create Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Review</DialogTitle>
        </DialogHeader>
        <fetcher.Form
          method="post"
          action="/resource/judge"
          onSubmit={createReviewForm.handleSubmit((data) => {

            fetcher.submit(
              { ...data, intent: 'create-review', productId: productId },
              { action: '/resource/judge', method: 'POST' },
            )
          })}
        >
          <Form {...createReviewForm}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                {/* reviewer name */}
                <div className="flex flex-col gap-4">
                  {!customer?.firstName && (
                    <FormField
                      control={createReviewForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <CustomLabel htmlFor="name">Name:</CustomLabel>
                          <CustomInput
                            id={'name'}
                            placeholder={'John Singh'}
                            autoComplete="given-name"
                            aria-label="Name"
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                {/* reviewer email */}
                {!customer?.emailAddress?.emailAddress && (
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={createReviewForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <CustomLabel htmlFor="email">Email:</CustomLabel>
                          <CustomInput
                            id={'email'}
                            placeholder={'mail@gmail.com'}
                            autoComplete="email"
                            aria-label="Email"
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {/* review title */}
                <div className="flex flex-col gap-4">
                  <FormField
                    control={createReviewForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="title">Title:</CustomLabel>
                        <CustomInput
                          id={'title'}
                          placeholder={'Great product'}
                          autoComplete="title"
                          aria-label="Title"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* review body */}
                <div className="flex flex-col gap-4">
                  <FormField
                    control={createReviewForm.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <CustomLabel htmlFor="body">Description:</CustomLabel>
                        <CustomInput
                          id={'body'}
                          placeholder={'This product is great'}
                          autoComplete="description"
                          aria-label="Description"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* review rating */}
                <div className="flex flex-col gap-4">
                  <FormField
                    control={createReviewForm.control}
                    name="rating"
                    render={({ field: { onChange, value } }) => (
                      <FormItem>
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
              </div>
              {/* submit button */}
              <div className="mt-auto flex flex-col gap-6">
                <ButtonWithLoading isLoading={isSubmitting}>
                  {!isSubmitting ? `Submit` : `Submitting...`}
                </ButtonWithLoading>
              </div>
            </div>
          </Form>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}
