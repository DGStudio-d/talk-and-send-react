/**
 * Logo asset configuration for consistent usage across the React app
 */

export const LOGO_ASSETS = {
  // Main logo variations
  ASSET_1: '/assets/logos/Asset 1@2x.png',
  ASSET_2: '/assets/logos/Asset 2@2x.png',
  ASSET_3: '/assets/logos/Asset 3@2x.png',
  ASSET_4: '/assets/logos/Asset 4@2x.png',
  ASSET_5: '/assets/logos/Asset 5@2x.png',
  ASSET_6: '/assets/logos/Asset 6@2x.png',
  ASSET_7: '/assets/logos/Asset 7@2x.png',
  ASSET_8: '/assets/logos/Asset 8@2x.png',
  ASSET_9: '/assets/logos/Asset 9@2x.png',
  ASSET_10: '/assets/logos/Asset 10@2x.png',
  ASSET_11: '/assets/logos/Asset 11@2x.png',
  ASSET_12: '/assets/logos/Asset 12@2x.png',
  ASSET_13: '/assets/logos/Asset 13@2x.png',
} as const;

/**
 * Common logo configurations for different use cases
 */
export const LOGO_CONFIG = {
  // Primary logo for headers and main branding
  PRIMARY: LOGO_ASSETS.ASSET_1,
  
  // Secondary logo for smaller spaces
  SECONDARY: LOGO_ASSETS.ASSET_2,
  
  // Icon version for favicons and small displays
  ICON: LOGO_ASSETS.ASSET_3,
  
  // Alternative versions for different contexts
  ALTERNATIVE_1: LOGO_ASSETS.ASSET_4,
  ALTERNATIVE_2: LOGO_ASSETS.ASSET_5,
} as const;

/**
 * Logo size configurations
 */
export const LOGO_SIZES = {
  SMALL: { width: 32, height: 32 },
  MEDIUM: { width: 64, height: 64 },
  LARGE: { width: 128, height: 128 },
  XLARGE: { width: 256, height: 256 },
} as const;

export type LogoAsset = typeof LOGO_ASSETS[keyof typeof LOGO_ASSETS];
export type LogoSize = typeof LOGO_SIZES[keyof typeof LOGO_SIZES];