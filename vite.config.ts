import { defineConfig } from 'vite'
import { hydrogen } from '@shopify/hydrogen/vite'
import { oxygen } from '@shopify/mini-oxygen/vite'
import { vitePlugin as remix } from '@remix-run/dev'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        // v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: ['react-dropzone', 'react-phone-number-input', 'uber-direct', 'country-state-city'],
    },
  },
})

// declare module '@remix-run/node' {
//   // or cloudflare, deno, etc.
//   interface Future {
//     v3_singleFetch: true;
//   }
// }
