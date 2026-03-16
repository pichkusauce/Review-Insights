document.getElementById("analyze").addEventListener("click", async () => {

  const output = document.getElementById("output");
  output.textContent = "Analyzing...";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Guard: only run on Amazon pages
  if (!tab.url || !tab.url.includes("amazon")) {
    output.textContent = "Not an Amazon product page.";
    return;
  }

  // Inject content.js first — fixes "Receiving end does not exist"
  // because content.js may not be loaded yet on a fresh tab
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  } catch (e) {
    // Already injected — safe to ignore this error
    console.log("content.js already injected or injection failed:", e.message);
  }

  // Small delay to let content.js set up its message listener
  setTimeout(() => {

    chrome.tabs.sendMessage(tab.id, { action: "SCRAPE_REVIEWS" }, (res) => {

      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        output.textContent = "Could not connect. Please refresh the Amazon page and try again.";
        return;
      }

      if (!res) {
        output.textContent = "Not an Amazon product page.";
        return;
      }

      output.innerHTML = `
⭐ Rating: ${res?.rating ?? "N/A"}<br>
📝 Reviews: ${res?.total ?? 0}<br><br>

⚠ Fake Score: ${res?.fakeScore ?? 0}<br>
😊 Sentiment Score: ${res?.sentiment?.sentimentScore ?? "N/A"}<br><br>

😡 Complaints: ${(res?.sentiment?.complaints || []).join(", ") || "None"}<br>
💡 Suggestions: ${(res?.sentiment?.suggestions || []).join(", ") || "None"}<br><br>

🔑 Keywords: ${(res?.keywords || []).join(", ") || "None"}
      `;

    });

  }, 300);

});
