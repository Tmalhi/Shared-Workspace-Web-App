document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the currently logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // If no user is logged in, redirect to login page with alert
  if (!currentUser) {
    alert("You must be logged in to add a property.");
    window.location.href = "login.html";
    return; // Stop further execution
  }

  // Get the property form element by its ID
  const form = document.getElementById("propertyForm");

  // Add event listener for form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)

    // Validate parking selection; if none selected, show alert and stop
    if (!form.parking.value) {
      alert("Please select a parking option.");
      return;
    }
    // Validate transit selection similarly
    if (!form.transit.value) {
      alert("Please select a transit option.");
      return;
    }

    // Create a new property object with form data and metadata
    const newProperty = {
      id: Date.now(), // Unique ID based on current timestamp
      address: form.address.value.trim(), // Remove extra whitespace
      neighborhood: form.neighborhood.value.trim(),
      sqft: Number(form.sqft.value), // Convert sqft input to number
      parking: form.parking.value,
      transit: form.transit.value,
      owner: currentUser.email, // Link property to current user by email
      workspaces: [], // Initialize empty workspaces array
    };

    // Further validate required inputs
    if (
      !newProperty.address ||
      !newProperty.neighborhood ||
      !newProperty.sqft ||
      newProperty.sqft <= 0
    ) {
      alert("Please fill out all fields with valid values.");
      return;
    }

    // Retrieve existing properties from localStorage (or empty array if none)
    const properties = JSON.parse(localStorage.getItem("properties") || "[]");
    // Add the new property to the list
    properties.push(newProperty);
    // Save the updated properties array back to localStorage
    localStorage.setItem("properties", JSON.stringify(properties));

    // Notify the user of successful addition
    alert("Property added successfully!");
    // Reset the form fields
    form.reset();

    // Redirect the user to their properties page
    window.location.href = "myProperties.html";
  });
});
