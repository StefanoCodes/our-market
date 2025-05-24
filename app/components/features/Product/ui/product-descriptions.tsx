// metadata coming from the shopify store

import { ProductFragment } from 'storefrontapi.generated'
import Question from '~/components/pages/FaqPage/question'
import { Accordion } from '~/components/ui/accordion'

// will receive a list of metadata and display them in alist
interface ProductMetadatasProps {
  metadata: ProductFragment['metafields']
}
export function ProductMetadatas({ metadata }: ProductMetadatasProps) {
  return (
    <Accordion type="multiple" className="flex w-full flex-col gap-3">
      <MetadataList metadata={metadata} />
    </Accordion>
  )
}
// 2 components renders lust of metadata
function MetadataList({ metadata }: { metadata: ProductFragment['metafields'] }) {
  const filteredMetadata = metadata.filter((metafield) => metafield !== null)

  return (
    <>
      {filteredMetadata.map(({ key, value, id }) => (
        <MetadataItem key={id} title={key} value={value} id={id} />
      ))}
    </>
  )
}
// renders a metadata item
interface MetadataItemProps {
  title: string
  value: string
  id: string
}
function MetadataItem({ title, value, id }: MetadataItemProps) {
  return <Question title={title} answer={value} id={id.toString()} />
}
