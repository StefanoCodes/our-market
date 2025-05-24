import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '~/lib/utils/utils'

interface ExpandableAddToCartProps {
  className?: string
  onAddToCart?: () => void
}

export default function ExpandableAddToCart({ className, onAddToCart }: ExpandableAddToCartProps) {
  return (
    <motion.button
      className={cn(
        'cursor-pointer rounded-full border-[0.5px] border-[#0B4D34] p-[6px] group-hover:bg-brand-green',
        'group-hover:py-[6px] group-hover:pl-[6px] group-hover:pr-4',
        'flex items-center justify-center text-white',
        'transition-all duration-300 ease-in-out',
        className,
      )}
      onClick={onAddToCart}
    >
      <Plus className="text-brand-green group-hover:text-white" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm transition-all duration-300 ease-in-out group-hover:ml-1 group-hover:max-w-[100px]">
        Add to Cart
      </span>
    </motion.button>
  )
}
