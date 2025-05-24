import { Image } from '@shopify/hydrogen'
import productBadge from '~/assets/product-badge.svg'
// todo receives an array of string urls for the corresponsidng badges
export default function ProductBadges({ badges }: { badges?: string[] }) {
  return (
    <div className="mx-auto flex max-w-[11.25rem] flex-row gap-4">
      <Image src={productBadge} alt={'product health badge'} width={50} height={50} />
      <Image src={productBadge} alt={'product health badge'} width={50} height={50} />
      <Image src={productBadge} alt={'product health badge'} width={50} height={50} />
    </div>
  )
}
