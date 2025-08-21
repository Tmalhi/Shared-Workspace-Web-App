document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!currentUser) { alert('You must be logged in to add a property.'); window.location.href = 'login.html'; return; }

  const form = document.getElementById('propertyForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.parking.value) return alert('Please select a parking option.');
    if (!form.transit.value) return alert('Please select a transit option.');

    const payload = {
      address: form.address.value.trim(),
      neighborhood: form.neighborhood.value.trim(),
      squareFeet: Number(form.sqft.value),
      hasParking: form.parking.value === 'Yes' || form.parking.value === true,
      hasTransit: form.transit.value === 'Yes' || form.transit.value === true
    };

    if (!payload.address || !payload.neighborhood || !payload.squareFeet || payload.squareFeet <= 0)
      return alert('Please fill out all fields with valid values.');

    try {
      const res = await fetch(`${API}/api/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload)
      });
      const out = await res.json();
      if (!out.ok) return alert(out.error || 'Failed to add property');

      alert('Property added successfully!');
      form.reset();
      window.location.href = 'myProperties.html';
    } catch {
      alert('Network error.');
    }
  });
});
