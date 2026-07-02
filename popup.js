// Predefined list of languages for add dropdown mapping
const PREDEFINED_LANGUAGES = {
  su: 'Sunda',
  ms: 'Melayu',
  ja: 'Jepang',
  ko: 'Korea',
  zh: 'Mandarin',
  ar: 'Arab',
  es: 'Spanyol',
  fr: 'Prancis',
  de: 'Jerman',
  ru: 'Rusia',
  th: 'Thailand',
  vi: 'Vietnam',
  hi: 'Hindi',
  pt: 'Portugis',
  it: 'Italia',
  nl: 'Belanda'
};

// UI Dictionary
const langPack = {
  en: {
    "header_title": "DealCalc Panel",
    "manage_list": "Manage List",
    "currency_title": "Currency Converter",
    "currency_target": "Target Currency",
    "currency_input_default": "Default Input (No Symbol)",
    "calc_title": "Business Calculator (Deal Calc)",
    "calc_view_default": "Default View",
    "calc_view_compact": "Compact",
    "calc_view_expanded": "Expanded",
    "tax_title": "Tax Calculation (VAT/WHT)",
    "tax_type": "Tax Type",
    "tax_exclude": "Exclude (Added on top)",
    "tax_include": "Include (Tax inclusive)",
    "tax_ppn": "VAT / PPN (%)",
    "tax_pph": "WHT / PPh (%) *Deductions",
    "btn_expand_all": "Expand All",
    "btn_collapse_all": "Collapse All",
    "translate_title": "Message Translation",
    "translate_target": "Target Language",
    "result_qty_price": "Qty × Price",
    "result_discount": "Discount",
    "result_total_discount": "Total Discount",
    "result_total": "Total",
    "result_per_pcs": "Per pcs",
    "btn_copy": "Copy",
    "btn_pdf": "PDF",
    "currency_disclaimer": "* Rates are for reference based on ExchangeRate-API, not fixed values."
  },
  id: {
    "header_title": "DealCalc Panel",
    "manage_list": "Kelola Daftar",
    "currency_title": "Konversi Mata Uang",
    "currency_target": "Target Mata Uang",
    "currency_input_default": "Input Default (Tanpa Simbol)",
    "calc_title": "Kalkulator Bisnis (Deal Calc)",
    "calc_view_default": "Tampilan Default",
    "calc_view_compact": "Ciut (Ringkas)",
    "calc_view_expanded": "Mekar",
    "tax_title": "Kalkulasi Pajak (PPN/PPH)",
    "tax_type": "Tipe Pajak",
    "tax_exclude": "Exclude (Pajak di luar)",
    "tax_include": "Include (Pajak di dalam)",
    "tax_ppn": "PPN (%)",
    "tax_pph": "PPH (%) *Mengurangi bayaran",
    "btn_expand_all": "Mekar Semua",
    "btn_collapse_all": "Ciut Semua",
    "translate_title": "Terjemahan Pesan",
    "translate_target": "Target Bahasa",
    "result_qty_price": "Qty × Harga",
    "result_discount": "Diskon",
    "result_total_discount": "Total Diskon",
    "result_total": "Total",
    "result_per_pcs": "Per pcs",
    "btn_copy": "Salin",
    "btn_pdf": "PDF",
    "currency_disclaimer": "* Kurs referensi dari ExchangeRate-API, bukan nilai pasti."
  }
};

