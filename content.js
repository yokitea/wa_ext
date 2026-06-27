// Cache for exchange rates and settings
let exchangeRates = null;
let settings = {
  enableCurrency: true,
  targetCurrency: 'IDR',
  enableTranslation: true,
  targetLang: 'id'
};

// Fallback rates if API fails
const fallbackRates = {
  USD: 1,
  IDR: 16400,
  EUR: 0.93,
  SGD: 1.35,
  JPY: 160
};

// Fetch exchange rates from free API (non-blocking)
async function fetchRates() {
  try {
    console.log('WA Web Helper: Fetching exchange rates...');
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();
    if (data && data.rates) {
      exchangeRates = data.rates;
      console.log('WA Web Helper: Exchange rates loaded successfully via API');
      processAllMessages();
    }
  } catch (error) {
    console.warn('WA Web Helper: Failed to fetch online rates, using fallback rates', error);
    exchangeRates = fallbackRates;
    processAllMessages();
  }
}

// Load settings from storage
function loadSettings() {
  chrome.storage.local.get({
    enableCurrency: true,
    targetCurrency: 'IDR',
    enableTranslation: true,
    targetLang: 'id'
  }, (items) => {
    settings = items;
    console.log('WA Web Helper: Settings loaded', settings);
    processAllMessages();
    injectOutgoingTranslateButton();
  });
}

// Listen for settings changes from popup
chrome.storage.onChanged.addListener((changes) => {
  for (let key in changes) {
    settings[key] = changes[key].newValue;
  }
  console.log('WA Web Helper: Settings updated', settings);
  processAllMessages();
});

// Format currency display
function formatCurrency(amount, currencyCode) {
  if (currencyCode === 'IDR') {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  } else if (currencyCode === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  } else if (currencyCode === 'SGD') {
    return new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(amount);
  } else if (currencyCode === 'CNY') {
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount);
  } else if (currencyCode === 'JPY') {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(amount);
  } else if (currencyCode === 'EUR') {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  }
  return `${amount.toFixed(2)} ${currencyCode}`;
}

// Convert amount
function convert(amount, fromCurrency, toCurrency) {
  const rates = exchangeRates || fallbackRates;
  const rateFrom = rates[fromCurrency.toUpperCase()];
  const rateTo = rates[toCurrency.toUpperCase()];
  if (!rateFrom || !rateTo) return null;
  return amount * (rateTo / rateFrom);
}

// Parse smart float to handle different formats (e.g. 1.000 vs 1,000 vs 1.5 vs 1,5)
function parseSmartFloat(str) {
  str = str.replace(/\s+/g, '');
  
  if (str.includes(',') && str.includes('.')) {
    if (str.lastIndexOf('.') > str.lastIndexOf(',')) {
      return parseFloat(str.replace(/,/g, ''));
    } else {
      return parseFloat(str.replace(/\./g, '').replace(',', '.'));
    }
  }
  
  if (str.includes(',')) {
    const parts = str.split(',');
    if (parts.length > 2 || parts[1].length === 3) {
      return parseFloat(str.replace(/,/g, ''));
    } else {
      return parseFloat(str.replace(',', '.'));
    }
  }
  
  if (str.includes('.')) {
    const parts = str.split('.');
    if (parts.length > 2 || parts[1].length === 3) {
      return parseFloat(str.replace(/\./g, ''));
    } else {
      return parseFloat(str);
    }
  }
  
  return parseFloat(str);
}

// Translate text by sending message to the background service worker (exempt from page CSP)
async function translateText(text, targetLang) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: 'translate', text, targetLang },
      (response) => {
        if (response && response.success) {
          resolve(response.text);
        } else {
          console.error('WA Web Helper Translation Failed:', response ? response.error : 'No response');
          resolve(null);
        }
      }
    );
  });
}

