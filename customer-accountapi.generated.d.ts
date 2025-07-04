/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as CustomerAccountAPI from '@shopify/hydrogen/customer-account-api-types';

export type CustomerAddressUpdateMutationVariables = CustomerAccountAPI.Exact<{
  address: CustomerAccountAPI.CustomerAddressInput;
  addressId: CustomerAccountAPI.Scalars['ID']['input'];
  defaultAddress?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Boolean']['input']
  >;
}>;

export type CustomerAddressUpdateMutation = {
  customerAddressUpdate?: CustomerAccountAPI.Maybe<{
    customerAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerAddress, 'id'>
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerAddressUserErrors,
        'code' | 'field' | 'message'
      >
    >;
  }>;
};

export type CustomerAddressDeleteMutationVariables = CustomerAccountAPI.Exact<{
  addressId: CustomerAccountAPI.Scalars['ID']['input'];
}>;

export type CustomerAddressDeleteMutation = {
  customerAddressDelete?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerAddressDeletePayload,
      'deletedAddressId'
    > & {
      userErrors: Array<
        Pick<
          CustomerAccountAPI.UserErrorsCustomerAddressUserErrors,
          'code' | 'field' | 'message'
        >
      >;
    }
  >;
};

export type CustomerAddressCreateMutationVariables = CustomerAccountAPI.Exact<{
  address: CustomerAccountAPI.CustomerAddressInput;
  defaultAddress?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Boolean']['input']
  >;
}>;

export type CustomerAddressCreateMutation = {
  customerAddressCreate?: CustomerAccountAPI.Maybe<{
    customerAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerAddress, 'id'>
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerAddressUserErrors,
        'code' | 'field' | 'message'
      >
    >;
  }>;
};

export type UpdateDefaultAddressMutationVariables = CustomerAccountAPI.Exact<{
  addressId: CustomerAccountAPI.Scalars['ID']['input'];
}>;

export type UpdateDefaultAddressMutation = {
  customerAddressUpdate?: CustomerAccountAPI.Maybe<{
    customerAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerAddress, 'id' | 'formatted'>
    >;
  }>;
};

export type CustomerFragment = Pick<
  CustomerAccountAPI.Customer,
  'id' | 'firstName' | 'lastName'
> & {
  emailAddress?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerEmailAddress,
      'emailAddress' | 'marketingState'
    >
  >;
  defaultAddress?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerAddress,
      | 'id'
      | 'formatted'
      | 'firstName'
      | 'lastName'
      | 'company'
      | 'address1'
      | 'address2'
      | 'territoryCode'
      | 'zoneCode'
      | 'city'
      | 'zip'
      | 'phoneNumber'
    >
  >;
  addresses: {
    nodes: Array<
      Pick<
        CustomerAccountAPI.CustomerAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'territoryCode'
        | 'zoneCode'
        | 'city'
        | 'zip'
        | 'phoneNumber'
      >
    >;
  };
};

export type AddressFragment = Pick<
  CustomerAccountAPI.CustomerAddress,
  | 'id'
  | 'formatted'
  | 'firstName'
  | 'lastName'
  | 'company'
  | 'address1'
  | 'address2'
  | 'territoryCode'
  | 'zoneCode'
  | 'city'
  | 'zip'
  | 'phoneNumber'
>;

export type CustomerDetailsQueryVariables = CustomerAccountAPI.Exact<{
  [key: string]: never;
}>;

export type CustomerDetailsQuery = {
  customer: Pick<
    CustomerAccountAPI.Customer,
    'id' | 'firstName' | 'lastName'
  > & {
    emailAddress?: CustomerAccountAPI.Maybe<
      Pick<
        CustomerAccountAPI.CustomerEmailAddress,
        'emailAddress' | 'marketingState'
      >
    >;
    defaultAddress?: CustomerAccountAPI.Maybe<
      Pick<
        CustomerAccountAPI.CustomerAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'territoryCode'
        | 'zoneCode'
        | 'city'
        | 'zip'
        | 'phoneNumber'
      >
    >;
    addresses: {
      nodes: Array<
        Pick<
          CustomerAccountAPI.CustomerAddress,
          | 'id'
          | 'formatted'
          | 'firstName'
          | 'lastName'
          | 'company'
          | 'address1'
          | 'address2'
          | 'territoryCode'
          | 'zoneCode'
          | 'city'
          | 'zip'
          | 'phoneNumber'
        >
      >;
    };
  };
};

export type CustomerEmailMarketingSubscribeMutationVariables =
  CustomerAccountAPI.Exact<{[key: string]: never}>;

export type CustomerEmailMarketingSubscribeMutation = {
  customerEmailMarketingSubscribe?: CustomerAccountAPI.Maybe<{
    emailAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerEmailAddress, 'marketingState'>
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerEmailMarketingUserErrors,
        'field' | 'message'
      >
    >;
  }>;
};

