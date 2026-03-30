chrome.runtime.onInstalled.addListener(() => {
  console.log("Review Insights installed");
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "FETCH_REVIEW_PAGES") {

    (async () => {
      let allReviews = [];
      let nextUrl = request.startUrl;
      const maxPages = request.maxPages || 10;

      for (let page = 0; page < maxPages; page++) {
        if (!nextUrl) break;

        let tab = null;

        try {
          tab = await chrome.tabs.create({ url: nextUrl, active: false });

          // wait for tab to fully load
          await new Promise((resolve) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
              if (tabId === tab.id && info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);
                resolve();
              }
            });
          });

          await delay(1500); // let page settle

          // scrape reviews + next URL from the tab's real DOM
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const reviews = Array.from(
                document.querySelectorAll("[data-hook='review-body']")
              ).map(r => r.textContent.trim());

              const nextBtn = document.querySelector("li.a-last a, .a-pagination .a-last a");
              const nextUrl = nextBtn?.href?.startsWith("http") ? nextBtn.href : null;

              return { reviews, nextUrl };
            }
          });

          const { reviews, nextUrl: next } = results[0].result;
          console.log(`Page ${page + 1}: ${reviews.length} reviews, next: ${next}`);

          allReviews = allReviews.concat(reviews);
          nextUrl = next;

        } catch (err) {
          console.warn(`Page ${page + 1} failed:`, err.message);
          break;
        } finally {
          if (tab) chrome.tabs.remove(tab.id);
        }
      }

      console.log(`Total reviews: ${allReviews.length}`);
      sendResponse(allReviews);
    })();

    return true;
  }
});
