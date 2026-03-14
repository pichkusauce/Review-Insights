export function scrapeAmazonReviews() {

  const ratingText =
    document.querySelector(".a-icon-alt")?.innerText || "0";

  const totalText =
    document.querySelector("#acrCustomerReviewText")?.innerText || "0";

  const rating = parseFloat(ratingText);

  const totalReviews = parseInt(totalText.replace(/[^0-9]/g, ""));

  // star distribution
  const bars = document.querySelectorAll("#histogramTable tr");

  let distribution = {};

  bars.forEach((row, i) => {

    const percent =
      row.querySelector(".a-text-right.aok-nowrap")?.innerText || "0%";

    distribution[5 - i] = parseInt(percent);

  });

  // review texts
  const reviews = Array.from(
    document.querySelectorAll("[data-hook='review-body']")
  ).map(r => r.innerText);

  return {
    rating,
    totalReviews,
    distribution,
    reviews
  };

}