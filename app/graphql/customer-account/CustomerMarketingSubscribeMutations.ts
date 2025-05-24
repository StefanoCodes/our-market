export const EMAIL_MARKETING_SUBSCRIBE_MUTATION = `#graphql
 mutation customerEmailMarketingSubscribe {
  customerEmailMarketingSubscribe {
    emailAddress {
      marketingState
    }
    userErrors {
      field
      message
    }
  }
}
` as const

export const EMAIL_MARKETING_UNSUBSCRIBE_MUTATION = `#graphql
  mutation customerEmailMarketingUnsubscribe {
  customerEmailMarketingUnsubscribe {
    emailAddress {
      marketingState
    }
    userErrors {
      field
      message
    }
  }
}
` as const
