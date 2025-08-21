console.log("coworker.js — MODAL VERSION loaded ✅", Date.now());


document.addEventListener('DOMContentLoaded', async function () {
  const propertyList = document.getElementById('propertyList');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  // Modal refs
  const modal = document.getElementById('wsModal');
  const modalClose = document.getElementById('wsModalClose');
  const modalContent = document.getElementById('wsModalContent');

  function openModal(html) {
    modalContent.innerHTML = html;
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modalContent.innerHTML = '';
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(); // click outside dialog
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  async function fetchSearch(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API}/api/workspaces/search${q ? `?${q}` : ''}`);
    const out = await res.json();
    if (!out.ok) throw new Error(out.error || 'Search failed');
    return out.data;
  }

  function toCard(ws) {
    const p = ws.property || {};
    const owner = p.owner || {};

    const card = document.createElement('div');
    card.classList.add('property-card');

    const firstPhoto = (p.photos && p.photos[0])
      ? `<img src="${p.photos[0]}" alt="" style="width:100%;max-height:160px;object-fit:cover;border-radius:8px;margin-bottom:8px;">`
      : '';

    card.innerHTML = `
      ${firstPhoto}
      <h2>${ws.type} — $${ws.price}</h2>
      <p><strong>🏘 Address:</strong> ${p.address || ''}</p>
      <p><strong>📍 Neighborhood:</strong> ${p.neighborhood || ''}</p>
      <p><strong>📐 Sqft:</strong> ${p.squareFeet || ''} •
         <strong>🚗 Parking:</strong> ${p.hasParking ? 'Yes' : 'No'} •
         <strong>🚉 Transit:</strong> ${p.hasTransit ? 'Yes' : 'No'}</p>
      <p><strong>👥 Seats:</strong> ${ws.seats} •
         <strong>🚬 Smoking:</strong> ${ws.smokingAllowed ? 'Allowed' : 'Not Allowed'} •
         <strong>📆 Available from:</strong> ${new Date(ws.availableFrom).toLocaleDateString()} •
         <strong>📄 Lease:</strong> ${ws.leaseTerm}</p>
      <div style="margin-top:8px;">
        <button class="openDetails modal__btn modal__btn--primary">View Details</button>
      </div>
    `;

    card.querySelector('.openDetails').addEventListener('click', () => {
      // mailto link with prefilled subject/body
      const subject = encodeURIComponent(`Inquiry about ${ws.type} at ${p.address || 'your property'}`);
      const body = encodeURIComponent(
        `Hi ${owner.name || ''},%0D%0A%0D%0A` +
        `I'm interested in the ${ws.type} listed at ${p.address || ''}.%0D%0A` +
        `Seats: ${ws.seats}%0D%0A` +
        `Lease: ${ws.leaseTerm}%0D%0A` +
        `Available from: ${new Date(ws.availableFrom).toLocaleDateString()}%0D%0A%0D%0A` +
        `Please let me know if it's available. Thanks!`
      );
      const mailHref = owner.email ? `mailto:${owner.email}?subject=${subject}&body=${body}` : null;
      const telHref = owner.phone ? `tel:${owner.phone.replace(/\s+/g, '')}` : null;

      // photos gallery
      const photos = (p.photos && p.photos.length)
        ? `<div class="modal__photos">${p.photos.map(u => `<img src="${u}" alt="photo">`).join('')}</div>`
        : '';

      const html = `
        <div class="modal__header">
          <h2 id="wsModalTitle" style="margin:0 36px 6px 0;">${ws.type} — $${ws.price}</h2>
          <p style="margin:0;color:#666;">${p.address || ''}${p.neighborhood ? ' • ' + p.neighborhood : ''}</p>
        </div>

        ${photos}

        <div class="modal__grid">
          <p><strong>Seats:</strong> ${ws.seats}</p>
          <p><strong>Smoking:</strong> ${ws.smokingAllowed ? 'Allowed' : 'Not Allowed'}</p>
          <p><strong>Available from:</strong> ${new Date(ws.availableFrom).toLocaleDateString()}</p>
          <p><strong>Lease term:</strong> ${ws.leaseTerm}</p>
          <p><strong>Sqft:</strong> ${p.squareFeet ?? '—'}</p>
          <p><strong>Parking:</strong> ${p.hasParking ? 'Yes' : 'No'}</p>
          <p><strong>Transit:</strong> ${p.hasTransit ? 'Yes' : 'No'}</p>
        </div>

        <hr style="margin:12px 0;">

        <div>
          <p style="margin:0 0 6px;"><strong>Owner:</strong> ${owner.name || 'N/A'}</p>
          <p style="margin:0;"><strong>Email:</strong> ${
            owner.email ? `<a href="${mailHref}" id="emailLink">${owner.email}</a>` : 'N/A'
          }</p>
          <p style="margin:0;"><strong>Phone:</strong> ${
            owner.phone ? `<a href="${telHref}">${owner.phone}</a>` : 'N/A'
          }</p>
        </div>

        <div class="modal__actions">
          ${mailHref ? `<a class="modal__btn modal__btn--primary" href="${mailHref}">Email Owner</a>` : ''}
          ${telHref ? `<a class="modal__btn" href="${telHref}">Call</a>` : ''}
          <button class="modal__btn" id="closeModalBtn">Close</button>
        </div>
      `;

      openModal(html);

      // Close button inside content
      const closeBtn = document.getElementById('closeModalBtn');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
    });

    return card;
  }

  function render(list) {
    propertyList.innerHTML = '';
    if (!list.length) {
      propertyList.innerHTML = `<p class="no-listings">📭 No workspaces found.</p>`;
      return;
    }
    list.forEach(ws => propertyList.appendChild(toCard(ws)));
  }

  // initial load
  try {
    render(await fetchSearch());
  } catch (e) {
    console.error(e);
    propertyList.innerHTML = '<p>Failed to load listings.</p>';
  }

  // search by neighborhood/address keyword
  searchInput.addEventListener('input', async () => {
    const q = searchInput.value.trim().toLowerCase();
    try { render(await fetchSearch(q ? { neighborhood: q } : {})); } catch (e) { console.error(e); }
  });

  // sorting
  sortSelect.addEventListener('change', async () => {
    let sortBy = '';
    if (sortSelect.value === 'name-asc' || sortSelect.value === 'name-desc') {
      const list = await fetchSearch();
      list.sort((a, b) =>
        (a.type || '').localeCompare(b.type || '') * (sortSelect.value === 'name-desc' ? -1 : 1)
      );
      render(list);
      return;
    }
    if (sortSelect.value === 'price-asc') sortBy = 'price';
    if (sortSelect.value === 'price-desc') sortBy = 'price';
    if (sortSelect.value === 'available') sortBy = 'available';

    const list = await fetchSearch(sortBy ? { sortBy } : {});
    if (sortSelect.value === 'price-desc') list.reverse();
    render(list);
  });
});
