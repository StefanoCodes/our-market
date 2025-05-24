import { Link } from '@remix-run/react'
import { motion } from 'motion/react'
import { Checkmark } from '~/components/ui/check-mark-svg'
export default function WelcomeFlowSuccess() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex flex-col items-center gap-4">
        <motion.div
          className="bg-emerald-500/10 dark:bg-emerald-500/20 absolute inset-0 rounded-full blur-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: 'easeOut',
          }}
        />
        <Checkmark
          size={80}
          strokeWidth={4}
          color="rgb(16 185 129)"
          className="relative z-10 dark:drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]"
        />
      </div>
      <motion.h2
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="text-balance text-center font-helvetica text-md text-brand-green"
      >
        Your Preferences have been set thank you for taking time do so.
      </motion.h2>
      <motion.p
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
        }}
        className="max-w-prose text-center font-helvetica text-sm leading-5 text-grey-700"
      >
        We truly care about your experience this information will help us improve your satistfaction
        when using our website
      </motion.p>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.4,
        }}
        className="flex flex-col items-center justify-center gap-4"
      >
        <Link className="rounded-lg bg-brand-green px-8 py-3 font-helvetica text-white" to="/">
          Shop Our Market
        </Link>
        <Link
          to="/account/preferences"
          className="rounded-md border border-green-400 px-8 py-3 font-helvetica text-black"
        >
          View Preferences
        </Link>
      </motion.div>
    </div>
  )
}
