let properties = []; // fetched from API
const output = document.getElementById('output');

function saveRender() { render(); } // render-only; server persists

async function loadMine() {
  const res = await fetch(`${API}/api/properties/mine`, { headers: { ...authHeaders() } });
  const out = await res.json();
  if (!out.ok) throw new Error(out.error || 'Failed to load');
  properties = out.data;
  render();
}

function render() {
  output.innerHTML = '';
  if (!properties.length) { output.innerHTML = '<p>No properties to manage.</p>'; return; }

  properties.forEach((p, pIndex) => {
    const workspacesHTML = (p.workspaces?.map((w, wIndex) => `
      <div class="property-info" id="workspace-${pIndex}-${wIndex}">
        <p><strong>Type:</strong> ${w.type}</p>
        <p><strong>Seats:</strong> ${w.seats}</p>
        <p><strong>Smoking:</strong> ${w.smokingAllowed ? 'Yes' : 'No'}</p>
        <p><strong>Available From:</strong> ${new Date(w.availableFrom).toLocaleDateString()}</p>
        <p><strong>Lease Term:</strong> ${w.leaseTerm}</p>
        <p><strong>Price:</strong> $${w.price}</p>
        <button onclick="enableWorkspaceEdit('${p._id}','${w._id}', ${pIndex}, ${wIndex})">Update</button>
        <button onclick="deleteWorkspace('${w._id}', ${pIndex}, ${wIndex})">Delete</button>
      </div>
    `).join('')) || '<p>No workspaces.</p>';

    const pDiv = document.createElement('div');
    pDiv.className = 'property-item';
    pDiv.id = `property-${pIndex}`;
    pDiv.innerHTML = `
      <div class="property-info">
        <h3><span id="addr-${pIndex}">${p.address}</span> (<span id="neigh-${pIndex}">${p.neighborhood}</span>)</h3>
        <p><strong>Sqft:</strong> <span id="sqft-${pIndex}">${p.squareFeet}</span></p>
        <p><strong>Parking:</strong> <span id="park-${pIndex}">${p.hasParking ? 'Yes' : 'No'}</span></p>
        <p><strong>Transit:</strong> <span id="tran-${pIndex}">${p.hasTransit ? 'Yes' : 'No'}</span></p>
        <button onclick="enablePropertyEdit(${pIndex})">Update</button>
        <button onclick="deleteProperty('${p._id}', ${pIndex})">Delete</button>
      </div>
      <h4>Workspaces:</h4>
      ${workspacesHTML}
    `;
    output.appendChild(pDiv);
  });
}

function enablePropertyEdit(index) {
  const p = properties[index];
  const pDiv = document.getElementById(`property-${index}`);
  pDiv.innerHTML = `
    <div class="property-info">
      <h3>
        Address: <input type="text" id="edit-addr-${index}" value="${p.address}" />
        Neighborhood: <input type="text" id="edit-neigh-${index}" value="${p.neighborhood}" />
      </h3>
      <p>
        Sqft: <input type="number" id="edit-sqft-${index}" value="${p.squareFeet}" /><br />
        Parking:
        <select id="edit-park-${index}">
          <option value="Yes" ${p.hasParking ? 'selected' : ''}>Yes</option>
          <option value="No" ${!p.hasParking ? 'selected' : ''}>No</option>
        </select><br />
        Transit:
        <select id="edit-tran-${index}">
          <option value="Yes" ${p.hasTransit ? 'selected' : ''}>Yes</option>
          <option value="No" ${!p.hasTransit ? 'selected' : ''}>No</option>
        </select>
      </p>
      <button onclick="updateProperty(${index})">Save</button>
      <button onclick="render()">Cancel</button>
    </div>
    <h4>Workspaces:</h4>
    ${(p.workspaces?.map((w, wIndex) => `
      <div class="property-info" id="workspace-${index}-${wIndex}">
        <p><strong>Type:</strong> ${w.type}</p>
        <p><strong>Seats:</strong> ${w.seats}</p>
        <p><strong>Smoking:</strong> ${w.smokingAllowed ? 'Yes' : 'No'}</p>
        <p><strong>Available From:</strong> ${new Date(w.availableFrom).toLocaleDateString()}</p>
        <p><strong>Lease Term:</strong> ${w.leaseTerm}</p>
        <p><strong>Price:</strong> $${w.price}</p>
        <button onclick="enableWorkspaceEdit('${p._id}','${w._id}', ${index}, ${wIndex})">Update</button>
        <button onclick="deleteWorkspace('${w._id}', ${index}, ${wIndex})">Delete</button>
      </div>
    `).join('')) || '<p>No workspaces.</p>'}
  `;
}

