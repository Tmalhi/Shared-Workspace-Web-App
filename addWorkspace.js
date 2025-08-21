document.addEventListener('DOMContentLoaded', async () => {
  const propertySelect = document.getElementById('propertySelect');
  const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!currentUser) { alert('You must be logged in to add a workspace.'); window.location.href = 'login.html'; return; }

  // Load owner properties from API
  try {
    const res = await fetch(`${API}/api/properties/mine`, { headers: { ...authHeaders() } });
    const out = await res.json();
    if (!out.ok) throw new Error(out.error || 'Failed to load properties');

    const userProps = out.data;
    propertySelect.innerHTML = '<option value="" disabled selected>Select your property</option>';
    if (!userProps.length) { alert('You have no properties yet. Redirecting to Add Property...'); window.location.href = 'addproperties.html'; return; }
    userProps.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p._id;
      opt.textContent = `${p.address} (${p.neighborhood})`;
      propertySelect.appendChild(opt);
    });
    propertySelect.disabled = false;
  } catch {
    alert('Could not load your properties.');
    return;
  }

  const form = document.getElementById('workspaceForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!propertySelect.value) return alert('Please select a property.');
    if (!form.smoking.value) return alert('Please select smoking option.');
    if (!form.availability.value) return alert('Please select availability.');
    if (!form.type.value) return alert('Please select a workspace type.');
    if (!form.leaseTerm.value) return alert('Please select a lease term.');

    const payload = {
      property: propertySelect.value,
      type: form.type.value,                           // meeting_room | private_office | desk
      seats: Number(form.capacity.value),
      smokingAllowed: form.smoking.value === 'Yes',
      availableFrom: new Date(form.availability.value).toISOString(),
      leaseTerm: form.leaseTerm.value.toLowerCase(),   // day | week | month
      price: Number(form.price.value)
    };

    if (!payload.type || payload.seats <= 0 || !payload.leaseTerm || payload.price < 0)
      return alert('Please fill out all fields with valid values.');

    try {
      const res = await fetch(`${API}/api/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload)
      });
      const out = await res.json();
      if (!out.ok) return alert(out.error || 'Failed to add workspace');

      alert('Workspace added successfully!');
      form.reset();
      propertySelect.selectedIndex = 0;
      window.location.href = 'myProperties.html';
    } catch {
      alert('Network error.');
    }
  });
});
const photos = [];
const photoUrlInput = document.getElementById('photoUrl');
const addPhotoBtn = document.getElementById('addPhotoBtn');
const photosList = document.getElementById('photosList');

function renderPhotos() {
  photosList.innerHTML = photos.map((u, i) => `
    <li>
      <img src="${u}" alt="photo" style="width:80px;height:60px;object-fit:cover;border-radius:6px;margin-right:8px;">
      ${u}
      <button type="button" data-i="${i}" class="removePhoto">x</button>
    </li>
  `).join('');
  photosList.querySelectorAll('.removePhoto').forEach(btn => {
    btn.onclick = () => { photos.splice(Number(btn.dataset.i), 1); renderPhotos(); };
  });
}

if (addPhotoBtn) {
  addPhotoBtn.onclick = () => {
    const url = (photoUrlInput.value || '').trim();
    if (!url) return alert('Enter a URL');
    photos.push(url);
    photoUrlInput.value = '';
    renderPhotos();
  };
}

