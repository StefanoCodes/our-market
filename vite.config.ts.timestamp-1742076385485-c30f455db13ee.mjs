// vite.config.ts
import { defineConfig } from "file:///C:/Users/vidma/our-market-usa/node_modules/vite/dist/node/index.js";
import { hydrogen } from "file:///C:/Users/vidma/our-market-usa/node_modules/@shopify/hydrogen/dist/vite/plugin.js";
import { oxygen } from "file:///C:/Users/vidma/our-market-usa/node_modules/@shopify/mini-oxygen/dist/vite/plugin.js";
import { vitePlugin as remix } from "file:///C:/Users/vidma/our-market-usa/node_modules/@remix-run/dev/dist/index.js";
import tsconfigPaths from "file:///C:/Users/vidma/our-market-usa/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
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
        v3_throwAbortReason: true
      }
    }),
    tsconfigPaths()
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0
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
      include: ["react-dropzone", "react-phone-number-input", "uber-direct", "country-state-city"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx2aWRtYVxcXFxvdXItbWFya2V0LXVzYVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcdmlkbWFcXFxcb3VyLW1hcmtldC11c2FcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3ZpZG1hL291ci1tYXJrZXQtdXNhL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHsgaHlkcm9nZW4gfSBmcm9tICdAc2hvcGlmeS9oeWRyb2dlbi92aXRlJ1xyXG5pbXBvcnQgeyBveHlnZW4gfSBmcm9tICdAc2hvcGlmeS9taW5pLW94eWdlbi92aXRlJ1xyXG5pbXBvcnQgeyB2aXRlUGx1Z2luIGFzIHJlbWl4IH0gZnJvbSAnQHJlbWl4LXJ1bi9kZXYnXHJcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIGh5ZHJvZ2VuKCksXHJcbiAgICBveHlnZW4oKSxcclxuICAgIHJlbWl4KHtcclxuICAgICAgcHJlc2V0czogW2h5ZHJvZ2VuLnByZXNldCgpXSxcclxuICAgICAgZnV0dXJlOiB7XHJcbiAgICAgICAgLy8gdjNfc2luZ2xlRmV0Y2g6IHRydWUsXHJcbiAgICAgICAgdjNfbGF6eVJvdXRlRGlzY292ZXJ5OiB0cnVlLFxyXG4gICAgICAgIHYzX2ZldGNoZXJQZXJzaXN0OiB0cnVlLFxyXG4gICAgICAgIHYzX3JlbGF0aXZlU3BsYXRQYXRoOiB0cnVlLFxyXG4gICAgICAgIHYzX3Rocm93QWJvcnRSZWFzb246IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICAgIHRzY29uZmlnUGF0aHMoKSxcclxuICBdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICAvLyBBbGxvdyBhIHN0cmljdCBDb250ZW50LVNlY3VyaXR5LVBvbGljeVxyXG4gICAgLy8gd2l0aHRvdXQgaW5saW5pbmcgYXNzZXRzIGFzIGJhc2U2NDpcclxuICAgIGFzc2V0c0lubGluZUxpbWl0OiAwLFxyXG4gIH0sXHJcbiAgc3NyOiB7XHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgLyoqXHJcbiAgICAgICAqIEluY2x1ZGUgZGVwZW5kZW5jaWVzIGhlcmUgaWYgdGhleSB0aHJvdyBDSlM8PkVTTSBlcnJvcnMuXHJcbiAgICAgICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBlcnJvcjpcclxuICAgICAgICpcclxuICAgICAgICogPiBSZWZlcmVuY2VFcnJvcjogbW9kdWxlIGlzIG5vdCBkZWZpbmVkXHJcbiAgICAgICAqID4gICBhdCAvVXNlcnMvLi4uL25vZGVfbW9kdWxlcy9leGFtcGxlLWRlcC9pbmRleC5qczoxOjFcclxuICAgICAgICpcclxuICAgICAgICogSW5jbHVkZSAnZXhhbXBsZS1kZXAnIGluIHRoZSBhcnJheSBiZWxvdy5cclxuICAgICAgICogQHNlZSBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL2RlcC1vcHRpbWl6YXRpb24tb3B0aW9uc1xyXG4gICAgICAgKi9cclxuICAgICAgaW5jbHVkZTogWydyZWFjdC1kcm9wem9uZScsICdyZWFjdC1waG9uZS1udW1iZXItaW5wdXQnLCAndWJlci1kaXJlY3QnLCAnY291bnRyeS1zdGF0ZS1jaXR5J10sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pXHJcblxyXG4vLyBkZWNsYXJlIG1vZHVsZSAnQHJlbWl4LXJ1bi9ub2RlJyB7XHJcbi8vICAgLy8gb3IgY2xvdWRmbGFyZSwgZGVubywgZXRjLlxyXG4vLyAgIGludGVyZmFjZSBGdXR1cmUge1xyXG4vLyAgICAgdjNfc2luZ2xlRmV0Y2g6IHRydWU7XHJcbi8vICAgfVxyXG4vLyB9XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVIsU0FBUyxvQkFBb0I7QUFDOVMsU0FBUyxnQkFBZ0I7QUFDekIsU0FBUyxjQUFjO0FBQ3ZCLFNBQVMsY0FBYyxhQUFhO0FBQ3BDLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLFNBQVM7QUFBQSxJQUNULE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLFNBQVMsQ0FBQyxTQUFTLE9BQU8sQ0FBQztBQUFBLE1BQzNCLFFBQVE7QUFBQTtBQUFBLFFBRU4sdUJBQXVCO0FBQUEsUUFDdkIsbUJBQW1CO0FBQUEsUUFDbkIsc0JBQXNCO0FBQUEsUUFDdEIscUJBQXFCO0FBQUEsTUFDdkI7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsT0FBTztBQUFBO0FBQUE7QUFBQSxJQUdMLG1CQUFtQjtBQUFBLEVBQ3JCO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxjQUFjO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQVdaLFNBQVMsQ0FBQyxrQkFBa0IsNEJBQTRCLGVBQWUsb0JBQW9CO0FBQUEsSUFDN0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
