/**
 * Smart image positioning utilities for product images
 */

export interface ProductImageAnalysis {
  optimalPosition: string;
  confidence: number;
  detectedFeatures: string[];
}

/**
 * Analyzes product type and suggests optimal object positioning
 */
export function getOptimalObjectPosition(
  productTitle: string,
  imageUrl: string,
  productType?: string
): string {
  const title = productTitle.toLowerCase();
  const type = productType?.toLowerCase() || '';
  
  // Bag and purse products typically look better showing the bottom/handle
  if (
    title.includes('bag') || 
    title.includes('purse') || 
    title.includes('tote') || 
    title.includes('handbag') ||
    title.includes('clutch') ||
    title.includes('backpack') ||
    type.includes('bag')
  ) {
    return 'center bottom';
  }
  
  // Jewelry typically looks better centered or slightly top
  if (
    title.includes('necklace') || 
    title.includes('earring') || 
    title.includes('bracelet') ||
    title.includes('ring') ||
    title.includes('jewelry') ||
    type.includes('jewelry')
  ) {
    return 'center top';
  }
  
  // Home decor items often look better showing the base/bottom
  if (
    title.includes('vase') || 
    title.includes('bowl') || 
    title.includes('basket') ||
    title.includes('decor') ||
    title.includes('lamp') ||
    type.includes('home') ||
    type.includes('decor')
  ) {
    return 'center bottom';
  }
  
  // Textiles and clothing typically look better centered
  if (
    title.includes('scarf') || 
    title.includes('shawl') || 
    title.includes('textile') ||
    title.includes('fabric') ||
    title.includes('cloth') ||
    type.includes('apparel') ||
    type.includes('textile')
  ) {
    return 'center center';
  }
  
  // Wall art and framed items look better centered
  if (
    title.includes('art') || 
    title.includes('painting') || 
    title.includes('frame') ||
    title.includes('print') ||
    type.includes('art')
  ) {
    return 'center center';
  }
  
  // Default to center bottom for handcrafted items (often look better showing base)
  return 'center bottom';
}

/**
 * Enhanced analysis with confidence scoring
 */
export function analyzeProductImage(
  productTitle: string,
  imageUrl: string,
  productType?: string,
  tags: string[] = []
): ProductImageAnalysis {
  const title = productTitle.toLowerCase();
  const type = productType?.toLowerCase() || '';
  const allTags = tags.map(tag => tag.toLowerCase());
  
  let optimalPosition = 'center center';
  let confidence = 0.5;
  const detectedFeatures: string[] = [];
  
  // High confidence patterns
  const patterns = [
    {
      keywords: ['bag', 'tote', 'purse', 'handbag', 'clutch', 'backpack'],
      position: 'center bottom',
      confidence: 0.9,
      feature: 'Bag/Purse product'
    },
    {
      keywords: ['necklace', 'earring', 'bracelet', 'ring', 'jewelry'],
      position: 'center top',
      confidence: 0.85,
      feature: 'Jewelry item'
    },
    {
      keywords: ['vase', 'bowl', 'basket', 'pot', 'lamp'],
      position: 'center bottom',
      confidence: 0.8,
      feature: 'Base-heavy object'
    },
    {
      keywords: ['scarf', 'shawl', 'textile', 'fabric'],
      position: 'center center',
      confidence: 0.75,
      feature: 'Textile product'
    }
  ];
  
  // Check title and type for patterns
  for (const pattern of patterns) {
    const found = pattern.keywords.some(keyword => 
      title.includes(keyword) || 
      type.includes(keyword) ||
      allTags.some(tag => tag.includes(keyword))
    );
    
    if (found && pattern.confidence > confidence) {
      optimalPosition = pattern.position;
      confidence = pattern.confidence;
      detectedFeatures.push(pattern.feature);
    }
  }
  
  // Shopify image URL analysis for additional context
  if (imageUrl.includes('shopify')) {
    // If it's a Shopify image, we can assume it's a product shot
    confidence = Math.min(confidence + 0.1, 0.95);
    detectedFeatures.push('Shopify product image');
  }
  
  return {
    optimalPosition,
    confidence,
    detectedFeatures
  };
}

/**
 * Get smart object position for LazyImage component
 */
export function getSmartObjectPosition(
  productTitle: string,
  imageUrl: string,
  productType?: string,
  tags: string[] = []
): string {
  const analysis = analyzeProductImage(productTitle, imageUrl, productType, tags);
  return analysis.optimalPosition;
}
