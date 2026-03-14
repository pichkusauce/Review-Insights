document.getElementById("analyze").addEventListener("click", async () => {

  const output = document.getElementById("output");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { action: "SCRAPE_REVIEWS" }, (res) => {

    if (!res) {
      output.textContent = "Not an Amazon product page.";
      return;
    }

    output.innerHTML = `
      ⭐ Rating: ${res.rating}<br>
      📝 Reviews: ${res.total}<br><br>

      ⚠ Fake Score: ${res.fakeScore}<br>
      😊 Sentiment Score: ${res.sentiment.sentimentScore}<br><br>

      😡 Complaints: ${res.sentiment.complaints.join(", ") || "None"}<br>
      💡 Suggestions: ${res.sentiment.suggestions.join(", ") || "None"}<br><br>

      🔑 Keywords: ${res.keywords.join(", ")}
    `;

  });

});