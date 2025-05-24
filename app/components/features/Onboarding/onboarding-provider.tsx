// import {
//   createContext,
//   type Dispatch,
//   type ReactNode,
//   type SetStateAction,
//   useContext,
//   useEffect,
//   useState,
// } from 'react'
// import { SIGN_UP_STEP } from '~/lib/constants/onboarding'
// import { OnboardingFlow } from './onboarding-flow'

// type OnboardingContextValue = {
//   isOpen: boolean
//   open: () => void
//   close: () => void
//   currentStep: number
//   setCurrentStep: Dispatch<SetStateAction<number>>
//   disableAutoPopup: () => void
// }

// const OnboardingContext = createContext<OnboardingContextValue | null>(null)

// export function OnboardingProvider({
//   children,
//   isLoggedIn,
//   hideOnboardingFlow,
// }: {
//   children: ReactNode
//   isLoggedIn: Promise<boolean>
//   hideOnboardingFlow: boolean
// }) {
//   const [isOpen, setIsOpen] = useState(false)
//   const [shouldAutoPopup, setShouldAutoPopup] = useState(!hideOnboardingFlow)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [currentStep, setCurrentStep] = useState(SIGN_UP_STEP)

//   // Handle isLoggedIn Promise
//   useEffect(() => {
//     isLoggedIn
//       .then((loggedIn) => {
//         setIsAuthenticated(loggedIn)
//         if (loggedIn) {
//           setShouldAutoPopup(false)
//         }
//       })
//       .catch((error) => {
//         console.error('Error checking authentication status:', error)
//         setShouldAutoPopup(false)
//       })
//   }, [isLoggedIn])

//   // Handle auto-popup
//   useEffect(() => {
//     if (!shouldAutoPopup || isAuthenticated || hideOnboardingFlow) {
//       setIsOpen(false)
//       return
//     }

//     const timer = setTimeout(() => {
//       setIsOpen(true)
//     }, 5000)

//     return () => clearTimeout(timer)
//   }, [shouldAutoPopup, isAuthenticated, hideOnboardingFlow])

//   const value = {
//     isOpen,
//     open: () => setIsOpen(true),
//     close: () => {
//       setIsOpen(false)
//       setCurrentStep(SIGN_UP_STEP)
//     },
//     currentStep,
//     setCurrentStep,
//     disableAutoPopup: () => setShouldAutoPopup(false),
//   }

//   return (
//     <OnboardingContext.Provider value={value}>
//       {children}
//       <OnboardingFlow />
//     </OnboardingContext.Provider>
//   )
// }

// export function useOnboarding() {
//   const context = useContext(OnboardingContext)
//   if (!context) {
//     throw new Error('useOnboarding must be used within an OnboardingProvider')
//   }
//   return context
// }
