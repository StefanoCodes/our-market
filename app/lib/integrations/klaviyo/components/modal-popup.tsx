import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { EmailSubscribeForm } from './email-subscribe-form'
import { CustomerDetailsQuery } from 'customer-accountapi.generated'

export const MarketingSubscribeModal = ({
  show,
  setShow,
  customer,
}: {
  show: boolean
  setShow: (show: boolean) => void
  customer: CustomerDetailsQuery['customer'] | null
}) => {
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent>
        <div className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Subscribe to our newsletter</DialogTitle>
          </DialogHeader>
          <div className="rounded-md bg-green-100 px-4 py-3 text-center text-xs text-green-500">
            {/* receive a 10% discount code upon subscribing */}
            <p>Receive a 10% discount code upon subscribing.</p>
          </div>
        </div>
        {/* banner saying 10% discount code */}

        <EmailSubscribeForm setShow={setShow} customer={customer} />
      </DialogContent>
    </Dialog>
  )
}
