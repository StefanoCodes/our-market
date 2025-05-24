export interface JudgeMeOAuthToken {
  access_token: string
  token_type: string
  scope: string
  created_at: number
}

export interface JudgeMeConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
}

export interface JudgeMeError {
  error: string
  error_description: string
}

export type JudgeMeScope =
  | 'public'
  | 'read_shops'
  | 'write_shops'
  | 'read_widgets'
  | 'read_orders'
  | 'write_orders'
  | 'read_products'
  | 'write_products'
  | 'read_reviewers'
  | 'write_reviewers'
  | 'read_reviews'
  | 'write_reviews'
  | 'read_settings'
  | 'write_settings'
