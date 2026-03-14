/**
 * Calculates a reliability score (0–100) for a product's review data.
 * Higher = more trustworthy rating signal.
 *
 * @param {Object} product
 * @returns {number} score between 0 and 100
 */
function ratingReliabilityScore(product) {
  const reviews = product?.reviews;
  if (!reviews) return 0;

  const rating = Number(reviews.averageRating) || 0;
  const totalReviews = Number(reviews.totalReviews) || 0;
  const distribution = reviews.ratingDistribution || {};

  // Guard: if rating is out of expected range, data is untrustworthy
  if (rating < 0 || rating > 5) return 0;

  let score = 0;

  // ── 1. Review Volume (max 40pts) ─────────────────────────────────────────
  if      (totalReviews > 1000) score += 40;
  else if (totalReviews > 300)  score += 30;
  else if (totalReviews > 100)  score += 20;
  else if (totalReviews > 30)   score += 10;
  // Fewer than 30 reviews: no volume confidence

  // ── 2. Rating Quality (max 20pts) ────────────────────────────────────────
  if      (rating >= 4.5) score += 20;
  else if (rating >= 4.0) score += 15;
  else if (rating >= 3.5) score += 10;
  else if (rating >= 3.0) score += 5;
  // Below 3.0 adds nothing — low confidence in product quality

  // ── 3. Distribution Analysis ─────────────────────────────────────────────
  const distributionTotal = Object.values(distribution).reduce((a, b) => a + b, 0);

  if (distributionTotal > 0) {
    const pct = (star) => ((distribution[star] || 0) / distributionTotal) * 100;

    const fiveStarPct = pct(5);
    const fourStarPct = pct(4);
    const oneStarPct  = pct(1);
    const twoStarPct  = pct(2);

    // Reward healthy distribution: mix of 4★ + 5★ without extreme skew
    if (fiveStarPct >= 40 && fourStarPct >= 15) score += 10;

    // Penalize suspiciously perfect profiles
    if (fiveStarPct > 80 && oneStarPct < 2) score -= 15;
    else if (fiveStarPct > 70 && oneStarPct < 5) score -= 10;

    // Penalize high negative sentiment
    if (oneStarPct > 30) score -= 20;
    else if (oneStarPct + twoStarPct > 40) score -= 10;
    else if (oneStarPct > 20) score -= 15;

    // Penalize bimodal distribution (love-it/hate-it split) — often astroturfed
    const bimodal = fiveStarPct + oneStarPct;
    const middlePct = pct(2) + pct(3) + pct(4);
    if (bimodal > 70 && middlePct < 15) score -= 10;
  }

  // ── 4. Verified Purchases Bonus (optional field) ─────────────────────────
  if (reviews.verifiedPurchaseRate != null) {
    const vpr = Number(reviews.verifiedPurchaseRate);
    if      (vpr >= 0.9) score += 15;
    else if (vpr >= 0.7) score += 10;
    else if (vpr >= 0.5) score += 5;
    else if (vpr < 0.3)  score -= 10; // mostly unverified — suspicious
  }

  // ── 5. Recency Bonus (optional field) ────────────────────────────────────
  if (reviews.recentReviewCount != null && reviews.recentReviewCount > 10) {
    score += 5; // still actively reviewed = living signal
  }

  return Math.min(100, Math.max(0, score));
}

module.exports = ratingReliabilityScore;