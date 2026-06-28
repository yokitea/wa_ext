document.addEventListener('DOMContentLoaded', () => {
  const dateEl = document.getElementById('invoice-date');
  const itemsEl = document.getElementById('invoice-items');
  const totalsEl = document.getElementById('invoice-totals');
  const btnPrint = document.getElementById('btn-print');

  // Set current date
  const now = new Date();
  dateEl.textContent = 'Date: ' + now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

  // Load data from storage
  chrome.storage.local.get(['tempInvoiceData'], (result) => {
    const data = result.tempInvoiceData;
    if (!data) {
      itemsEl.innerHTML = '<tr><td colspan="4">No data found.</td></tr>';
      return;
    }

    renderInvoice(data);
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

function renderInvoice(data) {
  const itemsEl = document.getElementById('invoice-items');
  const totalsEl = document.getElementById('invoice-totals');

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

  if (data.discountAmount > 0) {
    let discLabel = data.disc1 + '%';
    if (data.disc2 > 0) discLabel += ' + ' + data.disc2 + '%';
    
    totalsHTML += `
      <div class="row discount">
        <span>Discount (${discLabel})</span>
        <span>-${formatCurrencyStr(data.discountAmount, data.currencyCode)}</span>
      </div>
    `;
  }

  totalsHTML += `
    <div class="row grand-total">
      <span>Total</span>
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
