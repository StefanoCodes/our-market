import { Await, Link } from '@remix-run/react'
import { Box, Clock, HeartIcon, User2Icon, UserIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { Suspense, useId } from 'react'
import type { CartApiQueryFragment, HeaderQuery } from 'storefrontapi.generated'
// import {
//   SEARCH_ENDPOINT,
//   SearchFormPredictive,
// } from '~/components/features/Search/SearchFormPredictive'
import { SearchResultsPredictive } from '~/components/features/Search/SearchResultsPredictive'
import { Footer } from '~/components/layout/Footer'
import { Header } from '~/components/layout/Header'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { cn } from '~/lib/utils/utils'
import { useRootLoaderData } from '~/root'
import { CartMain } from '../features/Cart/ui/cart-main'
import FaqIcon from '../ui/icons/faq-icon'
import OrderIcon from '../ui/icons/order-icon'
import { Aside, useAside } from './Aside'
import { AnnouncementBarProvider } from './header/announcement-bar-provider'
import { MobileBottomNavProvider } from './header/mobile-bottom-nav-provider'
import { LoggedInAccount, LogoutButton, SignInButton } from './header/sign-in-badge'
import { Skeleton } from '~/components/ui/skeleton'

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>
  header: HeaderQuery
  isLoggedIn: Promise<boolean>
  publicStoreDomain: string
  children?: React.ReactNode
  hideAnnouncementBar: boolean
}

export function PageLayout({
  cart,
  children = null,
  header,
  isLoggedIn,
  publicStoreDomain,
  hideAnnouncementBar,
}: PageLayoutProps) {
  return (
    <MobileBottomNavProvider>
      <AnnouncementBarProvider hideAnnouncementBar={hideAnnouncementBar}>
        <Aside.Provider>
          <CartAside cart={cart} />
          {/* <SearchAside /> */}
          <AccountAside isLoggedIn={isLoggedIn} />
          {header && (
            <Header
              header={header}
              cart={cart}
              isLoggedIn={isLoggedIn}
              publicStoreDomain={publicStoreDomain}
            />
          )}

          <main className="min-h-screen-mobile-dvh bg-[#E2E8F040] md:min-h-screen-desktop-dvh">
            {children}
          </main>

          <Footer />
        </Aside.Provider>
      </AnnouncementBarProvider>
    </MobileBottomNavProvider>
  )
}

function CartAside({ cart }: { cart: PageLayoutProps['cart'] }) {
  return (
    <Aside type="cart" className="w-full xl:max-w-[30vw]" position="right">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} />
          }}
        </Await>
      </Suspense>
    </Aside>
  )
}

// function SearchAside() {
//   const queriesDatalistId = useId()
//   return (
//     <Aside type="search">
//       <div className="predictive-search">
//         <br />
//         <SearchFormPredictive>
//           {({ fetchResults, goToSearch, inputRef }) => (
//             <>
//               <input
//                 name="q"
//                 onChange={fetchResults}
//                 onFocus={fetchResults}
//                 placeholder="Search"
//                 ref={inputRef}
//                 type="search"
//                 list={queriesDatalistId}
//               />
//               &nbsp;
//               <button onClick={goToSearch}>Search</button>
//             </>
//           )}
//         </SearchFormPredictive>

//         <SearchResultsPredictive>
//           {({ items, total, term, state, closeSearch }) => {
//             const { articles, collections, pages, products, queries } = items

//             if (state === 'loading' && term.current) {
//               return <div>Loading...</div>
//             }

//             if (!total) {
//               return <SearchResultsPredictive.Empty term={term} />
//             }

//             return (
//               <>
//                 <SearchResultsPredictive.Queries
//                   queries={queries}
//                   queriesDatalistId={queriesDatalistId}
//                 />
//                 <SearchResultsPredictive.Products
//                   products={products}
//                   closeSearch={closeSearch}
//                   term={term}
//                 />
//                 <SearchResultsPredictive.Collections
//                   collections={collections}
//                   closeSearch={closeSearch}
//                   term={term}
//                 />
//                 <SearchResultsPredictive.Pages
//                   pages={pages}
//                   closeSearch={closeSearch}
//                   term={term}
//                 />
//                 <SearchResultsPredictive.Articles
//                   articles={articles}
//                   closeSearch={closeSearch}
//                   term={term}
//                 />
//                 {term.current && total ? (
//                   <Link onClick={closeSearch} to={`${SEARCH_ENDPOINT}?q=${term.current}`}>
//                     <p>
//                       View all results for <q>{term.current}</q>
//                       &nbsp; →
//                     </p>
//                   </Link>
//                 ) : null}
//               </>
//             )
//           }}
//         </SearchResultsPredictive>
//       </div>
//     </Aside>
//   )
// }