// Detect currency ISO code from symbol or text string
function detectCurrencyFromText(text, targetCurrency) {
  const clean = text.toLowerCase();
  if (clean.includes('¥')) {
    return targetCurrency === 'CNY' ? 'CNY' : 'JPY';
  }
  if (clean.includes('cny') || clean.includes('rmb') || clean.includes('yuan')) return 'CNY';
  if (clean.includes('$') || clean.includes('usd')) return 'USD';
  if (clean.includes('€') || clean.includes('eur') || clean.includes('euro')) return 'EUR';
  if (clean.includes('sgd') || clean.includes('s$')) return 'SGD';
  if (clean.includes('rp') || clean.includes('rupiah')) return 'IDR';
  if (clean.includes('jpy') || clean.includes('yen')) return 'JPY';
  return 'CNY'; // default fallback for import negotiations
}

// Parse text for currency symbols and return formatted translation
function parseAndConvertCurrency(text, targetCurrency) {
  // Determine if ¥ represents JPY or CNY based on targetCurrency to avoid double-conversion
  const yenCode = targetCurrency === 'CNY' ? 'CNY' : 'JPY';

  const patterns = [
    { regex: /(?:\$|usd)\s*(\d+(?:[.,]\d+)*)/gi, code: 'USD' },
    { regex: /(\d+(?:[.,]\d+)*)\s*(?:usd|dollars?)/gi, code: 'USD' },
    { regex: /(?:€|eur)\s*(\d+(?:[.,]\d+)*)/gi, code: 'EUR' },
    { regex: /(\d+(?:[.,]\d+)*)\s*(?:eur|euros?)/gi, code: 'EUR' },
    { regex: /¥\s*(\d+(?:[.,]\d+)*)/gi, code: yenCode },
    { regex: /(?:jpy|yen)\s*(\d+(?:[.,]\d+)*)/gi, code: 'JPY' },
    { regex: /(\d+(?:[.,]\d+)*)\s*(?:jpy|yen)/gi, code: 'JPY' },
    { regex: /(?:sgd|s\$)\s*(\d+(?:[.,]\d+)*)/gi, code: 'SGD' },
    { regex: /(\d+(?:[.,]\d+)*)\s*(?:sgd)/gi, code: 'SGD' },
    { regex: /(?:rp|rupiah)\s*(\d+(?:[.,]\d+)*)/gi, code: 'IDR' },
    { regex: /(\d+(?:[.,]\d+)*)\s*(?:rp|rupiah)/gi, code: 'IDR' },
    { regex: /(?:cny|rmb)\s*(\d+(?:[.,]\d+)*)/gi, code: 'CNY' },
    { regex: /(\d+(?:[.,]\d+)*)\s*(?:cny|rmb|yuan)/gi, code: 'CNY' }
  ];

  let results = [];
  for (const item of patterns) {
    let match;
    item.regex.lastIndex = 0;
    while ((match = item.regex.exec(text)) !== null) {
      const amount = parseSmartFloat(match[1]);
      if (!isNaN(amount) && item.code !== targetCurrency) {
        const convertedVal = convert(amount, item.code, targetCurrency);
        if (convertedVal) {
          results.push({
            original: match[0],
            converted: formatCurrency(convertedVal, targetCurrency)
          });
        }
      }
    }
  }
  return results;
}

// Parse custom deal formulas (e.g. 10 pcs x ¥5.800.000 diskon 10%)
function parseDealFormula(text) {
  // Regex supporting: [qty] [pcs/unit/etc] [x/×/@] [currency symbol]? [price] [currency symbol]? [diskon/disc]? [discount]%
  const dealPattern = /(\d+)\s*(?:pcs|pc|item|unit|buah|box|ctn|pcs?)\s*[x×@]\s*(?:(¥|\$|usd|eur|sgd|cny|rmb|rp|rupiah|jpy|yen|s\$)\s*)?([\d.,]+)(?:\s*(¥|\$|usd|eur|sgd|cny|rmb|rp|rupiah|jpy|yen|s\$))?(?:\s*(?:diskon|disc|off|potongan|minus|kurang)?\s*(\d+)%)?/i;
  
  const match = text.match(dealPattern);
  if (!match) return null;
  
  const qty = parseInt(match[1]);
  const price = parseSmartFloat(match[3]);
  if (isNaN(price)) return null;
  
  const currencyIndicator = match[2] || match[4] || '';
  const currencyCode = detectCurrencyFromText(currencyIndicator, settings.targetCurrency);
  
  const discount = match[5] ? parseInt(match[5]) : 0;
  
  const subtotal = qty * price;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;
  const pricePerUnit = total / qty;
  
  let convertedTotal = null;
  let convertedPerUnit = null;
  
  if (currencyCode !== settings.targetCurrency) {
    const convTotalVal = convert(total, currencyCode, settings.targetCurrency);
    const convPerUnitVal = convert(pricePerUnit, currencyCode, settings.targetCurrency);
    if (convTotalVal) convertedTotal = formatCurrency(convTotalVal, settings.targetCurrency);
    if (convPerUnitVal) convertedPerUnit = formatCurrency(convPerUnitVal, settings.targetCurrency);
  }
  
  return {
    qty,
    price,
    discount,
    currencyCode,
    subtotal,
    discountAmount,
    total,
    pricePerUnit,
    convertedTotal,
    convertedPerUnit
  };
}

