// Run the function after the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get the output container where properties will be displayed
  const output = document.getElementById("output");

  // Get the currently logged-in user from localStorage and parse it
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // Get all properties stored in localStorage (or an empty array if none)
  const properties = JSON.parse(localStorage.getItem("properties") || "[]");

  // If no user is logged in, show a message and stop further execution
  if (!currentUser) {
    output.innerHTML = "<p>Please log in to view your properties.</p>";
    return;
  }

  // Filter properties to include only those owned by the current user
  const userProperties = properties.filter(p => p.owner === currentUser.email);

  // If the user has no properties, show a message and stop further execution
  if (userProperties.length === 0) {
    output.innerHTML = "<p>You have no properties added yet.</p>";
    return;
  }

  // Clear the output container before adding property cards
  output.innerHTML = "";

  // Loop through each property owned by the user and display details
  userProperties.forEach(p => {
    // Convert boolean parking and transit values to readable "Yes" or "No"
    const parking = p.parking ? "Yes" : "No";
    const transit = p.transit ? "Yes" : "No";

    // Create a new div element to hold the property card
    const div = document.createElement("div");
    div.classList.add("property-card"); // Add CSS class for styling

    // Set the inner HTML of the property card with property details
    div.innerHTML = `
      <h3>${p.address} (${p.neighborhood})</h3>
      <p>
        <strong>Sqft:</strong> ${p.sqft} <br />
        <strong>Parking:</strong> ${parking} <br />
        <strong>Transit:</strong> ${transit}
      </p>
      <h4>Workspaces:</h4>
      <ul>
        ${
          // If there are workspaces, map them into list items
          p.workspaces && p.workspaces.length > 0
            ? p.workspaces.map(w => `
                <li>
                  <strong>Type:</strong> ${w.type}, 
                  <strong>Capacity:</strong> ${w.capacity}, 
                  <strong>Smoking:</strong> ${w.smoking ? "Allowed" : "Not Allowed"}, 
                  <strong>Availability:</strong> ${w.availability}, 
                  <strong>Lease:</strong> ${w.leaseTerm}, 
                  <strong>Price:</strong> $${w.price}
                </li>
              `).join("")
            // If no workspaces, show a placeholder message
            : "<li>No workspaces added.</li>"
        }
      </ul>
      <hr />
    `;

    // Append the created property card div to the output container
    output.appendChild(div);
  });
});
