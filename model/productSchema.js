
const productSchema = {

  product: {
    id: null,
    url: null,
    domain: null,
    platform: null,   
    scrapedAt: null,
    locale: null,
    currency: null,
  },

  identity: {
    title: null,
    brand: null,
    model: null,
    asin: null,
   description: null,
    features: [],
    images: {
      primary: null,
      gallery: [],
      count: null,
    },
  },

  pricing: {
    currentPrice: null,
    originalPrice: null,
    discountPercent: null,
    discountAmount: null,
    
  },

  reviews: {
    averageRating: null,
    totalRatings: null,
    totalReviews: null,
    ratingDistribution: {
      5: null,
      4: null,
      3: null,
      2: null,
      1: null,
    },
    verifiedPurchasePercent: null,
   
  },

  availability: {
    inStock: null,
   fulfilledBy: null,
    soldBy: null,
    sellerRating: null,
    deliveryOptions: [],      // populated by deliveryExtractor.js
    deliveryDate: null,
    returnable: null,
    returnWindow: null,
    warranty: {
      duration: null,
      type: null,             // "manufacturer" | "seller" | "extended"
      extendedAvailable: null,
    },
  },

  

  scoringInputs: {
    vsAllTimeLow: null,             // populated by pricingAnalyzer.js
    vsAvg90Day: null,               // populated by pricingAnalyzer.js
    platformCompetitiveness: null,  // populated by platformComparator.js
    priceDropRecent: null,          // populated by pricingAnalyzer.js
    seasonalDiscount: null,         // populated by seasonalDetector.js
    stockUrgency: null,             // populated by availabilityAnalyzer.js
    couponAvailable: null,          // populated by offersExtractor.js
    bankOfferAvailable: null,       // populated by offersExtractor.js
    emiAvailable: null,             // populated by offersExtractor.js
    fulfilledByPlatform: null,      // populated by sellerAnalyzer.js
    returnPolicyExists: null,       // populated by sellerAnalyzer.js
    warrantyExists: null,           // populated by sellerAnalyzer.js
  },

  extensionMeta: {
    extensionId: null,
    version: null,
    userId: null,
    sessionId: null,
    extractionMethod: null,   // "dom" | "api" | "hybrid"
    confidence: null,
  },
};
module.exports = productSchema;