// Helper to find the actual element containing the text inside a message container
function getTextContainer(messageElement) {
  let el = messageElement.querySelector('span.selectable-text');
  if (el) return el;
  
  el = messageElement.querySelector('.copyable-text');
  if (el) {
    const childSpan = el.querySelector('span');
    if (childSpan) return childSpan;
    return el;
  }
  
  el = messageElement.querySelector('span[data-lexical-text="true"]');
  if (el) return el.parentElement;
  
  return null;
}

// Process a single message element (Incoming/Outgoing)
function processMessageElement(messageElement) {
  const textSpan = getTextContainer(messageElement);
  if (!textSpan) return;

  // Clean old currency and deal badges to support re-rendering and prevent duplicates
  const oldBadge = messageElement.querySelector('.wa-helper-converted');
  if (oldBadge) oldBadge.remove();
  
  const oldDealBadge = messageElement.querySelector('.wa-helper-deal-calc');
  if (oldDealBadge) oldDealBadge.remove();

  // Get raw message text
  const originalText = textSpan.textContent.trim();
  if (!originalText) return;

  // Check if message matches the deal calculator formula
  const dealResult = parseDealFormula(originalText);
  
  if (dealResult) {
    // 1. Handle Deal Calculator Rendering
    const badge = document.createElement('div');
    badge.className = 'wa-helper-deal-calc';
    
    const formattedPrice = formatCurrency(dealResult.price, dealResult.currencyCode);
    const formattedSubtotal = formatCurrency(dealResult.subtotal, dealResult.currencyCode);
    const formattedTotal = formatCurrency(dealResult.total, dealResult.currencyCode);
    const formattedPerUnit = formatCurrency(dealResult.pricePerUnit, dealResult.currencyCode);
    
    let badgeHTML = `
      <div class="wa-helper-deal-title">📊 SMART DEAL CALCULATOR</div>
      <div class="wa-helper-deal-row"><span>🛒 Qty × Harga:</span> <span>${dealResult.qty} pcs × ${formattedPrice} = ${formattedSubtotal}</span></div>
    `;
    
    if (dealResult.discount > 0) {
      const formattedDiscount = formatCurrency(dealResult.discountAmount, dealResult.currencyCode);
      badgeHTML += `
        <div class="wa-helper-deal-row discount"><span>🔻 Diskon ${dealResult.discount}%:</span> <span>-${formattedDiscount}</span></div>
      `;
    }
    
    badgeHTML += `
      <div class="wa-helper-deal-row total"><span>💰 Total:</span> <span>${formattedTotal}</span></div>
      <div class="wa-helper-deal-row"><span>💳 Per pcs:</span> <span>${formattedPerUnit}</span></div>
    `;
    
    if (dealResult.convertedTotal) {
      badgeHTML += `
        <div class="wa-helper-deal-row converted" style="border-top: 1px dashed rgba(0,0,0,0.1); margin-top: 6px; padding-top: 6px;">
          <span>🔄 Total (${settings.targetCurrency}):</span> <strong>${dealResult.convertedTotal}</strong>
        </div>
        <div class="wa-helper-deal-row converted">
          <span>🔄 Per pcs (${settings.targetCurrency}):</span> <strong>${dealResult.convertedPerUnit}</strong>
        </div>
      `;
    }
    
    badge.innerHTML = badgeHTML;
    
    const container = textSpan.parentElement;
    if (container) {
      container.appendChild(badge);
    }
  } else if (settings.enableCurrency) {
    // 2. Handle standard Currency Conversion (only if NOT a deal calculation to avoid clutter)
    const conversions = parseAndConvertCurrency(originalText, settings.targetCurrency);
    if (conversions.length > 0) {
      const badgeSpan = document.createElement('span');
      badgeSpan.className = 'wa-helper-converted';
      badgeSpan.innerHTML = ' (' + conversions.map(c => `≈ ${c.converted}`).join(', ') + ')';
      textSpan.appendChild(badgeSpan);
    }
  }

  // 3. Handle Translation Button
  if (settings.enableTranslation) {
    const alreadyHasBtn = messageElement.querySelector('.wa-helper-translate-btn');
    if (!alreadyHasBtn) {
      const btn = document.createElement('button');
      btn.className = 'wa-helper-translate-btn';
      btn.innerHTML = '🌐';
      btn.title = 'Terjemahkan';
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        
        // Toggle translation if clicked again
        const existingTranslation = messageElement.querySelector('.wa-helper-translated');
        if (existingTranslation) {
          existingTranslation.remove();
          return;
        }

        btn.innerHTML = '⏳';
        
        // Clean originalText by stripping badge text if it got appended
        let textToTranslate = originalText;
        const currencyBadge = textSpan.querySelector('.wa-helper-converted');
        if (currencyBadge) {
          textToTranslate = originalText.replace(currencyBadge.textContent, '').trim();
        }

        const translated = await translateText(textToTranslate, settings.targetLang);
        btn.innerHTML = '🌐';
        
        if (translated) {
          const transDiv = document.createElement('div');
          transDiv.className = 'wa-helper-translated';
          transDiv.innerHTML = `<hr class="wa-helper-divider"><strong>Terjemahan:</strong> ${translated}`;
          messageElement.appendChild(transDiv);
        } else {
          alert('Gagal menerjemahkan teks. Cek koneksi internet.');
        }
      });
      
      messageElement.style.position = 'relative';
      messageElement.appendChild(btn);
    }
  } else {
    // Clean translation button and text if disabled
    const btn = messageElement.querySelector('.wa-helper-translate-btn');
    if (btn) btn.remove();
    const trans = messageElement.querySelector('.wa-helper-translated');
    if (trans) trans.remove();
  }
}

