document.addEventListener('DOMContentLoaded', async () => {
  const output = document.getElementById('output');
  const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!currentUser) { output.innerHTML = '<p>Please log in to view your properties.</p>'; return; }

  try {
    const res = await fetch(`${API}/api/properties/mine`, { headers: { ...authHeaders() } });
    const out = await res.json();
    if (!out.ok) { output.innerHTML = `<p>${out.error || 'Failed to load'}</p>`; return; }

    const userProperties = out.data;
    if (!userProperties.length) { output.innerHTML = '<p>You have no properties added yet.</p>'; return; }

    output.innerHTML = '';
    userProperties.forEach(p => {
      const parking = p.hasParking ? 'Yes' : 'No';
      const transit = p.hasTransit ? 'Yes' : 'No';
      const div = document.createElement('div');
      div.classList.add('property-card');
      div.innerHTML = `
        <h3>${p.address} (${p.neighborhood})</h3>
        <p><strong>Sqft:</strong> ${p.squareFeet} <br />
           <strong>Parking:</strong> ${parking} <br />
           <strong>Transit:</strong> ${transit}</p>
        <h4>Workspaces:</h4>
        <ul id="ws-${p._id}">
          ${(p.workspaces?.length ? p.workspaces.map(w => `
            <li><strong>Type:</strong> ${w.type}, <strong>Seats:</strong> ${w.seats},
                <strong>Smoking:</strong> ${w.smokingAllowed ? 'Allowed' : 'Not Allowed'},
                <strong>Available from:</strong> ${new Date(w.availableFrom).toLocaleDateString()},
                <strong>Lease:</strong> ${w.leaseTerm},
                <strong>Price:</strong> $${w.price}</li>`).join('') : '<li>No workspaces added.</li>')
          }
        </ul>
        <hr />
      `;
      output.appendChild(div);
    });
  } catch {
    output.innerHTML = '<p>Network error.</p>';
  }
  const pics = (p.photos && p.photos.length)
  ? `<div class="photos">${p.photos.map(u => `<img src="${u}" style="width:90px;height:70px;object-fit:cover;border-radius:6px;margin:4px;">`).join('')}</div>`
  : '<p>No photos.</p>';

div.innerHTML = `
  <h3>${p.address} (${p.neighborhood})</h3>
  <p><strong>Sqft:</strong> ${p.squareFeet} • <strong>Parking:</strong> ${p.hasParking?'Yes':'No'} • <strong>Transit:</strong> ${p.hasTransit?'Yes':'No'}</p>
  ${pics}
  <h4>Workspaces:</h4>
  ...
`;
});
