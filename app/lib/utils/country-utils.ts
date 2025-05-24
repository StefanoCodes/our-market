import { Country } from 'country-state-city'
import type { CountryRegion } from '~/lib/constants/helper'

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

/**
 * Gets a list of all countries with their codes and names
 * @returns An array of country objects with code and name
 */
export const getAllCountries = () => {
  return Country.getAllCountries().map(country => ({
    code: country.isoCode,
    name: country.name
  }))
}

/**
 * Finds a country by its name (partial match)
 * @param name - The country name to search for
 * @returns The country code if found, undefined otherwise
 */
export const getCountryCodeByName = (name: string): string | undefined => {
  if (!name) return undefined
  
  const normalizedName = name.toLowerCase()
  const countries = Country.getAllCountries()
  
  const country = countries.find(country => 
    country.name.toLowerCase().includes(normalizedName)
  )
  
  return country?.isoCode
}

/**
 * Converts a country code to a country object from the CountryRegion type
 * @param countryCode - The 2-letter country code
 * @returns A CountryRegion object or undefined if not found
 */
export const getCountryRegionFromCode = (countryCode: string): CountryRegion | undefined => {
  if (!countryCode) return undefined
  
  const normalizedCode = countryCode.toUpperCase()
  const country = Country.getCountryByCode(normalizedCode)
  
  if (!country) return undefined
  
  return {
    countryName: country.name,
    countryShortCode: country.isoCode,
    regions: []  // You may want to populate this with actual regions if needed
  }
}
