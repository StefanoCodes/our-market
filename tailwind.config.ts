import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('tailwindcss-animate')],
  theme: {
    colors: {
      'store-background': '#f2f5f9',
      green: {
        '100': '#eef7f2',
        '200': '#b3dbc7',
        '300': '#8dc8aa',
        '400': '#41a472',
        '500': '#1b9256',
        '600': '#177a48',
        '700': '#126139',
        '800': '#125129',
        '900': '#09311d',
      },
      red: {
        '100': '#ffe9e9',
        '200': '#ffbaba',
        '300': '#ff8a8a',
        '400': '#ff2a2a',
        '500': '#ea1818',
        '600': '#c80808',
        '700': '#a60000',
        '800': '#840000',
        '900': '#620000',
      },
      yellow: {
        '100': '#fef5e7',
        '200': '#fadaaa',
        '300': '#f8c780',
        '400': '#f3a22b',
        '500': '#f18f01',
        '600': '#c97701',
        '700': '#a15f01',
        '800': '#794801',
        '900': '#503000',
      },
      grey: {
        '100': '#f8fafc',
        '200': '#f8fafc',
        '300': '#e2e8f0',
        '400': '#cbd5e1',
        '500': '#94a3b8',
        '600': '#64748b',
        '700': '#475569',
        '800': '#1e293b',
        '900': '#020617',
      },
      pearl: {
        '50': '#514b3a',
        '100': '#68604c',
        '200': '#7f765e',
        '300': '#958c72',
        '400': '#aca286',
        '500': '#c3b89b',
        '600': '#d9ceb1',
        '700': '#f0e5c8',
        '800': '#fff4d9',
        '900': '#fffefb',
      },
      white: '#ffffff',
      brand: {
        green: '#125129',
        yellow: '#fccc1a',
        red: '#ea1818',
        pearl: '#f0e5c8',
        purple: '#862780',
      },
      black: '#000000',
    },
    fontSize: {
      '2xs': ['0.625rem', '0.9375rem'],
      xs: ['0.75rem', '1.05rem'],
      sm: ['0.875rem', '1.1375rem'],
      base: ['1rem', '1.5rem'],
      md: ['1.25rem', '1.5rem'],
      lg: ['1.5rem', '2.25rem'],
      xl: ['2rem', '3rem'],
      '2xl': ['2.5rem', '3.75rem'],
      '3xl': ['3rem', '3.75rem'],
    },
    fontFamily: {
      'dm-sans': ['"DM Sans"', 'sans-serif'],
      'kokoschka-normal': ['"Kokoschka"', 'sans-serif'],
      'kokoschka-extras': ['"Kokoschka Extras"', 'sans-serif'],
      helvetica: ['"Helvetica Neue"', 'sans-serif'],
      inter: ['"Inter Tight"', 'sans-serif'],
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      bold: '700',
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      minHeight: {
        'screen-desktop-dvh':
          'calc(100dvh - var(--store-full-header-height-desktop) - var(--store-footer-height-desktop))',
        'screen-mobile-dvh':
          'calc(100dvh - var(--store-full-header-height-mobile) - var(--store-footer-height-mobile))',
        'mobile-drawer': 'calc(100dvh - var(--store-full-header-height-desktop))',
        'footer-desktop': 'var(--store-footer-height-desktop)',
        'product-card-desktop': 'var(--product-card-height-desktop)',
        'product-card-mobile': 'var(--product-card-height-mobile)',
        'onboarding-container': 'var(--onboarding-container-height)',
        'checkout-form-details-container': 'var(--checkout-form-details-container)',
        'checkout-order-details': 'var(--checkout-order-details-container)',
        'checkout-order-details-content': 'var(--checkout-order-details-content)',
        'checkout-order-details-header': 'var(--checkout-order-details-header)',
        'checkout-order-details-footer': 'var(--checkout-order-details-footer)',
      },
      minWidth: {
        'product-card-desktop': 'var(--product-card-width-desktop)',
        'product-card-mobile': 'var(--product-card-width-mobile)',
        'marketing-announcement-card': 'var(--marketing-announcement-card-width)',
      },
      gap: {
        'product-row': 'var(--product-row-gap)',
        'product-row-mobile': 'var(--product-row-gap-mobile)',
      },
      height: {
        'footer-mobile': 'var(--store-footer-height-mobile)',
        'footer-desktop': 'var(--store-footer-height-desktop)',
        'full-header-desktop': 'var(--store-full-header-height-desktop)',
        'full-header-mobile': 'var(--store-full-header-height-mobile)',
        'header-announcement': 'var(--store-announcement-header-height)',
        'main-header': 'var(--store-main-header-height)',
        'product-card-mobile': 'var(--product-card-height-mobile)',
        'product-card-desktop': 'var(--product-card-height-desktop)',
      },
      width: {
        'product-card-desktop': 'var(--product-card-width-desktop)',
        'product-card-mobile': 'var(--product-card-width-mobile)',
      },
      maxWidth: {
        container: ' var(--container)',
        searchInput: 'var(--search-input-max-width)',
        'product-card-desktop': 'var(--product-card-width-desktop)',
        'product-card-mobile': 'var(--product-card-width-mobile)',
        storeContainer: 'calc(var(--container) + var(--store-sidebar) - var(--container-padding))',

        'seller-image-banner': 'var(--seller-image-banner)',
        'seller-main-content': 'var(--seller-main-content)',
        'onboarding-container': 'var(--onboarding-container-width)',
        'checkout-form-details-width': 'var(--checkout-form-details-container-width)',
        'checkout-order-details-width': 'var(--checkout-order-details-width)',
        'checkout-order-details-content': 'var(--checkout-order-details-content)',
      },
      screens: {
        '2xl': '1400px',
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': {
            opacity: '1',
          },
          '20%,50%': {
            opacity: '0',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },

      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
} satisfies Config

export default config
