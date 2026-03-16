document.getElementById("analyze").addEventListener("click", async () => {

  const output = document.getElementById("output");
  output.textContent = "Analyzing...";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url || !tab.url.includes("amazon")) {
    output.textContent = "Not an Amazon product page.";
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  } catch (e) {
    console.log("content.js already injected or injection failed:", e.message);
  }

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
      document.getElementById("analyze").style.display = "none";

      renderReviewCard(res, output);

    }); 

  }, 300); 

}); 


function renderReviewCard(res, output) {
  const rating = res?.rating ?? null;
  const total = res?.total ?? 0;
  const fafkeScore = res?.fakeScore ?? 0;
  const sentiment = res?.sentiment?.sentimentScore ?? null;
  const complaints = res?.sentiment?.complaints || [];
  const suggestions = res?.sentiment?.suggestions || [];
  const keywords = res?.keywords || [];

  const fakeColor = fakeScore <= 15 ? '#27ae60' : fakeScore <= 30 ? '#e67e22' : '#c0392b';
  const sentColor = sentiment === null ? '#888' : sentiment >= 60 ? '#27ae60' : sentiment >= 35 ? '#e67e22' : '#c0392b';

  const starsSvg = (r) => r === null ? '<span style="color:#888">N/A</span>' :
    Array.from({length:5}, (_,i) =>
      `<svg width="14" height="14" viewBox="0 0 14 14" fill="${i < Math.round(r) ? '#F2A623' : '#ddd'}" style="display:inline-block">
        <path d="M7 1l1.5 3.1L12 4.6l-2.5 2.4.6 3.4L7 8.7l-3.1 1.7.6-3.4L2 4.6l3.5-.5z"/>
      </svg>`
    ).join('');

  const tagHtml = (arr, bg, color) => arr.length
    ? arr.map(t => `<span style="font-size:12px;padding:3px 10px;border-radius:20px;background:${bg};color:${color};display:inline-block">${t}</span>`).join('')
    : '<span style="font-size:12px;color:#aaa">None</span>';

 const pos = res?.sentiment?.positive ?? 0;
const neg = res?.sentiment?.negative ?? 0;
const neu = res?.sentiment?.neutral ?? 0;

  const barRow = (label, labelColor, pct, barColor) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:12px">
      <span style="min-width:52px;color:${labelColor}">${label}</span>
      <div style="flex:1;height:4px;background:#e5e5e5;border-radius:2px;overflow:hidden">
        <div style="width:${pct}%;height:100%;border-radius:2px;background:${barColor}"></div>
      </div>
      <span style="min-width:30px;text-align:right;color:#aaa">${pct}%</span>
    </div>`;

  const sectionLabel = (text) =>
    `<div style="font-size:11px;font-weight:500;color:#aaa;text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px">${text}</div>`;

  const divider = `<hr style="border:none;border-top:0.5px solid #e5e5e5;margin:.9rem 0">`;

  output.innerHTML = `
    <div style="background:#fff;border:0.5px solid #e5e5e5;border-radius:12px;padding:1.25rem;max-width:520px;font-family:sans-serif;box-sizing:border-box">

      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem">
        <div>
          <div style="display:flex;gap:3px;margin-bottom:4px">${starsSvg(rating)}</div>
          <div style="font-size:12px;color:#888">${total.toLocaleString()} review${total !== 1 ? 's' : ''}</div>
        </div>
        <div>
          <div style="font-size:28px;font-weight:500;color:#111;text-align:right">${rating !== null ? rating.toFixed(1) : 'N/A'}</div>
          <div style="font-size:12px;color:#888;text-align:right">out of 5</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:1rem">
        <div style="background:#f5f5f5;border-radius:8px;padding:.75rem;text-align:center">
          <div style="font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Fake score</div>
          <div style="font-size:20px;font-weight:500;color:${fakeColor}">${fakeScore}%</div>
        </div>
        <div style="background:#f5f5f5;border-radius:8px;padding:.75rem;text-align:center">
          <div style="font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Sentiment</div>
          <div style="font-size:20px;font-weight:500;color:${sentColor}">${sentiment !== null ? sentiment : 'N/A'}</div>
        </div>
        <div style="background:#f5f5f5;border-radius:8px;padding:.75rem;text-align:center">
          <div style="font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Reviews</div>
          <div style="font-size:20px;font-weight:500;color:#111">${total >= 1000 ? (total/1000).toFixed(1)+'k' : total}</div>
        </div>
      </div>

      ${divider}
      ${sectionLabel('Sentiment breakdown')}
      <div style="margin-bottom:1rem">
        ${barRow('Positive', '#27ae60', pos, '#d4edda')}
        ${barRow('Neutral',  '#888',    neu, '#ddd')}
        ${barRow('Negative', '#c0392b', neg, '#f8d7da')}
      </div>

      ${divider}
      <div style="margin-bottom:.9rem">
        ${sectionLabel('Complaints')}
        <div style="display:flex;flex-wrap:wrap;gap:6px">${tagHtml(complaints, '#fff0f0', '#c0392b')}</div>
      </div>
      <div style="margin-bottom:.9rem">
        ${sectionLabel('Suggestions')}
        <div style="display:flex;flex-wrap:wrap;gap:6px">${tagHtml(suggestions, '#eff6ff', '#1a56aa')}</div>
      </div>

      ${divider}
      <div>
        ${sectionLabel('Keywords')}
        <div style="display:flex;flex-wrap:wrap;gap:6px">${tagHtml(keywords, '#f5f5f5', '#555')}</div>
      </div>

    </div>`;
}
