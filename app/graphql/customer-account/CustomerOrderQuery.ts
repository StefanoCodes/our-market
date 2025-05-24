// NOTE: https://shopify.dev/docs/api/customer/latest/queries/order
export const CUSTOMER_ORDER_QUERY = `#graphql
  fragment OrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment DiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        ...OrderMoney
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment OrderLineItemFull on LineItem {
    id
    title
    quantity
    price {
      ...OrderMoney
    }
    discountAllocations {
      allocatedAmount {
        ...OrderMoney
      }
      discountApplication {
        ...DiscountApplication
      }
    }
    totalDiscount {
      ...OrderMoney
    }
    image {
      altText
      height
      url
      id
      width
    }
    variantTitle
    productId
  }
  fragment Order on Order {
    id
    name
    statusPageUrl
    processedAt
    createdAt
    cancelledAt
    cancelReason
    fulfillments(first: 20) {
      nodes {
        status
        latestShipmentStatus
      }
    }
    totalTax {
      ...OrderMoney
    }
    totalPrice {
      ...OrderMoney
    }
    subtotal {
      ...OrderMoney
    }
 totalShipping {
      ...OrderMoney
    }
    shippingAddress {
      name
      formatted(withName: true)
      formattedArea
    }
    discountApplications(first: 100) {
      nodes {
        ...DiscountApplication
      }
    }
    lineItems(first: 100) {
      nodes {
        ...OrderLineItemFull
      }
    }
  }
  query CustomerOrder($orderId: ID!) {
    order(id: $orderId) {
      ... on Order {
        ...Order
      }
    }
  }
` as const

export const CUSTOMER_CURRENT_ORDERS_QUERY = `#graphql
  fragment CurrentOrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment CurrentDiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        ...CurrentOrderMoney
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment CurrentOrderLineItemFull on LineItem {
    id
    title
    quantity
    price {
      ...CurrentOrderMoney
    }
    discountAllocations {
      allocatedAmount {
        ...CurrentOrderMoney
      }
      discountApplication {
        ...CurrentDiscountApplication
      }
    }
    totalDiscount {
      ...CurrentOrderMoney
    }
    image {
      altText
      height
      url
      id
      width
    }
    variantTitle
    productId
  }
  fragment CurrentOrder on Order {
    id
    name
    statusPageUrl
    processedAt
    createdAt
    financialStatus
    fulfillments(first: 1) {
      nodes {
        status
      }
    }
    totalTax {
      ...CurrentOrderMoney
    }
    totalPrice {
      ...CurrentOrderMoney
    }
    subtotal {
      ...CurrentOrderMoney
    }
    totalShipping {
      ...CurrentOrderMoney
    }
    shippingAddress {
      name
      formatted(withName: true)
      formattedArea
    }
    discountApplications(first: 100) {
      nodes {
        ...CurrentDiscountApplication
      }
    }
    lineItems(first: 100) {
      nodes {
        ...CurrentOrderLineItemFull
      }
    }
  }
  query CurrentOrders(
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) {
    customer {
      orders(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        sortKey: PROCESSED_AT
        reverse: true
      ) {
        nodes {
          ...CurrentOrder
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
` as const

export const CUSTOMER_PAST_ORDERS_QUERY = `#graphql
  fragment PastOrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment PastDiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        ...PastOrderMoney
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment PastOrderLineItemFull on LineItem {
    id
    title
    quantity
    productId
    price {
      ...PastOrderMoney
    }
    discountAllocations {
      allocatedAmount {
        ...PastOrderMoney
      }
      discountApplication {
        ...PastDiscountApplication
      }
    }
    totalDiscount {
      ...PastOrderMoney
    }
    image {
      altText
      height
      url
      id
      width
    }
    variantTitle
  }
  fragment PastOrder on Order {
    id
    name
    statusPageUrl
    processedAt
    createdAt
    financialStatus
    fulfillments(first: 1) {
      nodes {
        status
      }
    }
    totalTax {
      ...PastOrderMoney
    }
    totalPrice {
      ...PastOrderMoney
    }
    subtotal {
      ...PastOrderMoney
    }
    totalShipping {
      ...PastOrderMoney
    }
    shippingAddress {
      name
      formatted(withName: true)
      formattedArea
    }
    discountApplications(first: 100) {
      nodes {
        ...PastDiscountApplication
      }
    }
    lineItems(first: 100) {
      nodes {
        ...PastOrderLineItemFull
      }
    }
  }
  query PastOrders(
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) {
    customer {
      orders(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        
        sortKey: PROCESSED_AT
        reverse: true
      ) {
        nodes {
          ...PastOrder
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
` as const
