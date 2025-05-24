import { useFetcher } from '@remix-run/react'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Form } from '~/components/ui/form'
import { dietaryOptions } from '~/lib/integrations/klaviyo/constants'

type ActionResponse = {
  success: boolean
  message: string
}

// List of available dietary preferences

export function UserDietaryPreference({ defaultDietary }: { defaultDietary: string[] }) {
  const fetcher = useFetcher<ActionResponse>()
  const [open, setOpen] = useState(false)
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(defaultDietary || [])
  const isSubmitting = fetcher.state !== 'idle'

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast.success('Successfully updated your preference')
        setOpen(false)
      } else {
        toast.error('Something Went Wrong')
      }
    }
  }, [fetcher.data])

  const handleSubmit = () => {
    // Skip if nothing changed
    if (JSON.stringify(selectedPreferences.sort()) === JSON.stringify(defaultDietary.sort())) {
      setOpen(false)
      return
    }

    // Create a new FormData instance for submission
    const submissionData = new FormData()

    // Add the intent
    submissionData.append('intent', 'dietary')

    // Add each dietary preference as a separate entry
    selectedPreferences.forEach(preference => {
      submissionData.append('dietary', preference)
    })

    fetcher.submit(
      submissionData,
      { action: '/resource/preferences', method: 'POST' }
    )
  }

  const togglePreference = (preference: string) => {
    setSelectedPreferences(prev => {
      if (prev.includes(preference)) {
        return prev.filter(p => p !== preference)
      } else {
        return [...prev, preference]
      }
    })
  }

  return (
    <div className="flex flex-row items-center justify-between rounded-xl border border-grey-300 bg-grey-100 p-4">
      <p className="font-helvetica text-base font-regular text-grey-900">Dietary Preferences</p>
      {defaultDietary.length > 0 && (
        <div className="hidden md:block">
          <div className="flex flex-wrap gap-1">
            {defaultDietary.map((preference, index) => (
              <span key={preference} className="text-sm text-gray-600">
                {preference}{index < defaultDietary.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>

        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="h-10 px-2 py-2 bg-grey-100 min-w-[150px] justify-between md:min-w-[200px] text-left"
            disabled={isSubmitting}
          >
            {defaultDietary.length > 0 ? 'Edit Preferences' : 'Add Preferences'}
            <ChevronDown className="h-4 w-4 text-black" />
          </Button>

        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dietary Preferences</DialogTitle>
            <DialogDescription>
              Select all dietary preferences that apply to you.
            </DialogDescription>
          </DialogHeader>

          <div className="grid max-h-[300px] grid-cols-1 gap-4 overflow-y-auto py-4 md:grid-cols-2">
            {dietaryOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`preference-${option}`}
                  checked={selectedPreferences.includes(option)}
                  onCheckedChange={() => togglePreference(option)}
                  className={`data-[state=checked]:bg-brand-green`}
                />
                <label
                  htmlFor={`preference-${option}`}
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>

          <DialogFooter className="flex gap-4 justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className='bg-grey-100 font-helvetica text-sm  leading-[18px]  text-grey-900'
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || selectedPreferences.length === 0}
              className='bg-brand-green hover:bg-green-800 font-helvetica text-sm  leading-[18px]  text-brand-pearl'
            >
              {isSubmitting ? 'Saving...' : 'Save Preferences'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  )
}