async function updateProperty(index) {
  const p = properties[index];
  const payload = {
    address: document.getElementById(`edit-addr-${index}`).value,
    neighborhood: document.getElementById(`edit-neigh-${index}`).value,
    squareFeet: Number(document.getElementById(`edit-sqft-${index}`).value),
    hasParking: document.getElementById(`edit-park-${index}`).value === 'Yes',
    hasTransit: document.getElementById(`edit-tran-${index}`).value === 'Yes'
  };
  const res = await fetch(`${API}/api/properties/${p._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  const out = await res.json();
  if (!out.ok) return alert(out.error || 'Update failed');
  properties[index] = out.data;
  alert('Property updated!');
  saveRender();
}

async function deleteProperty(id, index) {
  if (!confirm('Delete this property?')) return;
  const res = await fetch(`${API}/api/properties/${id}`, { method: 'DELETE', headers: { ...authHeaders() } });
  const out = await res.json();
  if (!out.ok) return alert(out.error || 'Delete failed');
  properties.splice(index, 1);
  saveRender();
}

function enableWorkspaceEdit(propId, wsId, pIndex, wIndex) {
  const w = properties[pIndex].workspaces[wIndex];
  const div = document.getElementById(`workspace-${pIndex}-${wIndex}`);
  const iso = new Date(w.availableFrom).toISOString().slice(0, 10);
  div.innerHTML = `
    <p>
      Type: <input type="text" id="edit-type-${pIndex}-${wIndex}" value="${w.type}" />
      Seats: <input type="number" id="edit-cap-${pIndex}-${wIndex}" value="${w.seats}" />
      Smoking:
      <select id="edit-smoke-${pIndex}-${wIndex}">
        <option value="Yes" ${w.smokingAllowed ? 'selected' : ''}>Yes</option>
        <option value="No" ${!w.smokingAllowed ? 'selected' : ''}>No</option>
      </select>
      Available From: <input type="date" id="edit-avail-${pIndex}-${wIndex}" value="${iso}" />
      Lease Term: <input type="text" id="edit-lease-${pIndex}-${wIndex}" value="${w.leaseTerm}" />
      Price: <input type="number" id="edit-price-${pIndex}-${wIndex}" value="${w.price}" />
    </p>
    <button onclick="updateWorkspace('${wsId}', ${pIndex}, ${wIndex})">Save</button>
    <button onclick="render()">Cancel</button>
  `;
}

async function updateWorkspace(wsId, pIndex, wIndex) {
  const w = properties[pIndex].workspaces[wIndex];
  const payload = {
    type: document.getElementById(`edit-type-${pIndex}-${wIndex}`).value,
    seats: Number(document.getElementById(`edit-cap-${pIndex}-${wIndex}`).value),
    smokingAllowed: document.getElementById(`edit-smoke-${pIndex}-${wIndex}`).value === 'Yes',
    availableFrom: new Date(document.getElementById(`edit-avail-${pIndex}-${wIndex}`).value).toISOString(),
    leaseTerm: document.getElementById(`edit-lease-${pIndex}-${wIndex}`).value,
    price: Number(document.getElementById(`edit-price-${pIndex}-${wIndex}`).value)
  };
  const res = await fetch(`${API}/api/workspaces/${wsId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  const out = await res.json();
  if (!out.ok) return alert(out.error || 'Update failed');

  // Replace local copy then re-render
  properties[pIndex].workspaces[wIndex] = out.data;
  alert('Workspace updated!');
  render();
}

async function deleteWorkspace(wsId, pIndex, wIndex) {
  if (!confirm('Delete this workspace?')) return;
  const res = await fetch(`${API}/api/workspaces/${wsId}`, { method: 'DELETE', headers: { ...authHeaders() } });
  const out = await res.json();
  if (!out.ok) return alert(out.error || 'Delete failed');
  properties[pIndex].workspaces.splice(wIndex, 1);
  render();
}

document.addEventListener('DOMContentLoaded', async () => {
  const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!currentUser) { output.innerHTML = '<p>No properties to manage (not logged in).</p>'; return; }
  try { await loadMine(); } catch (e) { output.innerHTML = `<p>${e.message}</p>`; }
});
