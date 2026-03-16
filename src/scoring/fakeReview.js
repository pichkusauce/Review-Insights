/**
 * Detects likelihood of fake reviews.
 * Returns a risk score (0–100).
 * Higher score = higher chance of fake reviews.
 *
 * @param {Object} product
 * @returns {number}
 */

function fakeReviewDetector(product) {

  const reviews = product.reviews;
  if (!reviews) return 0;

  const totalReviews = reviews.totalReviews || 0;
  const rating = reviews.averageRating || 0;
  const verifiedPercent = reviews.verifiedPurchasePercent || 0;
  const distribution = reviews.ratingDistribution || {};

  const fiveStar = distribution[5] || 0;
  const fourStar = distribution[4] || 0;
  const oneStar = distribution[1] || 0;

  let risk = 0;

  // 1️⃣ suspiciously high rating with low reviews
  if (rating >= 4.8 && totalReviews < 50) {
    risk += 25;
  }

  // 2️⃣ too many 5 star reviews
  if (fiveStar > 80) {
    risk += 30;
  } else if (fiveStar > 70) {
    risk += 20;
  }

  // 3️⃣ almost no negative reviews
  if (oneStar < 2 && totalReviews > 200) {
    risk += 15;
  }

  // 4️⃣ verified purchase check
  if (verifiedPercent < 50) {
    risk += 20;
  } else if (verifiedPercent < 70) {
    risk += 10;
  }

  // 5️⃣ unnatural rating pattern
  if (fiveStar > 75 && fourStar < 10) {
    risk += 15;
  }

  // normalize
  if (risk > 100) risk = 100;
  if (risk < 0) risk = 0;

  return risk;
}

module.exports = fakeReviewDetector;