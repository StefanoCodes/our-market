import type { CartApiQueryFragment, HeaderQuery } from 'storefrontapi.generated'
import MainHeader from './header/main-header'
export interface HeaderProps {
  header: HeaderQuery
  cart: Promise<CartApiQueryFragment | null>
  isLoggedIn: Promise<boolean>
  publicStoreDomain: string
}

export function Header({ header, isLoggedIn, cart, publicStoreDomain }: HeaderProps) {
  return (
    <MainHeader
      cart={cart}
      header={header}
      isLoggedIn={isLoggedIn}
      publicStoreDomain={publicStoreDomain}
    />
  )
}
