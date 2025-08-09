// Load properties array from localStorage or initialize as empty array if none found
let properties = JSON.parse(localStorage.getItem("properties") || "[]");

// Get the output container element where properties and workspaces will be displayed
const output = document.getElementById("output");

// Save updated properties to localStorage and re-render the list
function save() {
  localStorage.setItem("properties", JSON.stringify(properties));
  render();
}

// Render the list of properties and their workspaces
function render() {
  output.innerHTML = ""; // Clear previous content

  // Show message if no properties to manage
  if (properties.length === 0) {
    output.innerHTML = "<p>No properties to manage.</p>";
    return;
  }

  // Loop through each property
  properties.forEach((property, pIndex) => {
    // Generate HTML for each workspace under this property
    const workspacesHTML = property.workspaces?.map((w, wIndex) => `
      <div class="property-info" id="workspace-${pIndex}-${wIndex}">
        <p><strong>Type:</strong> ${w.type}</p>
        <p><strong>Capacity:</strong> ${w.capacity}</p>
        <p><strong>Smoking:</strong> ${w.smoking}</p>
        <p><strong>Availability:</strong> ${w.availability}</p>
        <p><strong>Lease Term:</strong> ${w.leaseTerm}</p>
        <p><strong>Price:</strong> $${w.price}</p>
        <button onclick="enableWorkspaceEdit(${pIndex}, ${wIndex})">Update</button>
        <button onclick="deleteWorkspace(${pIndex}, ${wIndex})">Delete</button>
      </div>
    `).join('') || '<p>No workspaces.</p>'; // If no workspaces, show message

    // Create a container div for each property
    const pDiv = document.createElement("div");
    pDiv.className = "property-item";
    pDiv.id = `property-${pIndex}`;

    // Add property details and the list of workspaces to container
    pDiv.innerHTML = `
      <div class="property-info">
        <h3><span id="addr-${pIndex}">${property.address}</span> (<span id="neigh-${pIndex}">${property.neighborhood}</span>)</h3>
        <p><strong>Sqft:</strong> <span id="sqft-${pIndex}">${property.sqft}</span></p>
        <p><strong>Parking:</strong> <span id="park-${pIndex}">${property.parking}</span></p>
        <p><strong>Transit:</strong> <span id="tran-${pIndex}">${property.transit}</span></p>
        <button onclick="enablePropertyEdit(${pIndex})">Update</button>
        <button onclick="deleteProperty(${pIndex})">Delete</button>
      </div>
      <h4>Workspaces:</h4>
      ${workspacesHTML}
    `;

    // Append property container to the output div
    output.appendChild(pDiv);
  });
}

// Enable editing mode for a property (replace display with input fields)
function enablePropertyEdit(index) {
  const prop = properties[index];
  const pDiv = document.getElementById(`property-${index}`);

  // Replace property info with editable input fields
  pDiv.innerHTML = `
    <div class="property-info">
      <h3>
        Address: <input type="text" id="edit-addr-${index}" value="${prop.address}" />
        Neighborhood: <input type="text" id="edit-neigh-${index}" value="${prop.neighborhood}" />
      </h3>
      <p>
        Sqft: <input type="number" id="edit-sqft-${index}" value="${prop.sqft}" /><br />
        Parking:
        <select id="edit-park-${index}">
          <option value="Yes" ${prop.parking === "Yes" ? "selected" : ""}>Yes</option>
          <option value="No" ${prop.parking === "No" ? "selected" : ""}>No</option>
        </select><br />
        Transit:
        <select id="edit-tran-${index}">
          <option value="Yes" ${prop.transit === "Yes" ? "selected" : ""}>Yes</option>
          <option value="No" ${prop.transit === "No" ? "selected" : ""}>No</option>
        </select>
      </p>
      <button onclick="updateProperty(${index})">Save</button>
      <button onclick="render()">Cancel</button>
    </div>
    <h4>Workspaces:</h4>
    ${prop.workspaces?.map((w, wIndex) => `
      <div class="property-info" id="workspace-${index}-${wIndex}">
        <p><strong>Type:</strong> ${w.type}</p>
        <p><strong>Capacity:</strong> ${w.capacity}</p>
        <p><strong>Smoking:</strong> ${w.smoking}</p>
        <p><strong>Availability:</strong> ${w.availability}</p>
        <p><strong>Lease Term:</strong> ${w.leaseTerm}</p>
        <p><strong>Price:</strong> $${w.price}</p>
        <button onclick="enableWorkspaceEdit(${index}, ${wIndex})">Update</button>
        <button onclick="deleteWorkspace(${index}, ${wIndex})">Delete</button>
      </div>
    `).join('') || '<p>No workspaces.</p>'}
  `;
}

