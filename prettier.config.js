/** @type {import('prettier').Config} */
export default {
  arrowParens: 'always',
  singleQuote: true,
  bracketSpacing: true,
  trailingComma: 'all',
  printWidth: 100,
  semi: false,
  tailwindConfig: './tailwind.config.ts',
  plugins: ['prettier-plugin-tailwindcss'],
};