// Find and process all message bubbles in the DOM
function processAllMessages() {
  const bubbles = document.querySelectorAll(
    'div[data-testid="msg-container"], div[class*="message-in"], div[class*="message-out"]'
  );
  console.log(`WA Web Helper: Processing ${bubbles.length} messages`);
  bubbles.forEach(processMessageElement);
}

// ==========================================
// OUTGOING MESSAGE TRANSLATION (INPUT FIELD)
// ==========================================

// Convert all currency occurrences inside a given text string to target currency
function convertCurrenciesInText(text, targetCurrency) {
  const conversions = parseAndConvertCurrency(text, targetCurrency);
  let modifiedText = text;
  
  // Sort conversions by original string length descending to avoid partial matching bugs
  conversions.sort((a, b) => b.original.length - a.original.length);
  
  for (const item of conversions) {
    // Keep both: converted value and the original value in parentheses (e.g. ¥57.03 (Rp 150.000))
    const replacement = `${item.converted} (${item.original})`;
    modifiedText = modifiedText.split(item.original).join(replacement);
  }
  
  return modifiedText;
}

// Translate the text inside the input textbox to target language (and convert currencies)
async function translateOutgoingText(textbox) {
  const sel = window.getSelection();
  let selectedText = '';
  let isPartialSelection = false;

  // Check if user has highlighted text inside the input box
  if (sel && sel.toString().trim().length > 0 && textbox.contains(sel.anchorNode)) {
    selectedText = sel.toString().trim();
    isPartialSelection = true;
  }

  const textToTranslate = isPartialSelection ? selectedText : textbox.textContent.trim();
  if (!textToTranslate) return;
  
  const btn = document.getElementById('wa-helper-outgoing-btn');
  if (btn) btn.innerHTML = '⏳';
  
  // 1. Convert currencies in the input text first
  let processedText = textToTranslate;
  if (settings.enableCurrency) {
    processedText = convertCurrenciesInText(textToTranslate, settings.targetCurrency);
  }
  
  // 2. Translate the processed text if enabled
  let finalOutput = processedText;
  if (settings.enableTranslation) {
    console.log(`WA Web Helper: Translating input text to: ${settings.targetLang}`);
    const translated = await translateText(processedText, settings.targetLang);
    if (translated) {
      finalOutput = translated;
    } else {
      console.warn('WA Web Helper: Translation failed, using currency-only converted text');
    }
  }
  
  if (btn) btn.innerHTML = '🌐';
  
  insertTextIntoTextbox(textbox, finalOutput, isPartialSelection);
}

