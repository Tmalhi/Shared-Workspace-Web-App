// Retrieve existing users from localStorage or initialize as empty array
let users = JSON.parse(localStorage.getItem('users')) || [];

document.addEventListener('DOMContentLoaded', function () {
  // Get references to the signup form and message display element
  const form = document.getElementById('signupForm');
  const messageDiv = document.getElementById('formMessage');

  // Helper function to show messages to the user
  // msg: message string, isError: boolean to set message color (red for error, green for success)
  function showMessage(msg, isError = true) {
    messageDiv.textContent = msg;
    messageDiv.style.color = isError ? 'red' : 'green';
  }

  // Event listener for form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission behavior (page reload)

    // Get trimmed values from form inputs
    const fullName = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const number = document.getElementById('phone').value.trim();
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Clear any previous messages
    messageDiv.textContent = ''; 

    // Check if passwords match
    if (password !== confirmPassword) {
      showMessage("Passwords do not match!");
      return; // Stop further processing
    }

    // Validate that a role has been selected
    if (!role) {
      showMessage("Please select a role.");
      return;
    }

    // Check if the email is already registered (case insensitive)
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      showMessage("This email is already registered. Please login or use another email.");
      return;
    }

    // Create a new user object with the collected data
    const user = {
      name: fullName,
      email: email,
      phone: number,
      role: role,
      password: password
    };

    // Add the new user to the users array
    users.push(user);

    // Save the updated users array back to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message in green text
    showMessage("Sign-up successful! Redirecting to login...", false);

    // Reset the form fields
    form.reset();

    // Redirect to login page after 2 seconds
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000); 
  });
});
