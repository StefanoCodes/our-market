import Question from '~/components/pages/FaqPage/question'

import { Accordion } from '~/components/ui/accordion'

export default function SavedProductsPage() {
  return (
    <div className="mx-auto flex h-[55.75rem] max-w-container flex-col gap-6 px-4 pb-7 pt-9 lg:gap-8 xl:px-16">
      <div className="flex h-full flex-col gap-5">
        <h2 className="font-helvetica text-md font-medium text-black">
          Frequently Asked Questions
        </h2>
        <div className="justify- flex h-full items-start rounded-2xl bg-white px-8 py-6">
          <Accordion type="single" collapsible className="flex w-full flex-col gap-3">
            <Question
              title="What payment methods do you support?"
              answer="Credit card, Weee! points, Apple pay, Alipay, Wechat pay, Paypal, Venmo"
              id="1"
            />
            <Question
              title="What payment methods do you support?"
              answer="Credit card, Weee! points, Apple pay, Alipay, Wechat pay, Paypal, Venmo"
              id="2"
            />
            <Question
              title="What payment methods do you support?"
              answer="Credit card, Weee! points, Apple pay, Alipay, Wechat pay, Paypal, Venmo"
              id="3"
            />
            <Question
              title="What payment methods do you support?"
              answer="Credit card, Weee! points, Apple pay, Alipay, Wechat pay, Paypal, Venmo"
              id="4"
            />
          </Accordion>
        </div>
      </div>
    </div>
  )
}