export type CustomerEmailMarketingUnsubscribeMutationVariables =
  CustomerAccountAPI.Exact<{[key: string]: never}>;

export type CustomerEmailMarketingUnsubscribeMutation = {
  customerEmailMarketingUnsubscribe?: CustomerAccountAPI.Maybe<{
    emailAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerEmailAddress, 'marketingState'>
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerEmailMarketingUserErrors,
        'field' | 'message'
      >
    >;
  }>;
};

export type MetafieldsSetMutationVariables = CustomerAccountAPI.Exact<{
  metafields:
    | Array<CustomerAccountAPI.MetafieldsSetInput>
    | CustomerAccountAPI.MetafieldsSetInput;
}>;

export type MetafieldsSetMutation = {
  metafieldsSet?: CustomerAccountAPI.Maybe<{
    metafields?: CustomerAccountAPI.Maybe<
      Array<
        Pick<
          CustomerAccountAPI.Metafield,
          'key' | 'namespace' | 'value' | 'createdAt' | 'updatedAt'
        >
      >
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.MetafieldsSetUserError,
        'field' | 'message' | 'code'
      >
    >;
  }>;
};

export type GetCustomerPhoneNumberQueryVariables = CustomerAccountAPI.Exact<{
  [key: string]: never;
}>;

export type GetCustomerPhoneNumberQuery = {
  customer: {
    metafield?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.Metafield, 'value' | 'jsonValue'>
    >;
  };
};

export type GetCustomerLanguagePreferenceQueryVariables =
  CustomerAccountAPI.Exact<{[key: string]: never}>;

export type GetCustomerLanguagePreferenceQuery = {
  customer: {
    metafield?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.Metafield, 'value' | 'jsonValue'>
    >;
  };
};

export type GetCustomerCountryOfOriginQueryVariables =
  CustomerAccountAPI.Exact<{[key: string]: never}>;

export type GetCustomerCountryOfOriginQuery = {
  customer: {
    metafield?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.Metafield, 'value' | 'jsonValue'>
    >;
  };
};

export type GetCustomerDateOfBirthQueryVariables = CustomerAccountAPI.Exact<{
  [key: string]: never;
}>;

export type GetCustomerDateOfBirthQuery = {
  customer: {
    metafield?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.Metafield, 'value' | 'jsonValue'>
    >;
  };
};

export type GetCustomerDietaryPreferenceQueryVariables =
  CustomerAccountAPI.Exact<{[key: string]: never}>;

export type GetCustomerDietaryPreferenceQuery = {
  customer: {
    metafield?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.Metafield, 'value' | 'jsonValue'>
    >;
  };
};

export type GetCustomerStartedWelcomeFlowQueryVariables =
  CustomerAccountAPI.Exact<{[key: string]: never}>;

export type GetCustomerStartedWelcomeFlowQuery = {
  customer: {
    metafield?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.Metafield, 'value' | 'jsonValue'>
    >;
  };
};

export type OrderMoneyFragment = Pick<
  CustomerAccountAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type DiscountApplicationFragment = {
  value:
    | ({__typename: 'MoneyV2'} & Pick<
        CustomerAccountAPI.MoneyV2,
        'amount' | 'currencyCode'
      >)
    | ({__typename: 'PricingPercentageValue'} & Pick<
        CustomerAccountAPI.PricingPercentageValue,
        'percentage'
      >);
};

export type OrderLineItemFullFragment = Pick<
  CustomerAccountAPI.LineItem,
  'id' | 'title' | 'quantity' | 'variantTitle' | 'productId'
> & {
  price?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  discountAllocations: Array<{
    allocatedAmount: Pick<
      CustomerAccountAPI.MoneyV2,
      'amount' | 'currencyCode'
    >;
    discountApplication: {
      value:
        | ({__typename: 'MoneyV2'} & Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >)
        | ({__typename: 'PricingPercentageValue'} & Pick<
            CustomerAccountAPI.PricingPercentageValue,
            'percentage'
          >);
    };
  }>;
  totalDiscount: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  image?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.Image,
      'altText' | 'height' | 'url' | 'id' | 'width'
    >
  >;
};

export type OrderFragment = Pick<
  CustomerAccountAPI.Order,
  | 'id'
  | 'name'
  | 'statusPageUrl'
  | 'processedAt'
  | 'createdAt'
  | 'cancelledAt'
  | 'cancelReason'
