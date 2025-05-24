// import { zodResolver } from '@hookform/resolvers/zod'
// import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
// import { useFetcher, useNavigate } from '@remix-run/react'
// import { getShopifyCookies, Image } from '@shopify/hydrogen'
// import { AnimatePresence, motion } from 'framer-motion'
// import { X } from 'lucide-react'
// import { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { toast } from 'sonner'
// import MascotYellow from '~/components/layout/footer/mascot-yellow'
// import { Button } from '~/components/ui/button/button'
// import { ButtonWithLoading } from '~/components/ui/button/button-with-loading'
// import SecondaryButton from '~/components/ui/button/secondary-button'
// import { Dialog, DialogContent, DialogTitle } from '~/components/ui/dialog/dialog'
// import {
//   FORGOT_PASSWORD_STEP,
//   LOGIN_STEP,
//   RESET_PASSWORD_STEP,
//   RESET_PASSWORD_VERIFICATION_STEP,
//   SIGN_UP_STEP,
// } from '~/lib/constants/onboarding'
// import { cn } from '~/lib/utils/utils'
// import {
//   ForgotPasswordFormData,
//   forgotPasswordSchema,
//   LoginFormData,
//   loginSchema,
//   PasswordFormData,
//   passwordSchema,
//   SignupFormData,
//   signupSchema,
//   VerificationFormData,
//   verificationSchema,
// } from '~/lib/validations/onboarding'
// import { useOnboarding } from './onboarding-provider'
// import PrimaryLogoYellow from './primary-logo-yellow'
// import CreatePasswordStep from './steps/create-password'
// import ForgotPassword from './steps/forgot-password'
// import LoginForm from './steps/login/login-form'
// import PersonalInfo from './steps/sign-up'
// import VerificationStep from './steps/verification'

// // step 0 => login
// // step 1 => Forgot Password (Email)
// // step 2 => Reset Password Verification
// // step 3 => Create New Password
// // step 4 => sign up
// // step 5 => verification
// // step 6 => create password

// // todo integrate client side validation & react hook form to have the state persit across the form to use at the end of the flow
// interface ActionData {
//   error?: Record<string, string>
//   success?: boolean
//   fields?: Record<string, string>
//   step?: number
//   message?: string
//   onboardingFlowClosed?: boolean
// }

// const contentVariants = {
//   enter: (direction: number) => ({
//     x: direction > 0 ? '50%' : '-50%',
//     opacity: 0,
//   }),
//   center: {
//     x: 0,
//     opacity: 1,
//   },
//   exit: (direction: number) => ({
//     x: direction < 0 ? '50%' : '-50%',
//     opacity: 0,
//   }),
// }

// const steps = [
//   {
//     title: 'Welcome Back',
//   },
//   {
//     title: 'Reset Password',
//   },
//   {
//     title: 'Verify Account',
//   },
//   {
//     title: 'Create New Password',
//   },
//   {
//     title: 'Create your account and begin shopping',
//   },
//   {
//     title: 'Verify Account',
//   },
//   {
//     title: 'Create Password',
//   },
// ]
// // common classes
// const commonContentClasses = 'flex flex-col gap-4 h-full p-1'
// const commonButtonWrapperClasses = 'flex flex-col gap-6 mt-auto'
// const secondaryButtonClasses = 'font-helvetica font-medium text-base h-0 py-6 px-8 shadow-none'

// export function OnboardingFlow() {
//   // onboarding provider
//   const { isOpen, close, currentStep, setCurrentStep } = useOnboarding()

//   // fetcher
//   const fetcher = useFetcher<ActionData>()
//   const navigate = useNavigate()
//   const [direction, setDirection] = useState(0)

//   // loading state handling
//   const isSubmitting = fetcher.state === 'submitting'

//   // Step management
//   const isLoggingIn = currentStep === 0
//   const isSigningUp = currentStep > 3
//   const isFinalStep = currentStep === steps.length - 1
//   const isResetPassword = currentStep === 3

//   // Setup form hooks for each step
//   const loginForm = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     mode: 'onTouched',
//   })

//   const forgotPasswordForm = useForm<ForgotPasswordFormData>({
//     resolver: zodResolver(forgotPasswordSchema),
//     mode: 'onTouched',
//   })

