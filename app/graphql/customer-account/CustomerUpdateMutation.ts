export const CUSTOMER_UPDATE_MUTATION = `#graphql
  mutation customerUpdate(
    $customer: CustomerUpdateInput!
  ){
    customerUpdate(input: $customer) {
      customer {
        firstName
        emailAddress {
          emailAddress
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
` as const
