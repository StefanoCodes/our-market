import { Money } from '@shopify/hydrogen'
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types'
import { cn } from '~/lib/utils/utils'
export function ProductPrice({
  price,
  compareAtPrice,
  className,
}: {
  price?: MoneyV2
  compareAtPrice?: MoneyV2 | null
  className?: string
}) {
  return (
    <div className={cn('product-price', className)}>
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <Money data={price} /> : null}
          <s>
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  )
}