> & {
  fulfillments: {
    nodes: Array<
      Pick<CustomerAccountAPI.Fulfillment, 'status' | 'latestShipmentStatus'>
    >;
  };
  totalTax?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  subtotal?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  totalShipping: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  shippingAddress?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerAddress,
      'name' | 'formatted' | 'formattedArea'
    >
  >;
  discountApplications: {
    nodes: Array<{
      value:
        | ({__typename: 'MoneyV2'} & Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >)
        | ({__typename: 'PricingPercentageValue'} & Pick<
            CustomerAccountAPI.PricingPercentageValue,
            'percentage'
          >);
    }>;
  };
  lineItems: {
    nodes: Array<
      Pick<
        CustomerAccountAPI.LineItem,
        'id' | 'title' | 'quantity' | 'variantTitle' | 'productId'
      > & {
        price?: CustomerAccountAPI.Maybe<
          Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        discountAllocations: Array<{
          allocatedAmount: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          discountApplication: {
            value:
              | ({__typename: 'MoneyV2'} & Pick<
                  CustomerAccountAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >)
              | ({__typename: 'PricingPercentageValue'} & Pick<
                  CustomerAccountAPI.PricingPercentageValue,
                  'percentage'
                >);
          };
        }>;
        totalDiscount: Pick<
          CustomerAccountAPI.MoneyV2,
          'amount' | 'currencyCode'
        >;
        image?: CustomerAccountAPI.Maybe<
          Pick<
            CustomerAccountAPI.Image,
            'altText' | 'height' | 'url' | 'id' | 'width'
          >
        >;
      }
    >;
  };
};

export type CustomerOrderQueryVariables = CustomerAccountAPI.Exact<{
  orderId: CustomerAccountAPI.Scalars['ID']['input'];
}>;

export type CustomerOrderQuery = {
  order?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.Order,
      | 'id'
      | 'name'
      | 'statusPageUrl'
      | 'processedAt'
      | 'createdAt'
      | 'cancelledAt'
      | 'cancelReason'
    > & {
      fulfillments: {
        nodes: Array<
          Pick<
            CustomerAccountAPI.Fulfillment,
            'status' | 'latestShipmentStatus'
          >
        >;
      };
      totalTax?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
      subtotal?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalShipping: Pick<
        CustomerAccountAPI.MoneyV2,
        'amount' | 'currencyCode'
      >;
      shippingAddress?: CustomerAccountAPI.Maybe<
        Pick<
          CustomerAccountAPI.CustomerAddress,
          'name' | 'formatted' | 'formattedArea'
        >
      >;
      discountApplications: {
        nodes: Array<{
          value:
            | ({__typename: 'MoneyV2'} & Pick<
                CustomerAccountAPI.MoneyV2,
                'amount' | 'currencyCode'
              >)
            | ({__typename: 'PricingPercentageValue'} & Pick<
                CustomerAccountAPI.PricingPercentageValue,
                'percentage'
              >);
        }>;
      };
      lineItems: {
        nodes: Array<
          Pick<
            CustomerAccountAPI.LineItem,
            'id' | 'title' | 'quantity' | 'variantTitle' | 'productId'
          > & {
            price?: CustomerAccountAPI.Maybe<
              Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            discountAllocations: Array<{
              allocatedAmount: Pick<
                CustomerAccountAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              discountApplication: {
                value:
                  | ({__typename: 'MoneyV2'} & Pick<
                      CustomerAccountAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >)
                  | ({__typename: 'PricingPercentageValue'} & Pick<
                      CustomerAccountAPI.PricingPercentageValue,
                      'percentage'
                    >);
              };
            }>;
            totalDiscount: Pick<
              CustomerAccountAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            image?: CustomerAccountAPI.Maybe<
              Pick<
                CustomerAccountAPI.Image,
                'altText' | 'height' | 'url' | 'id' | 'width'
              >
            >;
          }
        >;
      };
    }
  >;
};

export type CurrentOrderMoneyFragment = Pick<
  CustomerAccountAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type CurrentDiscountApplicationFragment = {
  value:
    | ({__typename: 'MoneyV2'} & Pick<
        CustomerAccountAPI.MoneyV2,
        'amount' | 'currencyCode'
      >)
    | ({__typename: 'PricingPercentageValue'} & Pick<
        CustomerAccountAPI.PricingPercentageValue,
        'percentage'
      >);
};

export type CurrentOrderLineItemFullFragment = Pick<
  CustomerAccountAPI.LineItem,
  'id' | 'title' | 'quantity' | 'variantTitle' | 'productId'
> & {
  price?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  discountAllocations: Array<{
    allocatedAmount: Pick<
      CustomerAccountAPI.MoneyV2,
      'amount' | 'currencyCode'
    >;
    discountApplication: {
      value:
        | ({__typename: 'MoneyV2'} & Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >)
        | ({__typename: 'PricingPercentageValue'} & Pick<
            CustomerAccountAPI.PricingPercentageValue,
            'percentage'
          >);
    };
  }>;
  totalDiscount: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  image?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.Image,
      'altText' | 'height' | 'url' | 'id' | 'width'
    >
  >;
};

export type CurrentOrderFragment = Pick<
  CustomerAccountAPI.Order,
  | 'id'
  | 'name'
  | 'statusPageUrl'
  | 'processedAt'
  | 'createdAt'
  | 'financialStatus'
