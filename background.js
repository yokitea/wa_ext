// Background Service Worker for WhatsApp Web Helper
// Handles API requests to bypass Content Security Policy (CSP) and CORS restrictions

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    (async () => {
      try {
        const sourceLang = request.targetLang === 'id' ? 'en' : 'id';
        let translatedText = null;

        // 1. Attempt Chrome Built-in API (On-Device)
        const isBuiltInAvailable = !!(
          (self.translation && self.translation.createTranslator) || 
          (self.ai && self.ai.translator && self.ai.translator.create) ||
          (self.translator && self.translator.create)
        );

        if (isBuiltInAvailable) {
          try {
            let translator;
            // Handle different API versions in Chrome origin trials
            if (self.translation && self.translation.createTranslator) {
              translator = await self.translation.createTranslator({ sourceLanguage: sourceLang, targetLanguage: request.targetLang });
            } else if (self.ai && self.ai.translator && self.ai.translator.create) {
              translator = await self.ai.translator.create({ sourceLanguage: sourceLang, targetLanguage: request.targetLang });
            } else if (self.translator && self.translator.create) {
              translator = await self.translator.create({ sourceLanguage: sourceLang, targetLanguage: request.targetLang });
            }
            
            // Wait for model download if needed (using .ready promise)
            if (translator && translator.ready) {
              await translator.ready;
            }
            
            translatedText = await translator.translate(request.text);
            console.log('DealCalc: Translation completed via Chrome Built-in AI API.');
          } catch (aiErr) {
            console.warn('DealCalc: Chrome Built-in AI Translation failed or model not ready. Falling back to network...', aiErr);
          }
        }

        // 2. Fallback to Network API (Google Translate API)
        if (!translatedText) {
          console.log(`DealCalc: Fetching translation to ${request.targetLang} via network fallback...`);
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${request.targetLang}&dt=t&q=${encodeURIComponent(request.text)}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          if (data && data[0]) {
            translatedText = data[0].map(x => x[0]).join('');
          } else {
            throw new Error('Malformed response structure from network translation');
          }
        }

        sendResponse({ success: true, text: translatedText });
      } catch (err) {
        console.error('DealCalc Service Worker Error:', err);
        sendResponse({ success: false, error: err.message });
      }
    })();
      
    return true; // Keep message channel open for asynchronous sendResponse
  } else if (request.action === 'OPEN_INVOICE_TAB') {
    chrome.tabs.create({ url: chrome.runtime.getURL('invoice.html') });
    sendResponse({ success: true });
  }
});
