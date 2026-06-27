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

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const enableCurrencyCheckbox = document.getElementById('enable-currency');
  const targetCurrencySelect = document.getElementById('target-currency');
  const enableTranslationCheckbox = document.getElementById('enable-translation');
  const targetLangSelect = document.getElementById('target-lang');
  
  const toggleManageBtn = document.getElementById('toggle-manage');
  const managePanel = document.getElementById('manage-panel');
  
  const currencyBadges = document.getElementById('currency-badges');
  const newCurrencyInput = document.getElementById('new-currency-input');
  const btnAddCurrency = document.getElementById('btn-add-currency');
  
  const langBadges = document.getElementById('lang-badges');
  const newLangSelect = document.getElementById('new-lang-select');
  const btnAddLang = document.getElementById('btn-add-lang');

  // State
  let state = {
    enableCurrency: true,
    targetCurrency: 'IDR',
    enableTranslation: true,
    targetLang: 'id',
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
    toggleManageBtn.textContent = managePanel.classList.contains('active') ? 'Tutup Setelan ❌' : 'Kelola Daftar ⚙️';
  });

  // Load state and render
  chrome.storage.local.get({
    enableCurrency: true,
    targetCurrency: 'IDR',
    enableTranslation: true,
    targetLang: 'id',
    customCurrencies: ['IDR', 'USD', 'SGD'],
    customLanguages: [
      { code: 'id', name: 'Indonesia' },
      { code: 'en', name: 'Inggris' },
      { code: 'jw', name: 'Jawa' }
    ]
  }, (items) => {
    state = items;
    
    // Set active values
    enableCurrencyCheckbox.checked = state.enableCurrency;
    enableTranslationCheckbox.checked = state.enableTranslation;
    
    renderAll();
  });

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
    state.customCurrencies.forEach(curr => {
      const opt = document.createElement('option');
      opt.value = curr;
      opt.textContent = `${curr}`;
      if (curr === state.targetCurrency) opt.selected = true;
      targetCurrencySelect.appendChild(opt);
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
      enableCurrency: enableCurrencyCheckbox.checked,
      targetCurrency: targetCurrencySelect.value,
      enableTranslation: enableTranslationCheckbox.checked,
      targetLang: targetLangSelect.value
    });
    
    state.enableCurrency = enableCurrencyCheckbox.checked;
    state.targetCurrency = targetCurrencySelect.value;
    state.enableTranslation = enableTranslationCheckbox.checked;
    state.targetLang = targetLangSelect.value;
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
  enableCurrencyCheckbox.addEventListener('change', saveActiveSettings);
  targetCurrencySelect.addEventListener('change', saveActiveSettings);
  enableTranslationCheckbox.addEventListener('change', saveActiveSettings);
  targetLangSelect.addEventListener('change', saveActiveSettings);
});