function applyLanguage(lang) {
  const currentDict = langPack[lang];
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (currentDict[key]) {
      // Special handling for elements containing other nodes if any, but since we are replacing text nodes:
      element.textContent = currentDict[key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const enableCurrencyCheckbox = document.getElementById('enable-currency');
  const targetCurrencySelect = document.getElementById('target-currency');
  const defaultInputCurrencySelect = document.getElementById('default-input-currency');
  const enableDealCalcCheckbox = document.getElementById('enable-deal-calc');
  const defaultCardStateSelect = document.getElementById('default-card-state');
  const enableTranslationCheckbox = document.getElementById('enable-translation');
  const targetLangSelect = document.getElementById('target-lang');
  
  // Tax Elements
  const enableTaxCheckbox = document.getElementById('enable-tax');
  const taxOptionsDiv = document.getElementById('tax-options');
  const taxTypeSelect = document.getElementById('tax-type');
  const taxMethodRow = document.getElementById('tax-method-row');
  const taxMethodSelect = document.getElementById('tax-method');
  const taxPpnInput = document.getElementById('tax-ppn');
  const taxPphInput = document.getElementById('tax-pph');
  
  const btnExpandAll = document.getElementById('btn-expand-all');
  const btnCollapseAll = document.getElementById('btn-collapse-all');
  
  const toggleManageBtn = document.getElementById('toggle-manage');
  const managePanel = document.getElementById('manage-panel');
  
  const appLangSelect = document.getElementById('app-lang');
  
  const currencyBadges = document.getElementById('currency-badges');
  const newCurrencyInput = document.getElementById('new-currency-input');
  const btnAddCurrency = document.getElementById('btn-add-currency');
  
  const langBadges = document.getElementById('lang-badges');
  const newLangSelect = document.getElementById('new-lang-select');
  const btnAddLang = document.getElementById('btn-add-lang');

  // State
  let state = {
    appLang: 'en',
    enableCurrency: true,
    enableDealCalc: true,
    defaultCardState: 'collapsed',
    targetCurrency: 'IDR',
    defaultInputCurrency: 'IDR',
    enableTranslation: true,
    targetLang: 'id',
    enableTax: false,
    taxType: 'exclude',
    taxMethod: 'lapangan',
    taxPpn: 11,
    taxPph: 2,
    customCurrencies: ['IDR', 'USD', 'SGD'],
    customLanguages: [
      { code: 'id', name: 'Indonesia' },
      { code: 'en', name: 'Inggris' },
      { code: 'jw', name: 'Jawa' }
    ]
  };

  // Toggle manage section
  toggleManageBtn.addEventListener('click', () => {
    managePanel.classList.toggle('active');
    if (managePanel.classList.contains('active')) {
      toggleManageBtn.textContent = (state.appLang === 'en' ? 'Close Settings ❌' : 'Tutup Setelan ❌');
    } else {
      toggleManageBtn.textContent = langPack[state.appLang]['manage_list'] + ' ⚙️';
    }
  });

  // Load state and render
  chrome.storage.local.get({
    appLang: 'en',
    enableCurrency: true,
    enableDealCalc: true,
    defaultCardState: 'collapsed',
    targetCurrency: 'IDR',
    defaultInputCurrency: 'IDR',
    enableTranslation: true,
    targetLang: 'id',
    enableTax: false,
    taxType: 'exclude',
    taxMethod: 'lapangan',
    taxPpn: 11,
    taxPph: 2,
    customCurrencies: ['IDR', 'USD', 'SGD'],
    customLanguages: [
      { code: 'id', name: 'Indonesia' },
      { code: 'en', name: 'Inggris' },
      { code: 'jw', name: 'Jawa' }
    ]
  }, (items) => {
    state = items;
    
    // Apply UI Language
    appLangSelect.value = state.appLang;
    applyLanguage(state.appLang);
    
    // Set active values
    enableCurrencyCheckbox.checked = state.enableCurrency;
    enableDealCalcCheckbox.checked = state.enableDealCalc;
    defaultCardStateSelect.value = state.defaultCardState || 'collapsed';
    enableTranslationCheckbox.checked = state.enableTranslation;
    
    // Set Tax Values
    enableTaxCheckbox.checked = state.enableTax;
    taxTypeSelect.value = state.taxType || 'exclude';
    taxMethodSelect.value = state.taxMethod || 'lapangan';
    taxPpnInput.value = state.taxPpn;
    taxPphInput.value = state.taxPph;
    
    updateTaxUI();
    renderAll();
  });

  // Update Tax UI Visibility
  function updateTaxUI() {
    taxOptionsDiv.style.display = enableTaxCheckbox.checked ? 'block' : 'none';
    taxMethodRow.style.display = taxTypeSelect.value === 'include' ? 'flex' : 'none';
  }

  // Render function
  function renderAll() {
    renderCurrencySelect();
    renderLangSelect();
    renderCurrencyBadges();
    renderLangBadges();
  }

  // Render Target Currency Select Options
  function renderCurrencySelect() {
    targetCurrencySelect.innerHTML = '';
    defaultInputCurrencySelect.innerHTML = '';
    
    state.customCurrencies.forEach(curr => {
      const opt = document.createElement('option');
      opt.value = curr;
      opt.textContent = `${curr}`;
      if (curr === state.targetCurrency) opt.selected = true;
      targetCurrencySelect.appendChild(opt);
      
      const opt2 = document.createElement('option');
      opt2.value = curr;
      opt2.textContent = `${curr}`;
      if (curr === state.defaultInputCurrency) opt2.selected = true;
      defaultInputCurrencySelect.appendChild(opt2);
    });
  }

  // Render Target Language Select Options
  function renderLangSelect() {
    targetLangSelect.innerHTML = '';
    state.customLanguages.forEach(lang => {
      const opt = document.createElement('option');
      opt.value = lang.code;
      opt.textContent = lang.name;
      if (lang.code === state.targetLang) opt.selected = true;
      targetLangSelect.appendChild(opt);
    });
  }

  // Render currency badges in management panel
  function renderCurrencyBadges() {
    currencyBadges.innerHTML = '';
    state.customCurrencies.forEach(curr => {
      const badge = document.createElement('span');
      badge.className = 'item-badge';
      badge.innerHTML = `${curr}`;
      
      // Add delete button (don't allow deleting everything, keep at least 1)
      if (state.customCurrencies.length > 1) {
        const delBtn = document.createElement('button');
        delBtn.textContent = '×';
        delBtn.addEventListener('click', () => deleteCurrency(curr));
        badge.appendChild(delBtn);
      }
      
      currencyBadges.appendChild(badge);
    });
  }

  // Render language badges in management panel
  function renderLangBadges() {
    langBadges.innerHTML = '';
    state.customLanguages.forEach(lang => {
      const badge = document.createElement('span');
      badge.className = 'item-badge';
      badge.innerHTML = `${lang.name}`;
      
      // Add delete button
      if (state.customLanguages.length > 1) {
        const delBtn = document.createElement('button');
        delBtn.textContent = '×';
        delBtn.addEventListener('click', () => deleteLang(lang.code));
        badge.appendChild(delBtn);
      }
      
      langBadges.appendChild(badge);
    });
  }

  // Save active settings to Chrome storage
  function saveActiveSettings() {
    chrome.storage.local.set({
      appLang: appLangSelect.value,
      enableCurrency: enableCurrencyCheckbox.checked,
      enableDealCalc: enableDealCalcCheckbox.checked,
      defaultCardState: defaultCardStateSelect.value,
      targetCurrency: targetCurrencySelect.value,
      defaultInputCurrency: defaultInputCurrencySelect.value,
      enableTranslation: enableTranslationCheckbox.checked,
      targetLang: targetLangSelect.value,
      enableTax: enableTaxCheckbox.checked,
      taxType: taxTypeSelect.value,
      taxMethod: taxMethodSelect.value,
      taxPpn: parseFloat(taxPpnInput.value) || 0,
      taxPph: parseFloat(taxPphInput.value) || 0
    });
    
    state.appLang = appLangSelect.value;
    state.enableCurrency = enableCurrencyCheckbox.checked;
    state.enableDealCalc = enableDealCalcCheckbox.checked;
    state.defaultCardState = defaultCardStateSelect.value;
    state.targetCurrency = targetCurrencySelect.value;
    state.defaultInputCurrency = defaultInputCurrencySelect.value;
    state.enableTranslation = enableTranslationCheckbox.checked;
    state.targetLang = targetLangSelect.value;
    state.enableTax = enableTaxCheckbox.checked;
    state.taxType = taxTypeSelect.value;
    state.taxMethod = taxMethodSelect.value;
    state.taxPpn = parseFloat(taxPpnInput.value) || 0;
    state.taxPph = parseFloat(taxPphInput.value) || 0;
  }

  // Save complete state to Chrome storage
  function saveCompleteState() {
    chrome.storage.local.set(state);
  }

  // Add Currency Action
  btnAddCurrency.addEventListener('click', () => {
    const rawVal = newCurrencyInput.value.trim().toUpperCase();
    if (rawVal.length !== 3) {
      alert('Kode mata uang harus 3 huruf! (Contoh: EUR)');
      return;
    }
    if (state.customCurrencies.includes(rawVal)) {
      alert('Mata uang sudah ada dalam daftar!');
      return;
    }
    
    state.customCurrencies.push(rawVal);
    newCurrencyInput.value = '';
    
    saveCompleteState();
    renderAll();
  });

  // Add Language Action
  btnAddLang.addEventListener('click', () => {
    const code = newLangSelect.value;
    if (!code) {
      alert('Pilih bahasa yang ingin ditambahkan!');
      return;
    }
    
    const exists = state.customLanguages.some(l => l.code === code);
    if (exists) {
      alert('Bahasa sudah ada dalam daftar!');
      return;
    }
    
    const name = PREDEFINED_LANGUAGES[code];
    state.customLanguages.push({ code, name });
    newLangSelect.value = '';
    
    saveCompleteState();
    renderAll();
  });

  // Delete Currency Action
  function deleteCurrency(curr) {
    state.customCurrencies = state.customCurrencies.filter(c => c !== curr);
    // If the active currency was deleted, reset to another one
    if (state.targetCurrency === curr) {
      state.targetCurrency = state.customCurrencies[0];
    }
    if (state.defaultInputCurrency === curr) {
      state.defaultInputCurrency = state.customCurrencies[0];
    }
    
    saveCompleteState();
    renderAll();
  }

  // Delete Language Action
  function deleteLang(code) {
    state.customLanguages = state.customLanguages.filter(l => l.code !== code);
    // If the active language was deleted, reset to another one
    if (state.targetLang === code) {
      state.targetLang = state.customLanguages[0].code;
    }
    
    saveCompleteState();
    renderAll();
  }

  // Event listeners for selects and checkboxes
  appLangSelect.addEventListener('change', () => {
    state.appLang = appLangSelect.value;
    saveActiveSettings();
    applyLanguage(state.appLang);
    // Reset toggle text if needed
    if (!managePanel.classList.contains('active')) {
      toggleManageBtn.textContent = langPack[state.appLang]['manage_list'] + ' ⚙️';
    }
  });
  enableCurrencyCheckbox.addEventListener('change', saveActiveSettings);
  enableDealCalcCheckbox.addEventListener('change', saveActiveSettings);
  defaultCardStateSelect.addEventListener('change', saveActiveSettings);
  targetCurrencySelect.addEventListener('change', saveActiveSettings);
  defaultInputCurrencySelect.addEventListener('change', saveActiveSettings);
  enableTranslationCheckbox.addEventListener('change', saveActiveSettings);
  targetLangSelect.addEventListener('change', saveActiveSettings);
  
  // Tax listeners
  enableTaxCheckbox.addEventListener('change', () => { updateTaxUI(); saveActiveSettings(); });
  taxTypeSelect.addEventListener('change', () => { updateTaxUI(); saveActiveSettings(); });
  taxMethodSelect.addEventListener('change', saveActiveSettings);
  taxPpnInput.addEventListener('input', saveActiveSettings);
  taxPphInput.addEventListener('input', saveActiveSettings);

  btnExpandAll.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, {action: 'EXPAND_ALL'});
    });
  });

  btnCollapseAll.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, {action: 'COLLAPSE_ALL'});
    });
  });
});
