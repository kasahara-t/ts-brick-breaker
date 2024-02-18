export const getAssetUrl = (path: string): string => new URL(`../../assets/${path}`, import.meta.url).href;
