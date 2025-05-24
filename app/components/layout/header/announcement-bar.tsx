import { Image } from '@shopify/hydrogen'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import AnnouncementBarBackground from '~/assets/brand/backgrounds/announcement-bar-background.svg'
import { useAnnouncementBar } from './announcement-bar-provider'
import { Form, useFetcher } from '@remix-run/react'
import { useEffect } from 'react'
interface ActionData {
  success: boolean
  message?: string
}
export default function AnnouncementBar({ announcement }: { announcement?: string }) {
  const { isVisible, hide } = useAnnouncementBar()
  const fetcher = useFetcher<ActionData>()

  useEffect(() => {
    // to optimistically hide the announcement bar when the user clicks the close button while sending the request to the server
    if (fetcher.state === 'submitting') {
      hide()
    }
  }, [fetcher.state])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="relative bg-brand-green"
          initial={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Image
            src={AnnouncementBarBackground}
            sizes="(min-width: 45em) 50vw, 100vw"
            className="absolute h-full w-full object-cover"
          />
          <div className="relative z-10 flex w-full items-center justify-center py-[0.625rem]">
            <div className="mx-auto flex w-full max-w-container flex-row items-center justify-center px-4 md:justify-between md:px-16">
              <div className="flex w-full items-center justify-center md:flex-1 md:justify-between">
                <span className="text-center font-helvetica text-xs font-bold uppercase tracking-[-0.02em] text-brand-pearl md:flex-1 md:justify-center">
                  {announcement || 'Get $20 off across your first 2 orders'}
                </span>
                <fetcher.Form method="POST" action="/resource/announcement">
                  <button
                    type="submit"
                    className="hidden h-5 w-5 cursor-pointer text-left md:block md:justify-end"
                    aria-label="Close announcement"
                  >
                    <X className="h-5 w-5 text-brand-pearl md:justify-end md:self-end md:text-left" />
                  </button>
                </fetcher.Form>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
