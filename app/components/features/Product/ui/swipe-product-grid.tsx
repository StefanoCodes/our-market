import { Link } from '@remix-run/react'
import type { ProductItemFragment } from '~/root'
import { ProductRow } from './product-row'
// received an array of products and properly displays them for both mobile & desktop
interface ProductGrid {
  collectionHeading?: string
  heading?: boolean
  products: ProductItemFragment['nodes']
  collectionHandle?: string
}
export function SwipeProductGrid({
  heading = true,
  collectionHeading = 'Collection Heading',
  collectionHandle,
  products,
}: ProductGrid) {
  return (
    <section className="flex flex-col gap-[1.125rem]" aria-label={collectionHeading}>
      {/* head */}
      {heading && (
        <header className="flex w-full flex-row items-center justify-between px-4 md:px-6">
          <h2 className="font-inter text-sm font-medium text-black md:text-base">
            {collectionHeading}
          </h2>
          <Link
            to={collectionHandle ?? '/'}
            className="rounded-[34px] bg-brand-green px-4 py-2 font-inter text-xs font-regular text-brand-pearl"
            viewTransition
          >
            see all
          </Link>
        </header>
      )}
      <div className="px-4 md:px-6">
        <ProductRow products={products} />
      </div>
    </section>
  )
}
