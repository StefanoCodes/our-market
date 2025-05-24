import { Image } from '@shopify/hydrogen'
import { Button } from '~/components/ui/button/button'

export default function NoOders({ completed = false }: { completed?: boolean }) {
  const completedOrdersText = {
    title: 'No Completed Orders yet',
    description: 'Place an order now to get started',
  }
  const pastOrdersText = {
    title: 'No Current Live Orders',
    description: 'No order is current ongoing, place an order now to get started',
  }
  return (
    <div className="mx-auto flex min-h-full max-w-[18rem] flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center justify-center gap-3">
        <Image
          alt={'no current orders img'}
          aspectRatio="1/1"
          src={`/orders/boxes.svg`}
          sizes="(min-width: 45em) 50vw, 100vw"
          className="max-w-[4.875rem]"
        />
        <h2 className="font-helvetica text-base font-bold text-[#292D32]">
          {completed ? completedOrdersText.title : pastOrdersText.title}
        </h2>
        <p className="text-center font-helvetica text-xs font-regular text-grey-600">
          {completed ? completedOrdersText.description : pastOrdersText.description}
        </p>
      </div>
      {/* cta */}
      <Button variant="brand" className="h-auro rounded-lg px-8 py-5">
        Go to Overview
      </Button>
    </div>
  )
}
