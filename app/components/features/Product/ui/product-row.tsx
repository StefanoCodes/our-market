import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils/utils'
import type { ProductItemFragment } from '~/root'
import { ProductCard } from './product-card'
import { ProductItemDataFragment } from 'storefrontapi.generated'

interface ProductRowProps {
  rows?: number
  products?: ProductItemDataFragment[]
}

export function ProductRow({ rows, products }: ProductRowProps) {
  return (
    <>
      <MobileProductRow products={products} />
      <DesktopProductRow products={products} rows={rows} />
    </>
  )
}

interface MobileRowProps {
  rows?: number
  products?: ProductItemDataFragment[]
}

function MobileProductRow({ products }: MobileRowProps) {
  return (
    <div className="relative md:hidden">
      <div className="hide-scrollbars relative z-10 flex gap-product-row-mobile overflow-x-auto pb-4">
        {products?.map((product, index) => (
          <div
            key={product.id || index}
            className="min-h-product-card-mobile min-w-product-card-mobile md:min-h-product-card-desktop md:min-w-product-card-desktop"
          >
            <ProductCard product={product} loading="eager" />
          </div>
        ))}
      </div>
    </div>
  )
}

interface DesktopRowProps {
  products?: ProductItemDataFragment[]
  rows?: number
}

function DesktopProductRow({ products, rows }: DesktopRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const containerRef = useRef<HTMLUListElement>(null)

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const checkScrollPosition = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      checkScrollPosition() // Initial check

      // Check on window resize
      window.addEventListener('resize', checkScrollPosition)
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition)
      }
      window.removeEventListener('resize', checkScrollPosition)
    }
  }, [containerRef])

  return (
    <div
      className="relative hidden md:block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ul
        ref={containerRef}
        role="list"
        aria-label="Products list desktop view"
        className={cn(
          'hide-scrollbars relative z-10 flex w-full flex-row gap-4 overflow-x-auto pb-4',
          rows && {
            'xl:grid xl:grid-cols-1': rows === 1,
            'xl:grid xl:grid-cols-2': rows === 2,
            'xl:grid xl:grid-cols-3': rows === 3,
            'xl:grid xl:grid-cols-4': rows === 4,
            'xl:grid xl:grid-cols-5': rows >= 5,
          },
        )}
      >
        {products?.map((product, index) => (
          <li
            key={product.id || index}
            className="min-h-product-card-mobile min-w-product-card-mobile md:min-h-product-card-desktop md:min-w-product-card-desktop max-w-product-card-mobile md:max-w-product-card-desktop"
          >
            <ProductCard product={product} loading="eager" />
          </li>
        ))}
      </ul>
      {isHovered && canScrollLeft && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-brand-green bg-opacity-75 p-2 shadow-md transition-opacity duration-300 hover:bg-opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
      )}
      {isHovered && canScrollRight && (
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-brand-green bg-opacity-75 p-2 shadow-md transition-opacity duration-300 hover:bg-opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  )
}
