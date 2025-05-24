import { type FetcherWithComponents } from '@remix-run/react'
import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { LoaderIcon } from '../../Onboarding/steps/loading'
import { cn } from '~/lib/utils/utils'
interface AddToCartButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  analytics?: unknown
  children: React.ReactNode
  disabled?: boolean
  lines: Array<OptimisticCartLineInput>
  onClick?: () => void
  afterAddedToCart?: () => void
  afterAddedToCartText?: string
  props?: React.HTMLAttributes<HTMLButtonElement>
  className?: string
}

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  afterAddedToCart,
  afterAddedToCartText,
  className,
  ...props
}: AddToCartButtonProps) {
  const [isAddedToCard, setIsAddedToCard] = useState(false)
  // Create a static variable to track global submission state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // send a message that a new item has been added to the cart
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (isAddedToCard) {
      timeout = setTimeout(() => {
        setIsAddedToCard(false)
      }, 2500)
      return () => clearTimeout(timeout)
    }
  }, [isAddedToCard])

  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        const isLoading = fetcher.state !== 'idle'

        useEffect(() => {
          if (fetcher.state === 'submitting') {
            setIsSubmitting(true)
          } else if (fetcher.state === 'idle') {
            setIsSubmitting(false)
            if (fetcher.data && !fetcher.data?.errors) {
              setIsAddedToCard(true)
              if (afterAddedToCart) {
                afterAddedToCart()
              }
            }
          }
        }, [fetcher.state, fetcher.data])

        return (
          <div className="relative">
            {/* analytics */}
            <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />

            <Button
              type="submit"
              onClick={onClick}
              disabled={disabled ?? isLoading ?? isSubmitting}
              className={cn(
                'w-full bg-brand-green px-8 py-3 font-helvetica text-sm leading-[18px] text-white hover:bg-green-700',
                disabled || isSubmitting ? 'cursor-not-allowed opacity-30' : '',
                className,
              )}
              {...props}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoaderIcon isLoading={isLoading} />
                </span>
              ) : isAddedToCard ? (
                <span className="flex items-center gap-2">
                  <Check className="h-[1cap] w-5 text-green-300" />
                  {afterAddedToCartText && <span>{afterAddedToCartText ?? 'Added to cart'}</span>}
                </span>
              ) : (
                children
              )}
            </Button>
          </div>
        )
      }}
    </CartForm>
  )
}
