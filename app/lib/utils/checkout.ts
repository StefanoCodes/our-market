import { Country, State, City } from 'country-state-city'

// different utils to format the data for the uber direct api
// replace the deliver address spaces with /
// and seperate in an array
export const formatDeliverAddress = (address: string) => {
  // format => // [\"20 W 34th St\", \"Floor 2\"]

  return address.replace(/\s/g, '/').split('/')
}

export const getCountryNameFromCode = (code: string, countryCode: string) => {
  const state = State.getStateByCodeAndCountry(code, countryCode)
  return state?.name
}

/**
 * Converts a country code (ISO 3166-1 alpha-2) to its full country name
 * @param countryCode - The 2-letter country code (e.g., "US", "CA", "GB")
 * @returns The full country name or undefined if the code is not found
 */
export const getFullCountryName = (countryCode: string): string | undefined => {
  if (!countryCode) return undefined
  
  // Normalize the country code to uppercase
  const normalizedCode = countryCode.toUpperCase()
  
  // Get the country information from the Country module
  const country = Country.getCountryByCode(normalizedCode)
  
  // Return the country name or undefined if not found
  return country?.name
}
