import { Link } from '@remix-run/react'
import { CheckCircle2, ExternalLink, Package } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { DeliveryInfo } from '~/lib/integrations/uber/types'
import { formatDate } from '~/lib/utils/utils'
import { motion } from 'framer-motion'
import { Checkmark } from '~/components/ui/check-mark-svg'

interface SuccessStepProps {
  delivery: DeliveryInfo
}

export function SuccessStep({ delivery }: SuccessStepProps) {

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Success Icon */}
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

        <h2 className="text-2xl font-bold">Order Confirmed!</h2>
      </div>
      {/* Order Details */}
      <div className="w-full max-w-md rounded-lg border border-grey-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Order ID */}
          <div className="flex items-center justify-between border-b border-grey-100 pb-4">
            <span className="text-sm text-grey-500">Order ID</span>
            <span className="font-medium">{delivery.id}</span>
          </div>

          {/* Delivery Status */}
          <div className="flex items-center justify-between border-b border-grey-100 pb-4">
            <span className="text-sm text-grey-500">Status</span>
            <span className="bg-green-50 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-green-700">
              <Package className="h-4 w-4" />
              {delivery.status}
            </span>
          </div>

          {/* Delivery Details */}
          <div className="space-y-3 border-b border-grey-100 pb-4">
            <h3 className="font-medium">Delivery Details</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-grey-500">Recipient:</span> {delivery.dropoff_name}
              </p>
              <p>
                <span className="text-grey-500">Phone:</span> {delivery.dropoff_phone_number}
              </p>
              <p>
                <span className="text-grey-500">Created:</span> {formatDate(delivery.created_at)}
              </p>
            </div>
          </div>

          {/* Tracking Link */}
          <div className="flex flex-col gap-3">
            <a
              href={delivery.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Track Your Delivery
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="flex flex-col gap-4">
        <Link to="/">
          <Button variant="outline" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}
