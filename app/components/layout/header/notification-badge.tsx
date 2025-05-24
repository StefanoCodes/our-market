import { Await } from '@remix-run/react'
import { Suspense } from 'react'
import { cn } from '~/lib/utils/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog/notification-dialog'
import NotificationIcon from '~/components/ui/icons/notification-icon'
import CalendarIcon from '~/components/ui/icons/calendar-icon'
// in future this component will be receiving notifications and we will render them out if there are any
export default function NotificationBadge({
  isLoggedIn,
  iconClassName,
  className,
}: {
  isLoggedIn?: Promise<boolean>
  iconClassName?: string
  className?: string
}) {
  return (
    <Suspense fallback={<NotificationSkeleton />}>
      <Await resolve={isLoggedIn} errorElement={<div>Error: Unable to check login status</div>}>
        {(isLoggedIn) =>
          isLoggedIn ? <Notification iconClassName={iconClassName} className={className} /> : null
        }
      </Await>
    </Suspense>
  )
}
function Notification({
  className,
  iconClassName,
}: {
  iconClassName?: string
  className?: string
}) {
  return (
    <div className={cn('cursor-pointer rounded-[7px] bg-grey-100 px-[0.875rem] py-4', className)}>
      <Dialog>
        <DialogTrigger asChild>
          <NotificationIcon className={iconClassName} />
        </DialogTrigger>
        <DialogContent className="z-[200] min-h-[240px] sm:max-w-[470px]">
          <DialogHeader>
            <DialogTitle className="font-helvetica text-md font-bold tracking-tight">
              Notifications
            </DialogTitle>

            <DialogDescription className="pt-[1.125rem]">
              {/* @todo to check when passing down the data from shopify if not any notificaitons */}
              {/* <NoNotifications /> */}
              {/* if there are any this instead */}
              <NotificationsContent />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function NotificationSkeleton() {
  return <div className="h-12 w-11 rounded-[7px] bg-grey-100" />
}
// if there are arent any
function NoNotifications() {
  return (
    <div className="flex h-full min-h-[11.25rem] flex-col items-center justify-center gap-4 text-xs text-grey-600">
      <NotificationBadge className="w-fit" />
      <p>No new notifications</p>
    </div>
  )
}
// if there are any notificaitons

// data
// title
// notification body
// timeline
// date

function NotificationsContent() {
  return (
    <div className="flex flex-col">
      {/* map over and return a notification body */}
      <NotificationBody />
      <NotificationBody />
      <NotificationBody />
    </div>
  )
}

function NotificationBody() {
  return (
    <div className="border-b border-grey-300 py-3 pb-4">
      {/* left side title,body, and svg icon  */}
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="flex flex-row items-center gap-3">
          <div className="flex items-center justify-center rounded-[7px] bg-grey-100 p-2">
            <CalendarIcon />
          </div>
          <div className="flex flex-col items-start gap-2">
            <h4 className="m-0 font-helvetica text-base font-bold text-[#292D32]">
              This is a notification Title
            </h4>
            <p className="font-helvetica text-xs font-regular">Notification Body</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-1 pl-11 md:pl-0">
          {/* Date */}
          <span className="font-helvetica text-xs font-regular text-grey-600">Today</span>
          {/* Stlyish circle */}
          <div className="h-1 w-1 rounded-full bg-grey-600" />
          {/* Time */}
          <div className="font-helvetica text-xs font-regular text-grey-600">12:09pm</div>
        </div>
      </div>
    </div>
  )
}