> & {
  fulfillments: {nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>};
  totalTax?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  subtotal?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  totalShipping: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  shippingAddress?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerAddress,
      'name' | 'formatted' | 'formattedArea'
    >
  >;
  discountApplications: {
    nodes: Array<{
      value:
        | ({__typename: 'MoneyV2'} & Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >)
        | ({__typename: 'PricingPercentageValue'} & Pick<
            CustomerAccountAPI.PricingPercentageValue,
            'percentage'
          >);
    }>;
  };
  lineItems: {
    nodes: Array<
      Pick<
        CustomerAccountAPI.LineItem,
        'id' | 'title' | 'quantity' | 'variantTitle' | 'productId'
      > & {
        price?: CustomerAccountAPI.Maybe<
          Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        discountAllocations: Array<{
          allocatedAmount: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          discountApplication: {
            value:
              | ({__typename: 'MoneyV2'} & Pick<
                  CustomerAccountAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >)
              | ({__typename: 'PricingPercentageValue'} & Pick<
                  CustomerAccountAPI.PricingPercentageValue,
                  'percentage'
                >);
          };
        }>;
        totalDiscount: Pick<
          CustomerAccountAPI.MoneyV2,
          'amount' | 'currencyCode'
        >;
        image?: CustomerAccountAPI.Maybe<
          Pick<
            CustomerAccountAPI.Image,
            'altText' | 'height' | 'url' | 'id' | 'width'
          >
        >;
      }
    >;
  };
};

export type CurrentOrdersQueryVariables = CustomerAccountAPI.Exact<{
  first?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Int']['input']
  >;
  last?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Int']['input']
  >;
  startCursor?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
  endCursor?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
}>;

export type CurrentOrdersQuery = {
  customer: {
    orders: {
      nodes: Array<
        Pick<
          CustomerAccountAPI.Order,
          | 'id'
          | 'name'
          | 'statusPageUrl'
          | 'processedAt'
          | 'createdAt'
          | 'financialStatus'
        > & {
          fulfillments: {
            nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>;
          };
          totalTax?: CustomerAccountAPI.Maybe<
            Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          totalPrice: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          subtotal?: CustomerAccountAPI.Maybe<
            Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          totalShipping: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          shippingAddress?: CustomerAccountAPI.Maybe<
            Pick<
              CustomerAccountAPI.CustomerAddress,
              'name' | 'formatted' | 'formattedArea'
            >
          >;
          discountApplications: {
            nodes: Array<{
              value:
                | ({__typename: 'MoneyV2'} & Pick<
                    CustomerAccountAPI.MoneyV2,
                    'amount' | 'currencyCode'
                  >)
                | ({__typename: 'PricingPercentageValue'} & Pick<
                    CustomerAccountAPI.PricingPercentageValue,
                    'percentage'
                  >);
            }>;
          };
          lineItems: {
            nodes: Array<
              Pick<
                CustomerAccountAPI.LineItem,
                'id' | 'title' | 'quantity' | 'variantTitle' | 'productId'
              > & {
                price?: CustomerAccountAPI.Maybe<
                  Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                discountAllocations: Array<{
                  allocatedAmount: Pick<
                    CustomerAccountAPI.MoneyV2,
                    'amount' | 'currencyCode'
                  >;
                  discountApplication: {
                    value:
                      | ({__typename: 'MoneyV2'} & Pick<
                          CustomerAccountAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >)
                      | ({__typename: 'PricingPercentageValue'} & Pick<
                          CustomerAccountAPI.PricingPercentageValue,
                          'percentage'
                        >);
                  };
                }>;
                totalDiscount: Pick<
                  CustomerAccountAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                image?: CustomerAccountAPI.Maybe<
                  Pick<
                    CustomerAccountAPI.Image,
                    'altText' | 'height' | 'url' | 'id' | 'width'
                  >
                >;
              }
            >;
          };
        }
      >;
      pageInfo: Pick<
        CustomerAccountAPI.PageInfo,
        'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
      >;
    };
  };
};

export type PastOrderMoneyFragment = Pick<
  CustomerAccountAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type PastDiscountApplicationFragment = {
  value:
    | ({__typename: 'MoneyV2'} & Pick<
        CustomerAccountAPI.MoneyV2,
        'amount' | 'currencyCode'
      >)
    | ({__typename: 'PricingPercentageValue'} & Pick<
        CustomerAccountAPI.PricingPercentageValue,
        'percentage'
      >);
};

export type PastOrderLineItemFullFragment = Pick<
  CustomerAccountAPI.LineItem,
  'id' | 'title' | 'quantity' | 'productId' | 'variantTitle'