function AccountDetailsSkeleton() {
  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-3xl px-4 py-5">
      {/* Header skeleton */}
      <div className="mb-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Menu items skeleton */}
      <div className="flex flex-col gap-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="flex w-full flex-row items-center gap-2 border-b border-grey-300 px-1 py-8"
          >
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

function AccountAside({ isLoggedIn }: { isLoggedIn: Promise<boolean> }) {
  const data = useRootLoaderData()
  const customerDetails = data?.customer?.data.customer
  const { close } = useAside()
  return (
    <Aside type="account" className="w-dvw bg-grey-100">
      <Suspense fallback={<AccountDetailsSkeleton />}>
        <Await resolve={isLoggedIn}>
          {(isLoggedIn) => {
            return isLoggedIn ? (
              <div className="flex h-full w-full flex-col gap-2 rounded-3xl px-4 py-5">
                <div className="flex flex-row items-center justify-between">
                  <LoggedInAccount
                    email={customerDetails?.emailAddress?.emailAddress ?? ''}
                    name={customerDetails?.firstName ?? ''}
                  />
                  <LogoutButton className="text-red-800" />
                </div>
                <div className="flex flex-col gap-4">
                  <AccountDetail
                    href="/account/profile"
                    icon={User2Icon}
                    title="Profile"
                    onClick={close}
                  />
                  <AccountDetail href="/orders" icon={OrderIcon} title="Orders">
                    <div className="flex w-full flex-row items-center justify-between">
                      <div className="flex flex-row gap-8">
                        <Link
                          to="/account/orders/current"
                          onClick={close}
                          className="flex flex-col items-center gap-2 hover:underline"
                        >
                          <Box className="size-8 rounded-full border border-grey-300 p-1 text-grey-600" />
                          <span className="font-helvetica text-sm text-grey-800">Current</span>
                        </Link>
                        <Link
                          to="/account/orders/past"
                          className="flex flex-col items-center gap-2 hover:underline"
                          onClick={close}
                        >
                          <Clock className="size-8 rounded-full border border-grey-300 p-1 text-grey-600" />
                          <span className="font-helvetica text-sm text-grey-800">Past</span>
                        </Link>
                      </div>
                    </div>
                  </AccountDetail>

                  <AccountDetail
                    href="/account/preferences"
                    icon={HeartIcon}
                    title="Preferences"
                    onClick={close}
                  />

                  <AccountDetail href="/faq" icon={FaqIcon} title="FAQ" onClick={close} />
                </div>
              </div>
            ) : (
              <Login />
            )
          }}
        </Await>
      </Suspense>
    </Aside>
  )
}

function AccountDetail({
  href,
  icon: Icon,
  title,
  children,
  className,
  onClick,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const baseContent = (
    <div className="flex flex-1 flex-row items-center gap-[0.625rem]">
      <Icon className="h-5 w-5" />
      <span>{title}</span>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-2"
    >
      {children ? (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger
              className={cn(
                'flex w-full flex-row items-center justify-between rounded-md border-b border-grey-300 px-1 py-8 font-helvetica text-sm text-grey-800 transition',
                'data-[state=open]:border-none',
                className,
              )}
            >
              {baseContent}
            </AccordionTrigger>
            <AccordionContent className="border-b border-grey-300">{children}</AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <Link
          to={href}
          className={cn(
            'flex w-full flex-row items-center justify-between rounded-md border-b border-grey-300 px-1 py-8 font-helvetica text-sm text-grey-800 transition hover:bg-grey-100',
            className,
          )}
          onClick={onClick}
        >
          {baseContent}
        </Link>
      )}
    </motion.div>
  )
}

function Login() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <SignInButton />
    </div>
  )
}
