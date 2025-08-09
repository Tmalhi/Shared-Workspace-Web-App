// coworker.js

// Run code when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get references to DOM elements
    const propertyList = document.getElementById("propertyList");
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");

    // Load properties data from localStorage, or empty array if none found
    let properties = JSON.parse(localStorage.getItem("properties") || "[]");

    // Function to render a list of properties into the propertyList container
    function renderProperties(list) {
        // Clear any existing content
        propertyList.innerHTML = "";

        // Show message if no properties available to display
        if (list.length === 0) {
            propertyList.innerHTML = `<p class="no-listings">📭 No properties found.</p>`;
            return;
        }

        // Loop through each property and create its card element
        list.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("property-card");

            // Build inner HTML for the property card, including details and workspace info
            card.innerHTML = `
                <h2>${p.address}</h2>
                <p><strong>🏘 Neighborhood:</strong> ${p.neighborhood}</p>
                <p><strong>📐 Sqft:</strong> ${p.sqft}</p>
                <p><strong>🚗 Parking:</strong> ${p.parking}</p>
                <p><strong>🚉 Transit:</strong> ${p.transit}</p>
                <hr>
                <p><strong>📧 Owner Email:</strong> <a href="mailto:${p.owner}">${p.owner}</a></p>
                ${p.ownerPhone ? `<p><strong>📞 Phone:</strong> <a href="tel:${p.ownerPhone}">${p.ownerPhone}</a></p>` : ""}
                <hr>
                ${p.workspaces && p.workspaces.length > 0 ? `
                    <h3>Workspaces:</h3>
                    <ul>
                        ${p.workspaces.map(w => `
                            <li>
                                <strong>${w.type}</strong> — Capacity: ${w.capacity}, Price: $${w.price}, Lease: ${w.leaseTerm}, Smoking: ${w.smoking}, Availability: ${w.availability}
                            </li>
                        `).join("")}
                    </ul>
                ` : "<p>No workspaces listed.</p>"}
            `;

            // Add the created card to the property list container
            propertyList.appendChild(card);
        });
    }

    // Initially render all properties on page load
    renderProperties(properties);

    // Add event listener for live search input filtering
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();

        // Filter properties based on whether address or neighborhood includes the search query
        const filtered = properties.filter(p =>
            p.address.toLowerCase().includes(query) ||
            p.neighborhood.toLowerCase().includes(query)
        );

        // Render filtered list
        renderProperties(filtered);
    });

    // Add event listener for sort selection changes
    sortSelect.addEventListener("change", () => {
        const value = sortSelect.value;
        // Create a shallow copy of properties array for sorting
        let sorted = [...properties];

        // Sort based on selected criteria
        if (value === "name-asc") {
            sorted.sort((a, b) => a.address.localeCompare(b.address));
        } else if (value === "name-desc") {
            sorted.sort((a, b) => b.address.localeCompare(a.address));
        } else if (value === "price-asc") {
            // Sort by price of first workspace (or 0 if none)
            sorted.sort((a, b) => (a.workspaces?.[0]?.price || 0) - (b.workspaces?.[0]?.price || 0));
        } else if (value === "price-desc") {
            // Sort by price descending of first workspace (or 0 if none)
            sorted.sort((a, b) => (b.workspaces?.[0]?.price || 0) - (a.workspaces?.[0]?.price || 0));
        }

        // Render the sorted list
        renderProperties(sorted);
    });
});
