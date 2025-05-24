import { Metafield } from '@shopify/hydrogen/storefront-api-types'
interface NutritionFacts {
  'Serving Size': string
  Calories: string
  [key: string]: string // Allow for additional nutrition properties
}

interface NutritionData {
  'Nutrition Facts': NutritionFacts
}

export interface ParsedNutritionItem {
  key: string
  value: string
}

export const formatMetaFieldTitle = (title: string) => {
  const titleArray = title.split('_')
  const capitalizedTitle = titleArray.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  return capitalizedTitle.join(' ')
}

export const parseNutritionData = (input: string): ParsedNutritionItem[] => {
  try {
    // Parse the JSON string to object
    const data = JSON.parse(input)

    // Check if the data has 'Nutrition Facts' property or is directly spread
    const nutritionFacts = (data as NutritionData)['Nutrition Facts'] ?? (data as NutritionFacts)

    // Filter out non-nutrition related fields (like imageAlt)
    const validNutritionEntries = Object.entries(nutritionFacts).filter(
      ([key]) => key !== 'imageAlt',
    )

    // Convert to array of key-value pairs
    return validNutritionEntries.map(([key, value]) => ({
      key,
      value,
    }))
  } catch (error) {
    console.error('Error parsing nutrition data:', error)
    return []
  }
}
export const formatVendorHandle = (vendor: string) => {
  return vendor.replace(/\s+/g, '-').toLowerCase()
}

export const unformatVendorHandle = (handle: string) => {
  return handle
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const formatDescription = (description: string) => {
  return description.split('.')
}

// price per unit (oz)
export const pricePerUnit = (price: number, weight: number, weightUnit: string) => {
  // convert weight to oz if it's not already
  let weightInOz = weight
  if (weightUnit === 'POUNDS') {
    weightInOz = weight * 16
  } else if (weightUnit === 'GRAMS') {
    weightInOz = weight * 0.035274
  } else if (weightUnit === 'KILOGRAMS') {
    weightInOz = weight * 35.274
  }

  const pricePerUnit = Number((price / weightInOz).toFixed(1))

  return pricePerUnit
}

export const calculatePercentageOff = (comparePrice: number, price: number) => {
  // there may be no compare price then return 0
  if (!comparePrice || comparePrice === 0) return 0
  const percentageOff = ((comparePrice - price) / comparePrice) * 100

  return Math.floor(percentageOff)
}
