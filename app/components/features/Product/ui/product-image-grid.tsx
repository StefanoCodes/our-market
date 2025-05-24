import { useState } from 'react'
import { Image } from '@shopify/hydrogen'
import { cn } from '~/lib/utils/utils'
import ProductImage from '~/assets/product-image-placeholder.png'
import { AnimatePresence, motion, PanInfo } from 'framer-motion'
import ProductImage2 from '~/assets/brand/logo/badge/logo.png'
import { Link } from '@remix-run/react'

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
}

const swipeConfidenceThreshold = 10000
const swipeDirectionThreshold = 100

interface ProductImage {
  id: string
  altText: string
  url: string
  width: number
  height: number
}

export default function ProductImageGrid({
  images,
  title,
}: {
  images: ProductImage[]
  title: string
}) {
  const [[activeIndex, direction], setActiveImage] = useState([0, 0])
  const [hasChanged, setHasChanged] = useState(false)

  const activeImage = images[activeIndex]

  const paginate = (newDirection: number) => {
    const newIndex = activeIndex + newDirection
    if (newIndex >= 0 && newIndex < images.length) {
      setActiveImage([newIndex, newDirection])
      setHasChanged(true)
    }
  }

  const handleDragEnd = (e: Event, { offset, velocity }: PanInfo) => {
    const swipe = Math.abs(offset.x) * velocity.x

    if (swipe < -swipeConfidenceThreshold || offset.x < -swipeDirectionThreshold) {
      paginate(1)
    } else if (swipe > swipeConfidenceThreshold || offset.x > swipeDirectionThreshold) {
      paginate(-1)
    }
  }

  const changeImage = (newIndex: number) => {
    const direction = newIndex > activeIndex ? 1 : -1
    setActiveImage([newIndex, direction])
    setHasChanged(true)
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 md:self-start">
      <div className="flex flex-col gap-9 lg:gap-14">
        {/* Main Image Container */}
        <div className="relative overflow-hidden">
          {/* Swipeable Image Area */}
          <motion.div
            className="bg-gray-100 mx-auto aspect-square w-full max-w-[32.125rem] touch-pan-y rounded-xl"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeImage.id}
                custom={direction}
                variants={variants}
                initial={hasChanged ? 'enter' : 'center'}
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 400, damping: 35 },
                  opacity: { duration: 0.15 },
                }}
                className="absolute inset-0"
              >
                <Image
                  src={activeImage.url || ''}
                  alt={activeImage.altText || title + ` image`}
                  className="h-full w-full object-cover object-center"
                  sizes="(min-width: 1024px) 50vw, (min-width: 768px) 75vw, 100vw"
                  loading="eager"
                  aspectRatio="1/1"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Fixed Position Navigation Indicators */}
          <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2 sm:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  'pointer-events-auto h-1.5 rounded-full transition-all',
                  index === activeIndex ? 'w-4 bg-brand-green' : 'w-1.5 bg-brand-green/50',
                )}
                onClick={() => changeImage(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="mx-auto hidden max-w-[17.5rem] grid-cols-4 gap-2 sm:grid sm:gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => changeImage(index)}
              className={cn(
                'bg-gray-100 relative aspect-square overflow-hidden rounded-lg transition-all',
                activeImage.id === image.id
                  ? 'ring-2 ring-primary ring-offset-2'
                  : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-1',
              )}
            >
              <Image
                loading="lazy"
                src={image.url || ''}
                alt={image.altText || ''}
                className={cn(
                  'object-cover object-center transition-opacity duration-300',
                  activeImage.id === image.id ? 'opacity-100' : 'opacity-70 hover:opacity-100',
                )}
                sizes="(min-width: 1024px) 15vw, (min-width: 768px) 20vw, 25vw"
                aspectRatio="1/1"
              />
              <span className="sr-only">View {image.altText || ''}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
