import { useFetcher, useSearchParams } from '@remix-run/react'
import { AnimatePresence, motion } from 'motion/react'

import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/ui/button/button'
import SearchIcon from '~/components/ui/icons/search-icon'
import { cn } from '~/lib/utils/utils'

const containerVariants = {
  collapsed: {},
  expanded: {},
}

const contentVariants = {
  collapsed: { opacity: 0 },
  expanded: { opacity: 1 },
}

const popularSearchVariants = {
  collapsed: { opacity: 0 },
  expanded: { opacity: 1 },
}

const staggerChildren = {
  collapsed: {},
  expanded: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

const childVariants = {
  collapsed: { opacity: 0, y: 10 },
  expanded: { opacity: 1, y: 0 },
}

interface ExpandableSearchProps {
  className?: string
}

export default function ExpandableSearch({ className }: ExpandableSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const fetcher = useFetcher()
  // retriving
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const inputRef = useRef<HTMLInputElement>(null)

  const popularSearches = ['Rice', 'Vegetables', 'Pasta']

  // Sync input with URL params
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = query
    }
  }, [query])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    fetcher.submit(e.target as HTMLFormElement)
    setIsExpanded(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={cn('relative w-full lg:max-w-searchInput', className)}>
      <div
        className="fixed inset-0 z-30 bg-black/20 transition-opacity duration-300 ease-in-out"
        style={{
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
      />
      <motion.div
        ref={containerRef}
        className="relative overflow-visible rounded-full"
        initial="collapsed"
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={containerVariants}
      >
        <fetcher.Form
          method="post"
          action="/search"
          className="relative z-40 flex items-center gap-2 rounded-full"
          onSubmit={handleSearch}
        >
          <SearchIcon className="text-gray-600 absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform cursor-pointer select-none" />

          <input
            ref={inputRef}
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search for anything"
            key={query}
            className={cn(
              'h-[3.25rem] w-full rounded-2xl border border-grey-500 bg-grey-100 py-[1.0625rem] pl-10 pr-4 font-helvetica text-sm font-regular outline-none ring-0 transition-colors placeholder:font-helvetica placeholder:text-sm placeholder:font-medium placeholder:text-grey-600 [&::-webkit-search-cancel-button]:appearance-none',
              isExpanded && 'rounded-none rounded-t-2xl border-b-0 bg-white',
            )}
            onFocus={() => setIsExpanded(true)}
            onClick={() => setIsExpanded(true)}
          />
        </fetcher.Form>
        {/* box animation */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              transition={{ duration: 0.3 }}
              className="absolute left-0 right-0 top-0 z-30 flex w-full flex-col items-start justify-start gap-3 rounded-2xl border border-grey-500 bg-white p-4 pt-[52px] shadow-lg"
            >
              <motion.div
                className="mb-2 flex w-full items-center gap-2 border-t border-grey-300 pt-4 text-sm text-grey-600"
                variants={popularSearchVariants}
              >
                <span className="font-helvetica text-xs font-medium text-grey-600">
                  Popular Search 🔥
                </span>
              </motion.div>
              <motion.div className="flex w-full flex-wrap gap-2" variants={staggerChildren}>
                {popularSearches.map((term) => (
                  <motion.div key={term} variants={childVariants}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full border-[0.5px] border-grey-400 bg-grey-100 px-[1.15625rem] py-1 font-helvetica text-xs font-medium text-grey-600"
                      onClick={() => {
                        if (inputRef.current) {
                          inputRef.current.value = term
                          fetcher.submit(inputRef.current.form!)
                        }
                        setIsExpanded(false)
                      }}
                    >
                      {term}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
