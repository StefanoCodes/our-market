import { redirect } from '@shopify/remix-oxygen'

import { MetaFunction, useLoaderData, useSearchParams } from '@remix-run/react'
import { Analytics } from '@shopify/hydrogen'
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { json } from '@shopify/remix-oxygen'
import { XIcon } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import CustomInput from '~/components/features/Onboarding/input'
import { ProductCard } from '~/components/features/Product/ui/product-card'
import { ProductRow } from '~/components/features/Product/ui/product-row'
import { CollectionsSearchSlider } from '~/components/features/Search/ui/collections-search-slider'
import { DualRangeSlider } from '~/components/features/Search/ui/dual-range-slider'
import { Button } from '~/components/ui/button/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer'
import FilterSearchIcon from '~/components/ui/icons/filter-search'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { PRODUCT_ITEM_FRAGMENT } from '~/lib/fragments'
import type { ProductItemFragment } from '~/root'
import { useMobileBottomNav } from '~/components/layout/header/mobile-bottom-nav-provider'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Our Market | ${data?.collection.title ?? ''} Collection` }]
}

const DEFAULT_PRICE_RANGE = {
  min: 0,
  max: 100,
}

interface PriceFilter extends Record<string, number | undefined> {
  min?: number
  max?: number
}

const FILTER_URL_PREFIX = 'filter.'

type Filters = {
  sort?: string
  price?: PriceFilter
  productTypes: string[]
  tag?: string
  brands: string[]
}

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const { handle, nestedHandle } = params

  if (!handle) {
    throw redirect('/collections')
  }

  const url = new URL(request.url)
  const searchParams = url.searchParams
  const filters: Filters = {
    productTypes: [],
    brands: [],
  }

  // Handle price filter
  const priceFilter = searchParams.get(`${FILTER_URL_PREFIX}price`)
  if (priceFilter) {
    try {
      const price = JSON.parse(priceFilter)
      filters.price = {
        // @ts-ignore
        min: isNaN(Number(price?.min)) ? undefined : Number(price?.min),
        // @ts-ignore
        max: isNaN(Number(price?.max)) ? undefined : Number(price?.max),
      }
    } catch (e) {
      console.error('Error parsing price filter:', e)
    }
  }

  // Handle other filters
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith(FILTER_URL_PREFIX)) {
      const filterKey = key.replace(FILTER_URL_PREFIX, '')
      if (filterKey === 'productType') {
        filters.productTypes.push(...value.split(','))
      } else if (filterKey === 'productVendor') {
        filters.brands = filters.brands || []
        filters.brands.push(value)
      } else if (filterKey === 'tag') {
        filters.tag = value
      }
    }
  }

  if (searchParams.has('sort')) filters.sort = searchParams.get('sort')!

  const sortKeyMap = {
    featured: 'MANUAL',
    'best-selling': 'BEST_SELLING',
    'price-low-high': 'PRICE',
    'price-high-low': 'PRICE',
    newest: 'CREATED',
  } as const

  const sortKey = filters.sort
    ? sortKeyMap[filters.sort as keyof typeof sortKeyMap] || 'MANUAL'
    : 'MANUAL'
  const reverse = filters.sort === 'price-high-low'

  // Build product filters for Shopify API
  const productFilters: any[] = []

  if (filters.price?.min || filters.price?.max) {
    productFilters.push({
      price: {
        min: filters.price.min || 0,
        max: filters.price.max || undefined,
      },
    })
  }

  if (filters.productTypes.length > 0) {
    productFilters.push({
      productType: filters.productTypes,
    })
  }

  if (filters.brands && filters.brands.length > 0) {
    productFilters.push({
      productVendor: filters.brands.join('|'),
    })
  }

  if (filters.tag && filters.tag !== 'all') {
    productFilters.push({
      tag: filters.tag,
    })
  }

  // Get all collections for the search slider
  const ALL_COLLECTIONS_QUERY = `#graphql
 query SidebarCollectionsHandlePage {
  menu(handle: "side-panel") {
    items {
      id  
      url
      title
      type
 resource {
        ... on Collection {
          id
        image {
            url
            width
            height
            altText
            id
          }
        }
      }

      items {
        id
        url
        title
         resource {
        ... on Collection {
          id
        image {
            url
            width
            height
            altText
            id
          }
        }
      }
    }
    }
  }
}` as const

  const [{ collection }, { menu: collections }] = await Promise.all([
    context.storefront.query(COLLECTION_QUERY, {
      variables: {
        handle: nestedHandle ? nestedHandle : handle,
        first: 24,
        sortKey,
        reverse,
        filters: productFilters,
      },
      cache: context.storefront.CacheLong(),
    }),
    context.storefront.query(ALL_COLLECTIONS_QUERY, {
      cache: context.storefront.CacheLong(),
    }),
  ])

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    })
  }

  // Get unique vendors from the collection's products
  const vendors = Array.from(
    new Set(
      collection.products.nodes
        .map((product) => product.vendor)
        .filter((vendor: any): vendor is string => typeof vendor === 'string'),
    ),
  )

  return json({
    collection,
    filters,
    handle: handle,
    collections,
    vendors,
    nestedHandle: nestedHandle,
  })
}

export default function Page() {
  const { collection, filters, handle, collections, vendors, nestedHandle } =
    useLoaderData<typeof loader>()

  // mobile bottom nav
  const { hide, show } = useMobileBottomNav()

  // Move state initialization outside of render
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const rowsArray = useMemo(() => {
    const rows = Math.ceil(collection.products.nodes.length / 4)
    return Array.from({ length: rows }, (_, index) =>
      collection.products.nodes.slice(index * 4, (index + 1) * 4),
    )
  }, [collection.products.nodes])

  const isThereProductsInCollection = collection.products.nodes.length > 0

  const handleFilterChange = (key: string, value: string | string[]) => {
    const newParams = new URLSearchParams(searchParams)

    if (Array.isArray(value)) {
      newParams.delete(key)
      if (value.length > 0) {
        value.forEach((v) => newParams.append(key, v))
      }
    } else {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    }

    setSearchParams(newParams)
    // Close drawer on filter change in mobile
    setIsDrawerOpen(false)
  }

  // when mobile drawer is open, hide the bottom nav
  useEffect(() => {
    if (isDrawerOpen) {
      hide()
    } else {
      show()
    }
  }, [isDrawerOpen])

  // const handleProductTypeChange = (checked: boolean, value: string) => {
  //   const currentTypes = new Set(filters.productTypes || [])
  //   if (checked) {
  //     currentTypes.add(value)
  //   } else {
  //     currentTypes.delete(value)
  //   }
  //   const newTypes = Array.from(currentTypes)
  //   handleFilterChange(`${FILTER_URL_PREFIX}productType`, newTypes)
  // }

  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 px-4 pb-[4.25rem] pt-4 lg:gap-8 xl:px-16">
      <div className="flex flex-row items-center justify-between lg:flex-col lg:items-start lg:justify-start lg:gap-6">
        <div className="hidden xl:block">
          <Select
            value={searchParams.get('sort') || 'featured'}
            onValueChange={(value) => handleFilterChange('sort', value)}
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="featured">Featured (Default)</SelectItem>
                <SelectItem value="best-selling">Best Selling</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="xl:hidden">
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                variant={'ghost'}
                className="h-0 bg-white p-5 font-helvetica text-sm font-medium text-black"
              >
                <span>Filter</span>
                <FilterSearchIcon />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="flex h-[85vh] flex-col">
              <DrawerHeader className="sticky top-0 z-10 flex w-full flex-row items-center justify-between bg-white px-8">
                <DrawerTitle className="font-helvetica text-md font-medium text-black">
                  Sort & Filter
                </DrawerTitle>
                <DrawerDescription asChild>
                  <div
                    className="flex h-8 w-8 cursor-pointer items-center justify-center"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <XIcon className="h-6 w-6 text-black" />
                  </div>
                </DrawerDescription>
              </DrawerHeader>
              <div className="hide-scrollbars flex-1 overflow-y-auto px-8">
                <DrawerContentFilters filters={filters} handleFilterChange={handleFilterChange} />
              </div>
              <DrawerFooter className="sticky bottom-0 z-10 bg-white px-8">
                <Button
                  variant="brand"
                  onClick={() => {
                    setIsDrawerOpen(false)
                  }}
                >
                  Apply Filter
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      <CollectionsSearchSlider
        activeMainHandle={handle}
        activeNestedHandle={nestedHandle}
        collections={collections}
      />
      {/* some type errors to come and fix just becuase the collection gives more product data than the product card needs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:hidden">
        {isThereProductsInCollection ? (
          collection.products.nodes.map((product) => (
            <ProductCard key={product.id} product={product} swipeable={false} />
          ))
        ) : (
          <div className="col-span-full flex h-full items-center justify-center">
            <p className="font-helvetica text-base font-medium text-black">No products found</p>
          </div>
        )}
      </div>

      <div className="hidden flex-col gap-4 lg:flex-row xl:flex">
        <div className="flex flex-1 flex-col gap-4">
          {isThereProductsInCollection ? (
            rowsArray.map((row, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {row.map((product) => (
                  <ProductCard key={product.id} product={product} swipeable={false} />
                ))}
              </div>
            ))
          ) : (
            <div className="col-span-full flex h-full items-center justify-center">
              <p className="font-helvetica text-base font-medium text-black">No products found</p>
            </div>
          )}
        </div>
        <div className="w-[270px] rounded-[13px] bg-white p-5">
          <div className="flex h-full flex-col gap-5">
            <h3 className="font-helvetica text-base font-medium text-black">Sort & Filter</h3>
            <DrawerContentFilters filters={filters} handleFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  )
}

function DrawerContentFilters({
  filters,
  handleFilterChange,
}: {
  filters: Filters
  handleFilterChange: (key: string, value: string | string[]) => void
}) {
  const { vendors } = useLoaderData<typeof loader>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [priceRange, setPriceRange] = useState([
    filters.price?.min || DEFAULT_PRICE_RANGE.min,
    filters.price?.max || DEFAULT_PRICE_RANGE.max,
  ])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      const price: PriceFilter = {}

      if (priceRange[0] !== DEFAULT_PRICE_RANGE.min) {
        price.min = priceRange[0]
      }
      if (priceRange[1] !== DEFAULT_PRICE_RANGE.max) {
        price.max = priceRange[1]
      }

      if (Object.keys(price).length > 0) {
        params.set(`${FILTER_URL_PREFIX}price`, JSON.stringify(price))
      } else {
        params.delete(`${FILTER_URL_PREFIX}price`)
      }

      setSearchParams(params)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [priceRange])

  const handlePriceInputChange = (index: number, value: number) => {
    const newValues = [...priceRange]
    if (index === 0) {
      newValues[0] = Math.min(value, priceRange[1])
    } else {
      newValues[1] = Math.max(value, priceRange[0])
    }
    setPriceRange(newValues)
  }

  // const handleProductTypeChange = (checked: boolean, value: string) => {
  //   const currentTypes = new Set(filters.productTypes || [])
  //   if (checked) {
  //     currentTypes.add(value)
  //   } else {
  //     currentTypes.delete(value)
  //   }
  //   const newTypes = Array.from(currentTypes)
  //   handleFilterChange(`${FILTER_URL_PREFIX}productType`, newTypes)
  // }

  return (
    <div className="flex h-full flex-col gap-[17px] py-4">
      <div className="flex flex-col gap-[10px]">
        <h4 className="font-helvetica text-md font-medium text-grey-900">Sort</h4>
        <RadioGroup
          value={filters.sort}
          onValueChange={(value) => handleFilterChange('sort', value)}
          className="border-b-[0.5px] border-grey-400 pb-[17px]"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
              <RadioGroupItem value="featured" id="featured" className="border-grey-400" />
              <Label
                htmlFor="featured"
                className="font-helvetica text-sm font-regular text-grey-700"
              >
                Featured (Default)
              </Label>
            </div>
            <div className="flex items-center gap-1">
              <RadioGroupItem value="best-selling" id="best-selling" className="border-grey-400" />
              <Label
                htmlFor="best-selling"
                className="font-helvetica text-sm font-regular text-grey-700"
              >
                Best Selling
              </Label>
            </div>
            <div className="flex items-center gap-1">
              <RadioGroupItem
                value="price-low-high"
                id="price-low-high"
                className="border-grey-400"
              />
              <Label
                htmlFor="price-low-high"
                className="font-helvetica text-sm font-regular text-grey-700"
              >
                Price: Low to High
              </Label>
            </div>
            <div className="flex items-center gap-1">
              <RadioGroupItem
                value="price-high-low"
                id="price-high-low"
                className="border-grey-400"
              />
              <Label
                htmlFor="price-high-low"
                className="font-helvetica text-sm font-regular text-grey-700"
              >
                Price: High to Low
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-[17px]">
        <h4 className="font-helvetica text-md font-medium text-grey-900">Filter</h4>
        <div className="flex flex-col gap-[10px]">
          <p className="font-helvetica text-sm font-medium text-grey-900">Price ($)</p>
          <div className="flex flex-col gap-[10px]">
            <DualRangeSlider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={100}
              step={1}
            />
            <div className="flex flex-row items-center gap-[10px]">
              <CustomInput
                type="number"
                placeholder="0"
                value={priceRange[0]}
                onChange={(e) => handlePriceInputChange(0, Number(e.target.value))}
                min={0}
                max={100}
              />
              <div className="h-[2px] w-[20px] bg-black" />
              <CustomInput
                type="number"
                placeholder="100"
                value={priceRange[1]}
                onChange={(e) => handlePriceInputChange(1, Number(e.target.value))}
                min={0}
                max={100}
              />
            </div>
          </div>
        </div>
      </div>
      {/* 
      <div className="flex flex-col gap-[10px]">
        <h4 className="font-helvetica text-md font-medium text-grey-900">Product Type</h4>
        <div className="flex flex-col gap-4">
          {['sale', 'newArrivals', 'deals'].map((type) => (
            <div key={type} className="flex flex-row items-center gap-1">
              <Checkbox
                id={type}
                checked={filters.productTypes.includes(type)}
                onCheckedChange={(checked) => handleProductTypeChange(checked as boolean, type)}
                className="h-4 w-4 border-brand-green data-[state=checked]:border-brand-green data-[state=checked]:bg-brand-green"
              />
              <Label htmlFor={type} className="font-helvetica text-sm font-regular text-grey-700">
                {type === 'newArrivals'
                  ? 'New Arrivals'
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </Label>
            </div>
          ))}
        </div>
      </div> */}

      <div className="flex flex-col gap-[10px] pb-4">
        <h4 className="font-helvetica text-md font-medium text-grey-900">Brand</h4>
        <RadioGroup
          value={searchParams.get(`${FILTER_URL_PREFIX}productVendor`) || ''}
          onValueChange={(value) => handleFilterChange(`${FILTER_URL_PREFIX}productVendor`, value)}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-1">
            <RadioGroupItem value="" id="all-brands" className="border-grey-400" />
            <Label
              htmlFor="all-brands"
              className="font-helvetica text-sm font-regular text-grey-700"
            >
              All Brands
            </Label>
          </div>
          {(vendors as string[]).map((brand: string) => (
            <div key={brand} className="flex items-center gap-1">
              <RadioGroupItem value={brand} id={brand} className="border-grey-400" />
              <Label htmlFor={brand} className="font-helvetica text-sm font-regular text-grey-700">
                {brand}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}

// Updated query to use ProductItemData fragment
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query CollectionDetails(
    $handle: String!
    $first: Int
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(
        first: $first
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        nodes {
          ...ProductItemData
        }
      }
    }
  }
` as const
