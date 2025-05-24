// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/cart
export const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height

        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartLineComponent on ComponentizableCartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartApiQuery on Cart {
    updatedAt
    createdAt
    id
    appliedGiftCards {
      lastCharacters
      amountUsed {
        ...Money
      }
    }
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
      nodes {
        ...CartLineComponent
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
` as const

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const

export const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const

export const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const

export const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment ProductItemData on Product {
    id
    title
    publishedAt
    handle
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        quantityAvailable
        weight
        weightUnit
        selectedOptions {
          name
          value
        }
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
    tags
    availableForSale
    vendor
  }
` as const

export const TRENDING_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query TrendingProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 5
  ) @inContext(country: $country, language: $language) {
    collection(handle: "trending") {
      products(first: $first) {
        nodes {
          ...ProductItemData
        }
      }
    }
  }
` as const

export const NEW_ARRIVALS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query NewArrivals(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 5
  ) @inContext(country: $country, language: $language) {
    collection(handle: "new-arrivals") {
      products(first: $first) {
        nodes {
          ...ProductItemData
        }
      }
    }
  }
` as const

// metaobject for the marketing announcements

export const MARKETING_ANNOUNCEMENTS_QUERY = `#graphql
  query MarketingAnnouncements {
    metaobjects(
      type: "home_page_banner_cms"
      first: 10
      sortKey: "updated_at"
    ) {
      nodes {
        fields {
          value
          key
          references(first: 10) {
            nodes {
              ... on MediaImage {
                id
                image {
                  url
                  width
                  height
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
` as const

export const HOME_PAGE_COLLECTIONS_MENU_QUERY = `#graphql
${PRODUCT_ITEM_FRAGMENT}
query HomepageCollections($first: Int = 10) {
  menu(handle: "home-page") {
    items {
      title
      url
      resource {
        ... on Collection {
          products(first: $first) {
            nodes {
              ...ProductItemData
            }
          }
        }
      }
    }
  }
}

` as const
