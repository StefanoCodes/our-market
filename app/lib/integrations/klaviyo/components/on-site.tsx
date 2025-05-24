// import { ProductDetailsFragment } from 'storefrontapi.generated'

// export function trackViewedProduct(product: ProductDetailsFragment) {
//   // @ts-ignore klaviyo is not defined in the window object
//   let klaviyo = window.klaviyo || []
//   let item = {
//     Name: product.title,
//     ProductID: product.id.substring(product.id.lastIndexOf('/') + 1),
//     ImageURL: product.selectedOrFirstAvailableVariant?.image?.url,
//     Handle: product.handle,
//     Brand: product.vendor,
//     Price: product.selectedOrFirstAvailableVariant?.price?.amount,
//     Metadata: {
//       Brand: product.vendor,
//       Price: product.selectedOrFirstAvailableVariant?.unitPrice,
//       CompareAtPrice: product.selectedOrFirstAvailableVariant?.compareAtPrice,
//     },
//   }
//   klaviyo.push(['track', 'Viewed Product', item])
//   klaviyo.push(['trackViewedItem', item])
// }

// export function trackAddedToCart(product: ProductDetailsFragment) {
//   // @ts-ignore klaviyo is not defined in the window object
//   let klaviyo = window.klaviyo || []
//   let item = {
//     Name: product.title,
//     ProductID: product.id.substring(product.id.lastIndexOf('/') + 1),
//     ImageURL: product.selectedOrFirstAvailableVariant?.image?.url,
//     Handle: product.handle,
//     Brand: product.vendor,
//     Price: product.selectedOrFirstAvailableVariant?.price?.amount,
//   }
//   klaviyo.push(['track', 'Added To Cart', item])
// }
