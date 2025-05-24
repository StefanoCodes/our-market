import { cn } from '~/lib/utils/utils'
/*

This Component allows us to increase the touch area target on mobile devices for clickable elements which are smaller than the reccomened size of (48px x 48px)
this allows better accessability when using it for users on touch devices and the special media query applies the touch area if the device uses fingers as the navigator
when using this make sure the parent has the class of relative in order for the component to be scoped to the parent element
*/

export function TouchArea({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden',
      )}
    />
  )
}
