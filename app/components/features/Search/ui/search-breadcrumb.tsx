import { Link } from '@remix-run/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import ChevronRightIcon from '../../../ui/icons/chevron-right'

interface SearchBreadcrumbProps {
  title: string
  type: 'search' | 'collection'
}

export default function SearchBreadcrumb({ title, type = 'collection' }: SearchBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              to="/"
              className="hidden font-helvetica text-sm font-regular capitalize text-grey-700 lg:block"
            >
              {type === 'search' ? 'Search Results' : 'Home'}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <BreadcrumbLink asChild>
            <Link to="/">
              <ChevronRightIcon className="rotate-180 lg:rotate-0" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="font-helvetica text-sm font-regular capitalize text-grey-700">
            {title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