> & {
  price?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  discountAllocations: Array<{
    allocatedAmount: Pick<
      CustomerAccountAPI.MoneyV2,
      'amount' | 'currencyCode'
    >;
    discountApplication: {
      value:
        | ({__typename: 'MoneyV2'} & Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >)
        | ({__typename: 'PricingPercentageValue'} & Pick<
            CustomerAccountAPI.PricingPercentageValue,
            'percentage'
          >);
    };
  }>;
  totalDiscount: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  image?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.Image,
      'altText' | 'height' | 'url' | 'id' | 'width'
    >
  >;
};

export type PastOrderFragment = Pick<
  CustomerAccountAPI.Order,
  | 'id'
  | 'name'
  | 'statusPageUrl'
  | 'processedAt'
  | 'createdAt'
  | 'financialStatus'
> & {
  fulfillments: {nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>};
  totalTax?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  subtotal?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  totalShipping: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  shippingAddress?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerAddress,
      'name' | 'formatted' | 'formattedArea'
    >
  >;
  discountApplications: {
    nodes: Array<{
      value:
        | ({__typename: 'MoneyV2'} & Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >)
        | ({__typename: 'PricingPercentageValue'} & Pick<
            CustomerAccountAPI.PricingPercentageValue,
            'percentage'
          >);
    }>;
  };
  lineItems: {
    nodes: Array<
      Pick<
        CustomerAccountAPI.LineItem,
        'id' | 'title' | 'quantity' | 'productId' | 'variantTitle'
      > & {
        price?: CustomerAccountAPI.Maybe<
          Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        discountAllocations: Array<{
          allocatedAmount: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          discountApplication: {
            value:
              | ({__typename: 'MoneyV2'} & Pick<
                  CustomerAccountAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >)
              | ({__typename: 'PricingPercentageValue'} & Pick<
                  CustomerAccountAPI.PricingPercentageValue,
                  'percentage'
                >);
          };
        }>;
        totalDiscount: Pick<
          CustomerAccountAPI.MoneyV2,
          'amount' | 'currencyCode'
        >;
        image?: CustomerAccountAPI.Maybe<
          Pick<
            CustomerAccountAPI.Image,
            'altText' | 'height' | 'url' | 'id' | 'width'
          >
        >;
      }
    >;
  };
};

export type PastOrdersQueryVariables = CustomerAccountAPI.Exact<{
  first?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Int']['input']
  >;
  last?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Int']['input']
  >;
  startCursor?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
  endCursor?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
}>;

export type PastOrdersQuery = {
  customer: {
    orders: {
      nodes: Array<
        Pick<
          CustomerAccountAPI.Order,
          | 'id'
          | 'name'
          | 'statusPageUrl'
          | 'processedAt'
          | 'createdAt'
          | 'financialStatus'
        > & {
          fulfillments: {
            nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>;
          };
          totalTax?: CustomerAccountAPI.Maybe<
            Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          totalPrice: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          subtotal?: CustomerAccountAPI.Maybe<
            Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          totalShipping: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          shippingAddress?: CustomerAccountAPI.Maybe<
            Pick<
              CustomerAccountAPI.CustomerAddress,
              'name' | 'formatted' | 'formattedArea'
            >
          >;
          discountApplications: {
            nodes: Array<{
              value:
                | ({__typename: 'MoneyV2'} & Pick<
                    CustomerAccountAPI.MoneyV2,
                    'amount' | 'currencyCode'
                  >)
                | ({__typename: 'PricingPercentageValue'} & Pick<
                    CustomerAccountAPI.PricingPercentageValue,
                    'percentage'
                  >);
            }>;
          };
          lineItems: {
            nodes: Array<
              Pick<
                CustomerAccountAPI.LineItem,
                'id' | 'title' | 'quantity' | 'productId' | 'variantTitle'
              > & {
                price?: CustomerAccountAPI.Maybe<
                  Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                discountAllocations: Array<{
                  allocatedAmount: Pick<
                    CustomerAccountAPI.MoneyV2,
                    'amount' | 'currencyCode'
                  >;
                  discountApplication: {
                    value:
                      | ({__typename: 'MoneyV2'} & Pick<
                          CustomerAccountAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >)
                      | ({__typename: 'PricingPercentageValue'} & Pick<
                          CustomerAccountAPI.PricingPercentageValue,
                          'percentage'
                        >);
                  };
                }>;
                totalDiscount: Pick<
                  CustomerAccountAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                image?: CustomerAccountAPI.Maybe<
                  Pick<
                    CustomerAccountAPI.Image,
                    'altText' | 'height' | 'url' | 'id' | 'width'
                  >
                >;
              }
            >;
          };
        }
      >;
      pageInfo: Pick<
        CustomerAccountAPI.PageInfo,
        'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
      >;
    };
  };
};

export type OrderItemFragment = Pick<
  CustomerAccountAPI.Order,
  'financialStatus' | 'id' | 'number' | 'processedAt'
> & {
  totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  fulfillments: {nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>};
  lineItems: {nodes: Array<Pick<CustomerAccountAPI.LineItem, 'title'>>};
};