// Programmatically insert text into contenteditable editor (supports React / Lexical states)
function insertTextIntoTextbox(textbox, text, isPartialSelection) {
  textbox.focus();
  
  if (!isPartialSelection) {
    // Select all content inside the textbox for full replacement
    const range = document.createRange();
    range.selectNodeContents(textbox);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  
  // Try to use execCommand first (updates React state directly)
  // If isPartialSelection is true, it replaces only the highlighted text
  const success = document.execCommand('insertText', false, text);
  
  if (!success) {
    console.warn('WA Web Helper: execCommand failed, falling back to DOM injection');
    if (isPartialSelection) {
      // Fallback for partial selection: delete selected text and insert node
      const sel = window.getSelection();
      if (sel.rangeCount) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
      }
    } else {
      // Fallback: update DOM text and fire InputEvent
      textbox.textContent = text;
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertText',
        data: text
      });
      textbox.dispatchEvent(inputEvent);
    }
  }
}

// Inject a translate button directly next to the input textbox
function injectOutgoingTranslateButton() {
  const textbox = document.querySelector('div[contenteditable="true"]');
  if (!textbox) return;
  
  // Avoid duplicate injection
  if (document.getElementById('wa-helper-outgoing-btn')) return;
  
  const btn = document.createElement('button');
  btn.id = 'wa-helper-outgoing-btn';
  btn.innerHTML = '🌐';
  btn.title = 'Terjemahkan teks ketikan ke bahasa target (Ctrl + Alt + T)';
  
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    translateOutgoingText(textbox);
  });
  
  // Append button to the parent wrapper of the input box
  const parent = textbox.parentElement;
  if (parent) {
    // Make sure parent allows side-by-side elements nicely
    parent.appendChild(btn);
    console.log('WA Web Helper: Outgoing translate button injected');
  }
}

// Initialize the extension
function init() {
  console.log('WA Web Helper: Initializing content script...');
  
  loadSettings();
  fetchRates();
  
  // Watch DOM for changes (new messages or new input fields loaded)
  const observer = new MutationObserver((mutations) => {
    injectOutgoingTranslateButton(); // Check and inject outgoing button whenever DOM updates
    
    for (const mutation of mutations) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches('div[data-testid="msg-container"], div[class*="message-in"], div[class*="message-out"]')) {
              processMessageElement(node);
            } else {
              const bubbles = node.querySelectorAll(
                '[data-testid="msg-container"], div[class*="message-in"], div[class*="message-out"]'
              );
              bubbles.forEach(processMessageElement);
            }
          }
        });
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Global listener for Ctrl + Alt + T shortcut
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') {
      const textbox = document.querySelector('div[contenteditable="true"]');
      if (textbox && document.activeElement === textbox) {
        e.preventDefault();
        translateOutgoingText(textbox);
      }
    }
  });

  // Run initial scan once DOM is loaded
  setTimeout(() => {
    processAllMessages();
    injectOutgoingTranslateButton();
  }, 3000);
}

// Run init
init();
