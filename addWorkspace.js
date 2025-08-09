document.addEventListener("DOMContentLoaded", () => {
  // Get the property selection dropdown element
  const propertySelect = document.getElementById("propertySelect");
  // Get the currently logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // If no user is logged in, redirect to login page
  if (!currentUser) {
    alert("You must be logged in to add a workspace.");
    window.location.href = "login.html";
    return;
  }

  // Retrieve all properties from localStorage (or empty array if none)
  let allProperties = JSON.parse(localStorage.getItem("properties") || "[]");
  // Filter properties owned by the logged-in user
  let userProperties = allProperties.filter(p => p.owner === currentUser.email);

  // Function to populate the property select dropdown with user properties
  function populateSelect() {
    // Reset dropdown and add default disabled option
    propertySelect.innerHTML = '<option value="" disabled selected>Select your property</option>';
    
    // If user has no properties, show alert and disable dropdown
    if (userProperties.length === 0) {
      alert("You have no properties yet. Please add one first.");
      propertySelect.disabled = true;
      return;
    }
    
    // Add each user property as an option in the select dropdown
    userProperties.forEach((p) => {
      const option = document.createElement("option");
      option.value = p.id; // property ID as value
      option.textContent = `${p.address} (${p.neighborhood})`; // display address & neighborhood
      propertySelect.appendChild(option);
    });

    // Enable dropdown if properties are available
    propertySelect.disabled = false;
  }

  // Populate the select dropdown on page load
  populateSelect();

  // Get the form element
  const form = document.getElementById("workspaceForm");

  // Listen for form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent page reload

    // Basic validation for select inputs
    if (!propertySelect.value) {
      alert("Please select a property.");
      return;
    }
    if (!form.smoking.value) {
      alert("Please select smoking option.");
      return;
    }
    if (!form.availability.value) {
      alert("Please select availability.");
      return;
    }

    // Create a new workspace object with form data
    const workspace = {
      type: form.type.value.trim(),
      capacity: Number(form.capacity.value),
      smoking: form.smoking.value,
      availability: form.availability.value,
      leaseTerm: form.leaseTerm.value.trim(),
      price: Number(form.price.value),
      owner: currentUser.email
    };

    // Validate required fields and number ranges
    if (
      !workspace.type ||
      workspace.capacity <= 0 ||
      !workspace.leaseTerm ||
      workspace.price < 0
    ) {
      alert("Please fill out all fields with valid values.");
      return;
    }

    // Find index of the selected property in the allProperties array
    const propertyId = Number(propertySelect.value);
    const index = allProperties.findIndex(p => p.id === propertyId);

    if (index === -1) {
      alert("Selected property not found.");
      return;
    }

    // Initialize the workspaces array if it doesn't exist
    if (!Array.isArray(allProperties[index].workspaces)) {
      allProperties[index].workspaces = [];
    }

    // Add the new workspace to the selected property's workspace list
    allProperties[index].workspaces.push(workspace);

    // Save the updated properties back to localStorage
    localStorage.setItem("properties", JSON.stringify(allProperties));

    alert("Workspace added successfully!");

    // Reset the form fields
    form.reset();

    // Reset the property select dropdown to the default option
    propertySelect.selectedIndex = 0;

    // Redirect to the user's properties page
    window.location.href = "myProperties.html";
  });
});
