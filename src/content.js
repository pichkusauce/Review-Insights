import { analyzeReviews } from "./scoring/masterScorer.js";

function getProductInfo() {
  const ratingText = document.querySelector(".a-icon-alt")?.textContent || "0";
  const totalText = document.querySelector("#acrCustomerReviewText")?.textContent || "0";
  const rating = parseFloat(ratingText);
  const totalReviews = parseInt(totalText.replace(/[^0-9]/g, ""));

  const bars = document.querySelectorAll("#histogramTable tr");
  let distribution = {};
  bars.forEach((row, i) => {
    const percent = row.querySelector(".a-text-right.aok-nowrap")?.textContent || "0%";
    distribution[5 - i] = parseInt(percent);
  });

  return { rating, totalReviews, distribution };
}

function getReviewsUrl() {
  const match = window.location.href.match(/\/dp\/([A-Z0-9]{10})/);
  if (!match) return null;
  const asin = match[1];
  const domain = window.location.hostname;
  return `https://${domain}/product-reviews/${asin}/?sortBy=recent&pageNumber=1`;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SCRAPE_REVIEWS") {

    const startUrl = getReviewsUrl();
    if (!startUrl) {
      sendResponse(null);
      return true;
    }

    const productInfo = getProductInfo();

    chrome.runtime.sendMessage(
      { action: "FETCH_REVIEW_PAGES", startUrl, maxPages: 10 },
      (allReviews) => {
        const product = {
          ...productInfo,
          reviews: allReviews || []
        };

        console.log("Total reviews for analysis:", product.reviews.length);

        const analysis = analyzeReviews(product);
        sendResponse({
          rating: product.rating,
          total: product.totalReviews,
          fakeScore: analysis.fakeScore,
          sentiment: analysis.sentiment,
          keywords: analysis.keywords
        });
      }
    );

    return true;
  }
});
