import { NavLink, useLocation } from '@remix-run/react'
import { useIsMobile } from '~/lib/hooks/use-is-mobile'
import { cn } from '~/lib/utils/utils'

const steps = [
  {
    id: 1,
    title: 'Account',
    path: '/welcome/account',
  },
  {
    id: 2,
    title: 'Language Preference',
    path: '/welcome/language',
  },
  {
    id: 3,
    title: 'Country Of Origin',
    path: '/welcome/country',
  },
  {
    id: 4,
    title: 'Birth Date',
    path: '/welcome/date',
  },
  {
    id: 5,
    title: 'Dietary Preference',
    path: '/welcome/dietary',
  },
]
/* 
this is a helper used to keep track of which step has been done 
*/
const stepsTracker = {
  '/welcome/account': steps[0],
  '/welcome/language': steps[1],
  '/welcome/country': steps[2],
  '/welcome/date': steps[3],
  '/welcome/dietary': steps[4],
}

interface Step {
  id: number
  title: string
  path: string
}

export default function ProgressBar() {
  const pathname = useLocation().pathname
  const isSuccessPath = pathname === '/welcome/success'

  return (
    <nav className="mx-auto my-4 w-full max-w-4xl px-4" aria-label="Progress">
      {!isSuccessPath && <StepsList steps={steps} currentPath={pathname} />}
    </nav>
  )
}

function StepsList({ steps, currentPath }: { steps: Step[]; currentPath: string }) {
  const isMobile = useIsMobile()
  return (
    <ol
      role="list"
      className="flex w-full flex-wrap items-center justify-center gap-4 rounded-3xl px-4 py-3 md:flex-nowrap md:border md:border-green-300"
    >
      {steps.map((step, index) => {
        const isActive = currentPath === step.path
        const trackedStep = stepsTracker[currentPath as keyof typeof stepsTracker]
        const isAlreadyAhead = step.id < trackedStep.id
        return (
          <li key={step.id} className="flex items-center gap-2">
            <NavLink
              to={step.path}
              key={step.id}
              className={({ isActive }) => `${isActive ? `text-brand-green` : 'text-brand-black'}`}
            >
              {isMobile ? step.title.split(' ')[0] : step.title}
            </NavLink>
            {index !== steps.length - 1 && (
              <div
                className={cn(
                  `h-1 w-8 animate-pulse rounded-xl bg-brand-green`,
                  !isActive && `animate-none bg-grey-300`,
                  isAlreadyAhead && `bg-brand-green`,
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
