export const QUERY_PHONE_NUMBER = `#graphql
  query GetCustomerPhoneNumber {
    customer {
      metafield(key: "phone", namespace: "custom") {
        value
        jsonValue
      }
    }
  }
`

export const QUERY_LANGUAGE_PREFERENCE = `#graphql
  query GetCustomerLanguagePreference {
    customer {
      metafield(key: "language_preference", namespace: "custom") {
        value
        jsonValue
      }
    }
  }
`

export const QUERY_COUNTRY_OF_ORIGIN = `#graphql
  query getCustomerCountryOfOrigin {
    customer {
      metafield(key: "country_of_origin", namespace: "custom") {
        value
        jsonValue
      }
    }
  }
`

export const QUERY_DATE_OF_BIRTH = `#graphql
  query getCustomerDateOfBirth {
    customer {
      metafield(key: "birth_date", namespace: "facts") {
        value
        jsonValue
      }
    }
  }
`

export const QUERY_DIETARY_PREFERENCE = `#graphql
  query getCustomerDietaryPreference {
    customer {
      metafield(key: "dietary_preferences", namespace: "custom") {
        value
        jsonValue
      }
    }
  }
`

export const QUERY_STARTED_WELCOME_FLOW = `#graphql
  query getCustomerStartedWelcomeFlow {
    customer {
      metafield(key: "started_welcome_flow", namespace: "custom") {
        value
        jsonValue
      }
    }
  }
`