export type CustomerOrdersFragment = {
  orders: {
    nodes: Array<
      Pick<
        CustomerAccountAPI.Order,
        'financialStatus' | 'id' | 'number' | 'processedAt'
      > & {
        totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
        fulfillments: {
          nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>;
        };
        lineItems: {nodes: Array<Pick<CustomerAccountAPI.LineItem, 'title'>>};
      }
    >;
    pageInfo: Pick<
      CustomerAccountAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
    >;
  };
};

export type CustomerOrdersQueryVariables = CustomerAccountAPI.Exact<{
  endCursor?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
  first?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Int']['input']
  >;
  last?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Int']['input']
  >;
  startCursor?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
}>;

export type CustomerOrdersQuery = {
  customer: {
    orders: {
      nodes: Array<
        Pick<
          CustomerAccountAPI.Order,
          'financialStatus' | 'id' | 'number' | 'processedAt'
        > & {
          totalPrice: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          fulfillments: {
            nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>;
          };
          lineItems: {nodes: Array<Pick<CustomerAccountAPI.LineItem, 'title'>>};
        }
      >;
      pageInfo: Pick<
        CustomerAccountAPI.PageInfo,
        'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
      >;
    };
  };
};

export type CustomerUpdateMutationVariables = CustomerAccountAPI.Exact<{
  customer: CustomerAccountAPI.CustomerUpdateInput;
}>;

export type CustomerUpdateMutation = {
  customerUpdate?: CustomerAccountAPI.Maybe<{
    customer?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.Customer, 'firstName'> & {
        emailAddress?: CustomerAccountAPI.Maybe<
          Pick<CustomerAccountAPI.CustomerEmailAddress, 'emailAddress'>
        >;
      }
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerUserErrors,
        'code' | 'field' | 'message'
      >
    >;
  }>;
};