//   const verificationForm = useForm<VerificationFormData>({
//     resolver: zodResolver(verificationSchema),
//     mode: 'onTouched',
//   })

//   const passwordForm = useForm<PasswordFormData>({
//     resolver: zodResolver(passwordSchema),
//     mode: 'onTouched',
//   })

//   const signupForm = useForm<SignupFormData>({
//     resolver: zodResolver(signupSchema),
//     mode: 'onTouched',
//   })

//   // Form submission handling
//   useEffect(() => {
//     // this will immediately close the onboarding flow if the user clicks the close button
//     if (fetcher.data?.onboardingFlowClosed) return

//     if (fetcher.data?.error) {
//       if (fetcher.data?.message) {
//         toast.error(fetcher.data?.message)
//       }
//       return
//     }

//     if (fetcher.data?.success) {
//       if (fetcher.data?.message) {
//         if (isLoggingIn) {
//           close()
//           setTimeout(() => toast.success(fetcher.data?.message), 300)
//         } else {
//           toast.success(fetcher.data?.message)
//         }
//       }
//       handleSuccessfulSubmission(fetcher.data)
//     }
//   }, [fetcher.data])

//   const handleSuccessfulSubmission = async (data: ActionData) => {
//     if (data.step !== undefined) {
//       setDirection(data.step > currentStep ? 1 : -1)
//       setCurrentStep(data.step)
//       return
//     }

//     // if it was sucessful
//     if (isLoggingIn) {
//       // TODO UI FIX
//       loginForm.reset()
//       return
//     }

//     if (isResetPassword) {
//       setCurrentStep(LOGIN_STEP)
//       // reset the forms since the state has not actually changed when we redirect the m to the login step
//       forgotPasswordForm.reset()
//       passwordForm.reset()
//       verificationForm.reset()
//       return
//     }

//     if (isFinalStep) {
//       close()
//       signupForm.reset()
//       passwordForm.reset()
//       verificationForm.reset()
//       await new Promise((resolve) => setTimeout(resolve, 300))
//       navigate('/welcome')
//       return
//     }
//     // Default behavior: move to next step
//     nextStep()
//   }

//   const nextStep = () => {
//     setDirection(1)
//     setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
//   }

//   const prevStep = () => {
//     setDirection(-1)
//     setCurrentStep((prev) => Math.max(prev - 1, 0))
//   }

