// Background Service Worker for WhatsApp Web Helper
// Handles API requests to bypass Content Security Policy (CSP) and CORS restrictions

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${request.targetLang}&dt=t&q=${encodeURIComponent(request.text)}`;
    
    console.log(`WA Web Helper Service Worker: Fetching translation to ${request.targetLang}...`);
    
    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && data[0]) {
          const translatedText = data[0].map(x => x[0]).join('');
          sendResponse({ success: true, text: translatedText });
        } else {
          sendResponse({ success: false, error: 'Malformed response structure' });
        }
      })
      .catch(err => {
        console.error('WA Web Helper Service Worker Error:', err);
        sendResponse({ success: false, error: err.message });
      });
      
    return true; // Keep message channel open for asynchronous sendResponse
  } else if (request.action === 'OPEN_INVOICE_TAB') {
    chrome.tabs.create({ url: chrome.runtime.getURL('invoice.html') });
    sendResponse({ success: true });
  }
});
