import{t as e}from"./chunk-BawyB3wE.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),e((()=>{document.getElementById(`analyze`).addEventListener(`click`,async()=>{let e=document.getElementById(`output`),[t]=await chrome.tabs.query({active:!0,currentWindow:!0});chrome.tabs.sendMessage(t.id,{action:`SCRAPE_REVIEWS`},t=>{if(!t){e.textContent=`Not an Amazon product page.`;return}e.innerHTML=`
      ⭐ Rating: ${t.rating}<br>
      📝 Reviews: ${t.total}<br><br>

      ⚠ Fake Score: ${t.fakeScore}<br>
      😊 Sentiment Score: ${t.sentiment.sentimentScore}<br><br>

      😡 Complaints: ${t.sentiment.complaints.join(`, `)||`None`}<br>
      💡 Suggestions: ${t.sentiment.suggestions.join(`, `)||`None`}<br><br>

      🔑 Keywords: ${t.keywords.join(`, `)}
    `})})}))();