//   const renderStepContent = () => {
//     switch (currentStep) {
//       // login
//       case LOGIN_STEP:
//         return (
//           <fetcher.Form
//             action="/resource/onboarding"
//             method="POST"
//             className={commonContentClasses}
//             onSubmit={loginForm.handleSubmit((data) => {
//               fetcher.submit(
//                 { ...data, intent: 'login' },
//                 { action: '/resource/onboarding', method: 'POST' },
//               )
//             })}
//           >
//             <div className="flex-1">
//               <LoginForm form={loginForm} />
//             </div>
//             <div className={commonButtonWrapperClasses}>
//               <ButtonWithLoading isLoading={isSubmitting}>Login</ButtonWithLoading>
//               <SecondaryButton type="button" className={secondaryButtonClasses}>
//                 Continue with Google
//               </SecondaryButton>
//             </div>
//           </fetcher.Form>
//         )
//       // forgot password
//       case FORGOT_PASSWORD_STEP:
//         return (
//           <fetcher.Form
//             action="/resource/onboarding"
//             method="POST"
//             className={commonContentClasses}
//             onSubmit={forgotPasswordForm.handleSubmit((data) => {
//               fetcher.submit(
//                 { ...data, intent: 'forgot-password' },
//                 { action: '/resource/onboarding', method: 'POST' },
//               )
//             })}
//           >
//             <div className="flex-1">
//               <ForgotPassword error={fetcher.data?.error} form={forgotPasswordForm} />
//             </div>
//             <div className={commonButtonWrapperClasses}>
//               <ButtonWithLoading isLoading={isSubmitting}>Reset Password</ButtonWithLoading>
//               <SecondaryButton
//                 onClick={() => setCurrentStep(0)}
//                 type="button"
//                 className={secondaryButtonClasses}
//               >
//                 Back to Login
//               </SecondaryButton>
//             </div>
//           </fetcher.Form>
//         )
//       // // reset password verification
//       case RESET_PASSWORD_VERIFICATION_STEP:
//         return (
//           <fetcher.Form
//             action="/resource/onboarding"
//             method="POST"
//             className={commonContentClasses}
//             onSubmit={verificationForm.handleSubmit((data) => {
//               fetcher.submit(
//                 { ...data, intent: 'verify-reset-password' },
//                 { action: '/resource/onboarding', method: 'POST' },
//               )
//             })}
//           >
//             <div className="flex-1">
//               <VerificationStep
//                 type="reset-password"
//                 error={fetcher.data?.error}
//                 form={verificationForm}
//               />
//             </div>
//             <div className={commonButtonWrapperClasses}>
//               <ButtonWithLoading isLoading={isSubmitting}>Verify</ButtonWithLoading>
//               <SecondaryButton onClick={prevStep} type="button" className={secondaryButtonClasses}>
//                 Back
//               </SecondaryButton>
//             </div>
//           </fetcher.Form>
//         )
//       // // create new password after reset
//       case RESET_PASSWORD_STEP:
//         return (
//           <fetcher.Form
//             action="/resource/onboarding"
//             method="POST"
//             className={commonContentClasses}
//             onSubmit={passwordForm.handleSubmit((data) => {
//               fetcher.submit(
//                 { ...data, intent: 'create-new-password' },
//                 { action: '/resource/onboarding', method: 'POST' },
//               )
//             })}
//           >
//             <div className="flex-1">
//               <CreatePasswordStep
//                 type="reset-password"
//                 error={fetcher.data?.error}
//                 form={passwordForm}
//               />
//             </div>
//             <div className={commonButtonWrapperClasses}>
//               <ButtonWithLoading isLoading={isSubmitting}>Create New Password</ButtonWithLoading>
//               <SecondaryButton onClick={prevStep} type="button" className={secondaryButtonClasses}>
//                 Back
//               </SecondaryButton>
//             </div>
//           </fetcher.Form>
//         )
//       // 1st sign up step
//       case SIGN_UP_STEP:
//         return (
//           <fetcher.Form
//             action="/resource/onboarding"
//             method="POST"
//             className={commonContentClasses}
//             onSubmit={signupForm.handleSubmit((data) => {
//               fetcher.submit(
//                 { ...data, intent: 'signup-personal-info' },
//                 { action: '/resource/onboarding', method: 'POST' },
//               )
//             })}
//           >
//             <div className="flex flex-1 flex-col gap-4">
//               <PersonalInfo error={fetcher.data?.error} form={signupForm} />
//             </div>
//             <div className={commonButtonWrapperClasses}>
//               <ButtonWithLoading isLoading={isSubmitting}>Next</ButtonWithLoading>
//               <SecondaryButton type="button" className={secondaryButtonClasses}>
//                 Continue with google
//               </SecondaryButton>
//             </div>
//           </fetcher.Form>
//         )
//       // 2nd sign up step verification
//       case SIGN_UP_STEP + 1:
//         return (
//           <fetcher.Form
//             action="/resource/onboarding"
//             method="POST"
//             className={commonContentClasses}
//             onSubmit={verificationForm.handleSubmit((data) => {
//               fetcher.submit(
//                 { ...data, intent: 'verify-signup' },
//                 { action: '/resource/onboarding', method: 'POST' },
//               )
//             })}
//           >
//             <div className="flex-1">
//               <VerificationStep type="signup" error={fetcher.data?.error} form={verificationForm} />
//             </div>
//             <div className={commonButtonWrapperClasses}>
//               <ButtonWithLoading isLoading={isSubmitting}>Verify</ButtonWithLoading>
//               <SecondaryButton onClick={prevStep} type="button" className={secondaryButtonClasses}>
//                 Back
//               </SecondaryButton>
//             </div>
//           </fetcher.Form>
//         )
//       //  create password for signup
//       case SIGN_UP_STEP + 2:
//         return (
//           <fetcher.Form
//             action="/resource/onboarding"
//             method="POST"
//             className={commonContentClasses}
//             onSubmit={passwordForm.handleSubmit((data) => {
//               fetcher.submit(
//                 { ...data, intent: 'complete-signup' },
//                 { action: '/resource/onboarding', method: 'POST' },
//               )
//             })}
//           >
//             <div className="flex-1">
//               <CreatePasswordStep type="signup" error={fetcher.data?.error} form={passwordForm} />
//             </div>
//             <div className={commonButtonWrapperClasses}>
//               <ButtonWithLoading isLoading={isSubmitting}>Create Account</ButtonWithLoading>
//               <SecondaryButton onClick={prevStep} type="button" className={secondaryButtonClasses}>
//                 Back
//               </SecondaryButton>
//             </div>
//           </fetcher.Form>
//         )
//       default:
//         return null
//     }
//   }
//   return (
//     <Dialog open={isOpen} onOpenChange={close}>
//       <AnimatePresence mode="wait" custom={direction}>
//         {isOpen && (
//           <>
//             <VisuallyHidden.Root>
//               <DialogTitle>Onboarding Flow</DialogTitle>
//             </VisuallyHidden.Root>
//             <DialogContent
//               tabIndex={-1}
//               aria-describedby="onboarding-flow"
//               aria-description="Onboarding Flow"
//               className="bg-transparent max-w-onboarding-container border-none p-0 shadow-none"
//             >
//               <div className="relative z-20 grid min-h-dvh overflow-hidden bg-white lg:min-h-onboarding-container lg:grid-cols-2 lg:rounded-lg">
//                 {/* <fetcher.Form
//                   method="POST"
//                   action="/resource/onboarding"
//                   className="absolute right-4 top-4 z-50"
//                 > */}
//                 <div className="absolute right-4 top-4 z-50">
//                   <input type="hidden" name="intent" value="close-onboarding" />
//                   <Button
//                     type="submit"
//                     variant="ghost"
//                     size="icon"
//                     onClick={close}
//                     aria-label="Close onboarding"
//                   >
//                     <X className="h-5 w-5 text-grey-700" />
//                   </Button>
//                 </div>
//                 {/* </fetcher.Form> */}
//                 <OnboardingFlowBrandingLeft />
//                 <div className="z-30 flex h-full flex-col gap-0 overflow-hidden px-4 py-[3.25rem] lg:p-[3.25rem]">
//                   <motion.div
//                     key={currentStep}
//                     custom={direction}
//                     variants={contentVariants}
//                     className="flex w-full flex-1 flex-col justify-center overflow-hidden"
//                     initial="enter"
//                     animate="center"
//                     exit="exit"
//                     transition={{
//                       x: { type: 'spring', stiffness: 300, damping: 30 },
//                       opacity: { duration: 0.2 },
//                     }}
//                   >
//                     <div>
//                       <h2
//                         className={cn(
//                           'pb-4 font-helvetica text-xl font-medium text-black',
//                           currentStep === 1 && 'text-md',
//                         )}
//                       >
//                         {steps[currentStep].title}
//                       </h2>
//                     </div>
//                     <div className="flex flex-col gap-8">{renderStepContent()}</div>
//                   </motion.div>

//                   {/* Login/Signup Toggle */}
//                   <div className="flex w-full flex-row items-center justify-center gap-[1px]">
//                     <span className="font-helvetica text-xs font-medium text-grey-700">
//                       {isSigningUp ? 'Have an account?' : 'New Here?'}
//                     </span>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="font-helvetica text-xs font-bold text-brand-green hover:bg-white"
//                       onClick={() => setCurrentStep(isSigningUp ? 0 : 4)}
//                     >
//                       {isSigningUp ? 'Log in' : 'Sign up here'}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </DialogContent>
//           </>
//         )}
//       </AnimatePresence>
//     </Dialog>
//   )
// }

// function OnboardingFlowBrandingLeft() {
//   return (
//     <div className="relative z-20 hidden items-center justify-center bg-brand-green lg:flex">
//       <Image
//         src={`/backgrounds/marketing-announcement-background-green.svg`}
//         alt="green background"
//         className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-hard-light"
//         sizes="(min-width: 45em) 50vw, 100vw"
//       />
//       <MascotYellow className="absolute -right-5 bottom-0" />
//       <PrimaryLogoYellow className="absolute left-10 top-10" />
//     </div>
//   )
// }