interface GeneratedQueryTypes {
  '#graphql\n  query CustomerDetails {\n    customer {\n      ...Customer\n    }\n  }\n  #graphql\n  fragment Customer on Customer {\n    id\n    firstName\n    lastName\n    emailAddress {\n      emailAddress\n      marketingState\n    }\n    defaultAddress {\n      ...Address\n    }\n    addresses(first: 6) {\n      nodes {\n        ...Address\n      }\n    }\n  }\n  fragment Address on CustomerAddress {\n    id\n    formatted\n    firstName\n    lastName\n    company\n    address1\n    address2\n    territoryCode\n    zoneCode\n    city\n    zip\n    phoneNumber\n  }\n\n': {
    return: CustomerDetailsQuery;
    variables: CustomerDetailsQueryVariables;
  };
  '#graphql\n  query GetCustomerPhoneNumber {\n    customer {\n      metafield(key: "phone", namespace: "custom") {\n        value\n        jsonValue\n      }\n    }\n  }\n': {
    return: GetCustomerPhoneNumberQuery;
    variables: GetCustomerPhoneNumberQueryVariables;
  };
  '#graphql\n  query GetCustomerLanguagePreference {\n    customer {\n      metafield(key: "language_preference", namespace: "custom") {\n        value\n        jsonValue\n      }\n    }\n  }\n': {
    return: GetCustomerLanguagePreferenceQuery;
    variables: GetCustomerLanguagePreferenceQueryVariables;
  };
  '#graphql\n  query getCustomerCountryOfOrigin {\n    customer {\n      metafield(key: "country_of_origin", namespace: "custom") {\n        value\n        jsonValue\n      }\n    }\n  }\n': {
    return: GetCustomerCountryOfOriginQuery;
    variables: GetCustomerCountryOfOriginQueryVariables;
  };
  '#graphql\n  query getCustomerDateOfBirth {\n    customer {\n      metafield(key: "birth_date", namespace: "facts") {\n        value\n        jsonValue\n      }\n    }\n  }\n': {
    return: GetCustomerDateOfBirthQuery;
    variables: GetCustomerDateOfBirthQueryVariables;
  };
  '#graphql\n  query getCustomerDietaryPreference {\n    customer {\n      metafield(key: "dietary_preferences", namespace: "custom") {\n        value\n        jsonValue\n      }\n    }\n  }\n': {
    return: GetCustomerDietaryPreferenceQuery;
    variables: GetCustomerDietaryPreferenceQueryVariables;
  };
  '#graphql\n  query getCustomerStartedWelcomeFlow {\n    customer {\n      metafield(key: "started_welcome_flow", namespace: "custom") {\n        value\n        jsonValue\n      }\n    }\n  }\n': {
    return: GetCustomerStartedWelcomeFlowQuery;
    variables: GetCustomerStartedWelcomeFlowQueryVariables;
  };
  '#graphql\n  fragment OrderMoney on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment DiscountApplication on DiscountApplication {\n    value {\n      __typename\n      ... on MoneyV2 {\n        ...OrderMoney\n      }\n      ... on PricingPercentageValue {\n        percentage\n      }\n    }\n  }\n  fragment OrderLineItemFull on LineItem {\n    id\n    title\n    quantity\n    price {\n      ...OrderMoney\n    }\n    discountAllocations {\n      allocatedAmount {\n        ...OrderMoney\n      }\n      discountApplication {\n        ...DiscountApplication\n      }\n    }\n    totalDiscount {\n      ...OrderMoney\n    }\n    image {\n      altText\n      height\n      url\n      id\n      width\n    }\n    variantTitle\n    productId\n  }\n  fragment Order on Order {\n    id\n    name\n    statusPageUrl\n    processedAt\n    createdAt\n    cancelledAt\n    cancelReason\n    fulfillments(first: 20) {\n      nodes {\n        status\n        latestShipmentStatus\n      }\n    }\n    totalTax {\n      ...OrderMoney\n    }\n    totalPrice {\n      ...OrderMoney\n    }\n    subtotal {\n      ...OrderMoney\n    }\n totalShipping {\n      ...OrderMoney\n    }\n    shippingAddress {\n      name\n      formatted(withName: true)\n      formattedArea\n    }\n    discountApplications(first: 100) {\n      nodes {\n        ...DiscountApplication\n      }\n    }\n    lineItems(first: 100) {\n      nodes {\n        ...OrderLineItemFull\n      }\n    }\n  }\n  query CustomerOrder($orderId: ID!) {\n    order(id: $orderId) {\n      ... on Order {\n        ...Order\n      }\n    }\n  }\n': {
    return: CustomerOrderQuery;
    variables: CustomerOrderQueryVariables;
  };
  '#graphql\n  fragment CurrentOrderMoney on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment CurrentDiscountApplication on DiscountApplication {\n    value {\n      __typename\n      ... on MoneyV2 {\n        ...CurrentOrderMoney\n      }\n      ... on PricingPercentageValue {\n        percentage\n      }\n    }\n  }\n  fragment CurrentOrderLineItemFull on LineItem {\n    id\n    title\n    quantity\n    price {\n      ...CurrentOrderMoney\n    }\n    discountAllocations {\n      allocatedAmount {\n        ...CurrentOrderMoney\n      }\n      discountApplication {\n        ...CurrentDiscountApplication\n      }\n    }\n    totalDiscount {\n      ...CurrentOrderMoney\n    }\n    image {\n      altText\n      height\n      url\n      id\n      width\n    }\n    variantTitle\n    productId\n  }\n  fragment CurrentOrder on Order {\n    id\n    name\n    statusPageUrl\n    processedAt\n    createdAt\n    financialStatus\n    fulfillments(first: 1) {\n      nodes {\n        status\n      }\n    }\n    totalTax {\n      ...CurrentOrderMoney\n    }\n    totalPrice {\n      ...CurrentOrderMoney\n    }\n    subtotal {\n      ...CurrentOrderMoney\n    }\n    totalShipping {\n      ...CurrentOrderMoney\n    }\n    shippingAddress {\n      name\n      formatted(withName: true)\n      formattedArea\n    }\n    discountApplications(first: 100) {\n      nodes {\n        ...CurrentDiscountApplication\n      }\n    }\n    lineItems(first: 100) {\n      nodes {\n        ...CurrentOrderLineItemFull\n      }\n    }\n  }\n  query CurrentOrders(\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) {\n    customer {\n      orders(\n        first: $first\n        last: $last\n        before: $startCursor\n        after: $endCursor\n        sortKey: PROCESSED_AT\n        reverse: true\n      ) {\n        nodes {\n          ...CurrentOrder\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n': {
    return: CurrentOrdersQuery;
    variables: CurrentOrdersQueryVariables;
  };
  '#graphql\n  fragment PastOrderMoney on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment PastDiscountApplication on DiscountApplication {\n    value {\n      __typename\n      ... on MoneyV2 {\n        ...PastOrderMoney\n      }\n      ... on PricingPercentageValue {\n        percentage\n      }\n    }\n  }\n  fragment PastOrderLineItemFull on LineItem {\n    id\n    title\n    quantity\n    productId\n    price {\n      ...PastOrderMoney\n    }\n    discountAllocations {\n      allocatedAmount {\n        ...PastOrderMoney\n      }\n      discountApplication {\n        ...PastDiscountApplication\n      }\n    }\n    totalDiscount {\n      ...PastOrderMoney\n    }\n    image {\n      altText\n      height\n      url\n      id\n      width\n    }\n    variantTitle\n  }\n  fragment PastOrder on Order {\n    id\n    name\n    statusPageUrl\n    processedAt\n    createdAt\n    financialStatus\n    fulfillments(first: 1) {\n      nodes {\n        status\n      }\n    }\n    totalTax {\n      ...PastOrderMoney\n    }\n    totalPrice {\n      ...PastOrderMoney\n    }\n    subtotal {\n      ...PastOrderMoney\n    }\n    totalShipping {\n      ...PastOrderMoney\n    }\n    shippingAddress {\n      name\n      formatted(withName: true)\n      formattedArea\n    }\n    discountApplications(first: 100) {\n      nodes {\n        ...PastDiscountApplication\n      }\n    }\n    lineItems(first: 100) {\n      nodes {\n        ...PastOrderLineItemFull\n      }\n    }\n  }\n  query PastOrders(\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) {\n    customer {\n      orders(\n        first: $first\n        last: $last\n        before: $startCursor\n        after: $endCursor\n        \n        sortKey: PROCESSED_AT\n        reverse: true\n      ) {\n        nodes {\n          ...PastOrder\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n': {
    return: PastOrdersQuery;
    variables: PastOrdersQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment CustomerOrders on Customer {\n    orders(\n      sortKey: PROCESSED_AT,\n      reverse: true,\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      nodes {\n        ...OrderItem\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        endCursor\n        startCursor\n      }\n    }\n  }\n  #graphql\n  fragment OrderItem on Order {\n    totalPrice {\n      amount\n      currencyCode\n    }\n    financialStatus\n\n    fulfillments(first: 1) {\n      nodes {\n        status\n      }\n    }\n    lineItems(first: 250, reverse: true) {\n      nodes {\n        title\n      }\n    }\n    id\n\n    number\n    processedAt\n\n  }\n\n\n  query CustomerOrders(\n    $endCursor: String\n    $first: Int\n    $last: Int\n    $startCursor: String\n  ) {\n    customer {\n      ...CustomerOrders\n    }\n  }\n': {
    return: CustomerOrdersQuery;
    variables: CustomerOrdersQueryVariables;
  };
}

