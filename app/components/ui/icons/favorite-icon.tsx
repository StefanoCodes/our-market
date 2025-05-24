import { cn } from '~/lib/utils/utils'

export default function FavoriteIcon({
  className,
  innerPathClassName,
}: {
  className?: string
  innerPathClassName?: string
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M15 15.7165H14.3667C13.7 15.7165 13.0667 15.9748 12.6 16.4414L11.175 17.8498C10.525 18.4914 9.46666 18.4914 8.81666 17.8498L7.39166 16.4414C6.925 15.9748 6.28333 15.7165 5.625 15.7165H5C3.61667 15.7165 2.5 14.6081 2.5 13.2415V4.14978C2.5 2.78311 3.61667 1.6748 5 1.6748H15C16.3833 1.6748 17.5 2.78311 17.5 4.14978V13.2415C17.5 14.5998 16.3833 15.7165 15 15.7165Z"
        stroke={cn('currentColor', innerPathClassName)}
        strokeWidth="1.3"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.2333 12.4668C10.1083 12.5085 9.9 12.5085 9.76667 12.4668C8.68333 12.0918 6.25 10.5502 6.25 7.92517C6.25 6.76684 7.18333 5.8335 8.33333 5.8335C9.01667 5.8335 9.61667 6.1585 10 6.66683C10.3833 6.1585 10.9833 5.8335 11.6667 5.8335C12.8167 5.8335 13.75 6.76684 13.75 7.92517C13.7417 10.5502 11.3167 12.0918 10.2333 12.4668Z"
        stroke="#475569"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
