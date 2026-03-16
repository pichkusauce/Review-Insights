import { sentimentScore } from "./sentimentScore.js";
import { extractKeywords } from "./keyWords.js";
import fakeReviewDetector from "./fakeReview.js";

export function analyzeReviews(product) {

  const fakeScore = fakeReviewDetector(product);

  const sentiment = sentimentScore(product.reviews);

  const keywords = extractKeywords(product.reviews);

  return {
    fakeScore,
    sentiment,
    keywords
  };

}