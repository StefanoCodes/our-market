import { Link } from '@remix-run/react'
import { Image } from '@shopify/hydrogen'
import { cn } from '~/lib/utils/utils'
import FooterLogo from './footer/footer-logo'
import MascotYellow from './footer/mascot-yellow'

export function Footer() {
  return (
    <footer className="relative h-footer-mobile bg-green-800 md:min-h-footer-desktop">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={`/backgrounds/marketing-announcement-background-green.svg`}
          className={cn('absolute h-full w-full object-cover opacity-20 mix-blend-overlay')}
          sizes="(min-width: 45em) 400px, 100vw"
          loading="lazy"
        />
      </div>
      {/* Container (max-width store just like the header)  */}
      <div className="relative z-10 mx-auto flex h-full max-w-container flex-col gap-16 p-4 py-[3.25rem] md:flex-row xl:px-16">
        {/* Nav Menu */}
        <div className="flex flex-row gap-16">
          <ul className="flex flex-col gap-4">
            <li>
              <Link to={'/about'} className="font-helvetica text-base font-medium text-pearl-700">
                Company
              </Link>
            </li>
            <li>
              <Link className="text-sm text-white" to={'/about'}>
                About Us
              </Link>
            </li>
            <li>
              <Link className="text-sm text-white" to={'/about'}>
                Faqs
              </Link>
            </li>
            <li>
              <Link className="text-sm text-white" to={'/about'}>
                For Businesses
              </Link>
            </li>
          </ul>
          <ul className="flex flex-col gap-4">
            <li>
              <Link to={'/about'} className="font-helvetica text-base font-medium text-pearl-700">
                Social
              </Link>
            </li>
            <li>
              <Link className="text-sm text-white" to={'/about'}>
                X(Twitter)
              </Link>
            </li>
            <li>
              <Link className="text-sm text-white" to={'/about'}>
                Instagram
              </Link>
            </li>
            <li>
              <Link className="text-sm text-white" to={'/about'}>
                Facebook
              </Link>
            </li>
          </ul>
        </div>
        <ul className="flex flex-col gap-4">
          <li>
            <Link to={'/polices'} className="font-helvetica text-base font-medium text-pearl-700">
              Legal
            </Link>
          </li>
          <li>
            <Link className="text-sm text-white" to={'/policies/terms-of-service'}>
              Terms of Service
            </Link>
          </li>
          <li>
            <Link className="text-sm text-white" to={'/policies/privacy-policy'}>
              Privacy Policy
            </Link>
          </li>
        </ul>

        {/* Our market */}
        <FooterLogo className="absolute bottom-[3.25rem]" />

        {/* mascot image */}

        <MascotYellow className="absolute bottom-0 right-4" />
      </div>
    </footer>
  )
}
