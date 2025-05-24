import { Outlet } from '@remix-run/react'
import ProgressBar from '~/components/features/Welcome/progess-bar'

export default function WelcomeFlowLayout() {
  return (
    <div className="mx-auto flex h-full max-w-container flex-col gap-6 px-4 pb-[4.25rem] pt-6 lg:gap-8 lg:pt-12 xl:px-16">
      <div className="flex h-full min-h-screen-mobile-dvh flex-col gap-4 md:min-h-screen-desktop-dvh">
        <h2 className="w-full text-center font-helvetica text-md font-medium text-black">
          Welcome To Our Market
        </h2>
        <div className="w-full border-b border-grey-400">
          <ProgressBar />
        </div>
        <section className="flex h-full max-h-[600px] min-h-[600px] w-full items-start justify-start pb-24 pt-12">
          <Outlet />
        </section>
        <div className="w-full border-b border-grey-400" />
      </div>
    </div>
  )
}
