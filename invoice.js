// Dictionary for Localization
const DICTIONARY = {
  en: {
    discount_split_title: "Discount Splits",
    discount_1: "Discount 1",
    discount_2: "Discount 2",
    discount_3: "Discount 3",
    base_after_tax: "Base Price (After Tax)",
    total_discount: "Total Discount",
    total: "Total"
  },
  id: {
    discount_split_title: "Pembagian Diskon",
    discount_1: "Diskon 1",
    discount_2: "Diskon 2",
    discount_3: "Diskon 3",
    base_after_tax: "Harga Dasar (Stlh Pajak)",
    total_discount: "Total Diskon",
    total: "Total"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const dateEl = document.getElementById('invoice-date');
  const itemsEl = document.getElementById('invoice-items');
  const totalsEl = document.getElementById('invoice-totals');
  const btnPrint = document.getElementById('btn-print');

  // Set current date
  const now = new Date();
  dateEl.textContent = 'Date: ' + now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

  // Load data from storage
  chrome.storage.local.get(['tempInvoiceData', 'targetLang'], (result) => {
    const data = result.tempInvoiceData;
    const targetLang = result.targetLang || 'id';
    
    if (!data) {
      itemsEl.innerHTML = '<tr><td colspan="4">No data found.</td></tr>';
      return;
    }

    renderInvoice(data, targetLang);
  });

  btnPrint.addEventListener('click', () => {
    window.print();
  });
});

function formatCurrencyStr(amount, currencyCode) {
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

function renderInvoice(data, targetLang) {
  const itemsEl = document.getElementById('invoice-items');
  const totalsEl = document.getElementById('invoice-totals');

  const tLang = targetLang === 'id' || targetLang === 'su' || targetLang === 'ms' ? 'id' : 'en';
  const dict = DICTIONARY[tLang] || DICTIONARY['en'];

  // Item row
  itemsEl.innerHTML = `
    <tr>
      <td>Business Item / Product</td>
      <td class="right">${data.qty}</td>
      <td class="right">${formatCurrencyStr(data.price, data.currencyCode)}</td>
      <td class="right">${formatCurrencyStr(data.subtotal, data.currencyCode)}</td>
    </tr>
  `;

  // Totals
  let totalsHTML = `
    <div class="row">
      <span>Subtotal</span>
      <span>${formatCurrencyStr(data.subtotal, data.currencyCode)}</span>
    </div>
  `;

  if (data.hasTax) {
    if (data.ppnAmount > 0) {
      totalsHTML += `
        <div class="row">
          <span>PPN (${data.ppnRate}%)</span>
          <span>+${formatCurrencyStr(data.ppnAmount, data.currencyCode)}</span>
        </div>
      `;
    }
    if (data.pphAmount > 0) {
      totalsHTML += `
        <div class="row discount">
          <span>PPH (${data.pphRate}%)</span>
          <span>-${formatCurrencyStr(data.pphAmount, data.currencyCode)}</span>
        </div>
      `;
    }
    
    totalsHTML += `
      <div class="row" style="border-top: 1px solid #ddd; margin-top: 8px; padding-top: 8px; font-weight: bold; color: #555;">
        <span>${dict.base_after_tax}</span>
        <span>${formatCurrencyStr(data.baseAfterTax, data.currencyCode)}</span>
      </div>
    `;
  }

  if (data.discountAmount > 0) {
    if (data.disc2 > 0 || data.disc3 > 0) {
      totalsHTML += `
        <div class="row" style="margin-top: 10px; font-weight: bold; font-size: 13px;">
          <span>${dict.discount_split_title}</span>
          <span></span>
        </div>
        <div class="row discount">
          <span>${dict.discount_1} (${data.disc1}%)</span>
          <span>-${formatCurrencyStr(data.disc1Amount, data.currencyCode)}</span>
        </div>
      `;
      if (data.disc2 > 0) {
        totalsHTML += `
          <div class="row discount">
            <span>${dict.discount_2} (${data.disc2}%)</span>
            <span>-${formatCurrencyStr(data.disc2Amount, data.currencyCode)}</span>
          </div>
        `;
      }
      if (data.disc3 > 0) {
        totalsHTML += `
          <div class="row discount">
            <span>${dict.discount_3} (${data.disc3}%)</span>
            <span>-${formatCurrencyStr(data.disc3Amount, data.currencyCode)}</span>
          </div>
        `;
      }
      totalsHTML += `
        <div class="row discount" style="font-weight: 500; border-top: 1px dashed #eee; margin-top: 5px; padding-top: 5px;">
          <span>${dict.total_discount}</span>
          <span>-${formatCurrencyStr(data.discountAmount, data.currencyCode)}</span>
        </div>
      `;
    } else {
      totalsHTML += `
        <div class="row discount">
          <span>Discount (${data.disc1}%)</span>
          <span>-${formatCurrencyStr(data.discountAmount, data.currencyCode)}</span>
        </div>
      `;
    }
  }

  if (data.ongkirAmount > 0) {
    totalsHTML += `
      <div class="row">
        <span style="color: #667781;">🚚 Ongkir</span>
        <span style="color: #667781;">+${formatCurrencyStr(data.ongkirAmount, data.currencyCode)}</span>
      </div>
    `;
  }

  totalsHTML += `
    <div class="row grand-total">
      <span>${dict.total}</span>
      <span>${formatCurrencyStr(data.total, data.currencyCode)}</span>
    </div>
  `;

  if (data.convertedTotal) {
    totalsHTML += `
      <div class="row" style="margin-top: 10px; font-style: italic; color: #555;">
        <span>Converted Total</span>
        <span>${data.convertedTotal}</span>
      </div>
    `;
  }

  totalsEl.innerHTML = totalsHTML;
}
