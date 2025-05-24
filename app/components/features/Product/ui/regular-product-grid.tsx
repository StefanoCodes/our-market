import { ProductItemFragment } from '~/root'
import { ProductCard } from './product-card'
// similar to the swipeable one but not swipeable
export default function ProductGrid({ products }: { products: ProductItemFragment['nodes'] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} swipeable={false} />
      ))}
    </div>
  )
}
