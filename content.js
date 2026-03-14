import { scrapeAmazonReviews } from "./scrapers/amazonScrape.js";
import { analyzeReviews } from "./scoring/masterScorer.js";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "SCRAPE_REVIEWS") {

    try {

      const product = scrapeAmazonReviews();

      const analysis = analyzeReviews(product);

      sendResponse({
        rating: product.rating,
        total: product.totalReviews,
        fakeScore: analysis.fakeScore,
        sentiment: analysis.sentiment,
        keywords: analysis.keywords
      });

    } catch (err) {
      sendResponse(null);
    }

  }

  return true;

});