interface GeneratedMutationTypes {
  '#graphql\n  mutation customerAddressUpdate(\n    $address: CustomerAddressInput!\n    $addressId: ID!\n    $defaultAddress: Boolean\n ) {\n    customerAddressUpdate(\n      address: $address\n      addressId: $addressId\n      defaultAddress: $defaultAddress\n    ) {\n      customerAddress {\n        id\n      }\n      userErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressUpdateMutation;
    variables: CustomerAddressUpdateMutationVariables;
  };
  '#graphql\n  mutation customerAddressDelete(\n    $addressId: ID!,\n  ) {\n    customerAddressDelete(addressId: $addressId) {\n      deletedAddressId\n      userErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressDeleteMutation;
    variables: CustomerAddressDeleteMutationVariables;
  };
  '#graphql\n  mutation customerAddressCreate(\n    $address: CustomerAddressInput!\n    $defaultAddress: Boolean\n  ) {\n    customerAddressCreate(\n      address: $address\n      defaultAddress: $defaultAddress\n    ) {\n      customerAddress {\n        id\n      }\n      userErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressCreateMutation;
    variables: CustomerAddressCreateMutationVariables;
  };
  '#graphql\n  mutation updateDefaultAddress($addressId: ID!) {\n    customerAddressUpdate(addressId: $addressId, defaultAddress: true) {\n      customerAddress {\n            id\n            formatted\n      }\n    }\n  }\n': {
    return: UpdateDefaultAddressMutation;
    variables: UpdateDefaultAddressMutationVariables;
  };
  '#graphql\n mutation customerEmailMarketingSubscribe {\n  customerEmailMarketingSubscribe {\n    emailAddress {\n      marketingState\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n': {
    return: CustomerEmailMarketingSubscribeMutation;
    variables: CustomerEmailMarketingSubscribeMutationVariables;
  };
  '#graphql\n  mutation customerEmailMarketingUnsubscribe {\n  customerEmailMarketingUnsubscribe {\n    emailAddress {\n      marketingState\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n': {
    return: CustomerEmailMarketingUnsubscribeMutation;
    variables: CustomerEmailMarketingUnsubscribeMutationVariables;
  };
  '#graphql\nmutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {\n  metafieldsSet(metafields: $metafields) {\n    metafields {\n      key\n      namespace\n      value\n      createdAt\n      updatedAt\n    }\n    userErrors {\n      field\n      message\n      code\n    }\n  }\n}\n': {
    return: MetafieldsSetMutation;
    variables: MetafieldsSetMutationVariables;
  };
  '#graphql\n  mutation customerUpdate(\n    $customer: CustomerUpdateInput!\n  ){\n    customerUpdate(input: $customer) {\n      customer {\n        firstName\n        emailAddress {\n          emailAddress\n        }\n      }\n      userErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerUpdateMutation;
    variables: CustomerUpdateMutationVariables;
  };
}

declare module '@shopify/hydrogen' {
  interface CustomerAccountQueries extends GeneratedQueryTypes {}
  interface CustomerAccountMutations extends GeneratedMutationTypes {}
}
