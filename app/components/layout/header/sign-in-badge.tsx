import { Await, Form, Link, useFetcher, useNavigate, useNavigation } from '@remix-run/react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { Button } from '~/components/ui/button/button'
import { capitalize, cn } from '~/lib/utils/utils'
// import { useOnboarding } from '~/components/features/Onboarding/onboarding-provider'
import UserSquareIcon from '~/components/ui/icons/user-square-icon'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { useRootLoaderData } from '~/root'

export default function SignInBadge({
  isLoggedIn,
  showDisplayName = true,
  className,
}: {
  isLoggedIn: Promise<boolean>
  showDisplayName?: boolean
  className?: string
}) {
  const data = useRootLoaderData()
  if (!data) return null
  return (
    <Suspense fallback={<SignInButton />}>
      <Await resolve={isLoggedIn} errorElement="Sign in">
        {(isLoggedIn) =>
          isLoggedIn ? (
            <LoggedInAccount
              email={data.customer?.data?.customer?.emailAddress?.emailAddress ?? ''}
              name={data.customer?.data?.customer?.firstName ?? ''}
              showDisplayName={showDisplayName}
              className={className}
            />
          ) : (
            <SignInButton />
          )
        }
      </Await>
    </Suspense>
  )
}

export function LoggedInAccount({
  email,
  name,
  className,
  showDisplayName = true,
}: {
  email: string
  name: string
  className?: string
  showDisplayName?: boolean
}) {
  const fetcher = useFetcher({
    key: 'update-account-info',
  })
  const optimistic = fetcher.formData?.get('firstName') as string
  const displayName = optimistic ?? (name || email.split('@')[0].slice(0, 7))
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'flex h-full max-w-[9.25rem] items-center gap-1 border-0 bg-green-100 px-4 py-[0.84375rem] font-inter font-medium text-grey-800 shadow-none',
            className,
          )}
        >
          <UserSquareIcon />
          {showDisplayName && <span className="truncate">{capitalize(displayName)}</span>}
          <ChevronDown className="h-4 w-4 text-green-900" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="z-[200] flex max-w-[8.5rem] flex-col gap-4">
        <LogoutButton />
        {/* list of the account routes */}
        <ul className="flex flex-col gap-4">
          <li>
            <Link to="/account/profile">Profile</Link>
          </li>
          <li>
            <Link to="/account/orders">Orders</Link>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export function SignInButton() {
  return (
    <Link
      className={cn(
        'flex min-h-[45.2px] min-w-[72.96px] items-center justify-center font-inter text-sm font-medium text-grey-800 transition-colors',
      )}
      to="/account"
    >
      Sign in
    </Link>
  )
}
export function LogoutButton({ className }: { className?: string }) {
  return (
    <Form className={cn('account-logout', className)} method="POST" action="/account/logout">
      <button type="submit">Log out</button>
    </Form>
  )
}
