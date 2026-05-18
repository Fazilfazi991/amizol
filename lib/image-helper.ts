/**
 * Helper to get the image URL string from a product image item.
 */
export function getImageUrl(img: any): string {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img.src) return img.src;
  return '';
}

/**
 * Filter images to remove banner placeholders or promo banners.
 * A banner is identified by a very wide aspect ratio (width / height >= 1.7).
 */
export function filterBannerImages(images: any[]): any[] {
  if (!Array.isArray(images)) return [];
  
  const nonBanners = images.filter((img: any) => {
    if (img && typeof img === 'object' && img.width && img.height) {
      const ratio = img.width / img.height;
      return ratio < 1.7; // Exclude wide banners
    }
    // If it's a string, we can check for common banner filename keywords
    const url = typeof img === 'string' ? img : img?.src;
    if (url && typeof url === 'string') {
      const lowerUrl = url.toLowerCase();
      // Check for known promotional banner keywords or patterns
      if (
        lowerUrl.includes('ibespendingmoreonmysafetty') || 
        lowerUrl.includes('dssd_540x') ||
        lowerUrl.includes('new202031') ||
        lowerUrl.includes('43242_1800x1800')
      ) {
        return false;
      }
    }
    return true;
  });

  // If we filtered out everything, return the original images so we don't end up with nothing
  return nonBanners.length > 0 ? nonBanners : images;
}

/**
 * Get the clean list of image URL strings for a product.
 */
export function getProductImages(product: any): string[] {
  if (!product) return ['/images/placeholder.png'];

  let list: any[] = [];
  if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    list = product.image_urls;
  } else if (Array.isArray(product.images) && product.images.length > 0) {
    list = product.images;
  }

  // Map to string URLs and filter out banners
  const cleanUrls = filterBannerImages(list).map(getImageUrl).filter(Boolean);
  
  return cleanUrls.length > 0 ? cleanUrls : ['/images/placeholder.png'];
}

/**
 * Get the main/first non-banner image URL string for a product.
 */
export function getProductMainImage(product: any): string {
  const images = getProductImages(product);
  return images[0] || '/images/placeholder.png';
}
