import { AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'

interface QuestionProps {
  title: string
  answer: string | string[]
  id: string
}

export default function Question({ title, answer, id }: QuestionProps) {
  const isAnswerArray = Array.isArray(answer)
  // so we want to check if the answer is an object json
  const isJsonObject = typeof answer === 'object' && answer !== null
  return (
    <AccordionItem value={id} className="w-full border-b border-grey-300 pb-3 last:border-b-0">
      <AccordionTrigger className="w-full text-left text-base font-medium text-black hover:no-underline">
        <p className="max-w-72 md:max-w-full">{title}</p>
      </AccordionTrigger>
      <AccordionContent className="w-full rounded-lg bg-grey-100 p-4 text-base">
        {isAnswerArray && (
          <div className="flex flex-col gap-2">
            {answer.map((answer, id) => (
              <span
                key={id}
                className="max-w-prose font-helvetica text-sm font-regular text-grey-600"
              >
                {answer}
              </span>
            ))}
          </div>
        )}
        {!isAnswerArray && <span>{answer}</span>}
      </AccordionContent>
    </AccordionItem>
  )
}