// Save the updated property details from inputs back into properties array and localStorage
function updateProperty(index) {
  const p = properties[index];
  p.address = document.getElementById(`edit-addr-${index}`).value;
  p.neighborhood = document.getElementById(`edit-neigh-${index}`).value;
  p.sqft = document.getElementById(`edit-sqft-${index}`).value;
  p.parking = document.getElementById(`edit-park-${index}`).value;
  p.transit = document.getElementById(`edit-tran-${index}`).value;
  save();
  alert("Property updated!");
}

// Delete a property after confirmation and update storage & UI
function deleteProperty(index) {
  if (confirm("Delete this property?")) {
    properties.splice(index, 1);
    save();
  }
}

// Enable editing mode for a workspace (replace display with input fields)
function enableWorkspaceEdit(pIndex, wIndex) {
  const w = properties[pIndex].workspaces[wIndex];
  const div = document.getElementById(`workspace-${pIndex}-${wIndex}`);

  // Replace workspace details with editable input fields
  div.innerHTML = `
    <p>
      Type: <input type="text" id="edit-type-${pIndex}-${wIndex}" value="${w.type}" />
      Capacity: <input type="number" id="edit-cap-${pIndex}-${wIndex}" value="${w.capacity}" />
      Smoking:
      <select id="edit-smoke-${pIndex}-${wIndex}">
        <option value="Yes" ${w.smoking === "Yes" ? "selected" : ""}>Yes</option>
        <option value="No" ${w.smoking === "No" ? "selected" : ""}>No</option>
      </select>
      Availability:
      <select id="edit-avail-${pIndex}-${wIndex}">
        <option value="Available" ${w.availability === "Available" ? "selected" : ""}>Available</option>
        <option value="Unavailable" ${w.availability === "Unavailable" ? "selected" : ""}>Unavailable</option>
      </select>
      Lease Term: <input type="text" id="edit-lease-${pIndex}-${wIndex}" value="${w.leaseTerm}" />
      Price: <input type="number" id="edit-price-${pIndex}-${wIndex}" value="${w.price}" />
    </p>
    <button onclick="updateWorkspace(${pIndex}, ${wIndex})">Save</button>
    <button onclick="render()">Cancel</button>
  `;
}

// Save the updated workspace details back into properties array and localStorage
function updateWorkspace(pIndex, wIndex) {
  const w = properties[pIndex].workspaces[wIndex];
  w.type = document.getElementById(`edit-type-${pIndex}-${wIndex}`).value;
  w.capacity = document.getElementById(`edit-cap-${pIndex}-${wIndex}`).value;
  w.smoking = document.getElementById(`edit-smoke-${pIndex}-${wIndex}`).value;
  w.availability = document.getElementById(`edit-avail-${pIndex}-${wIndex}`).value;
  w.leaseTerm = document.getElementById(`edit-lease-${pIndex}-${wIndex}`).value;
  w.price = document.getElementById(`edit-price-${pIndex}-${wIndex}`).value;
  save();
  alert("Workspace updated!");
}

// Delete a workspace after confirmation and update storage & UI
function deleteWorkspace(pIndex, wIndex) {
  if (confirm("Delete this workspace?")) {
    properties[pIndex].workspaces.splice(wIndex, 1);
    save();
  }
}

// Initial render on page load
render();
