// Wait until the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
  // Get the login form element by its ID
  const form = document.getElementById('loginForm');
  // Get the div element where login messages will be shown
  const messageDiv = document.getElementById('loginMessage');

  // Function to display messages to the user
  // msg: message text, isError: boolean to set message color (red for error, green for success)
  function showMessage(msg, isError = true) {
    messageDiv.textContent = msg;  // Set the message text
    messageDiv.style.color = isError ? 'red' : 'green';  // Set text color based on error or success
  }

  // Add submit event listener to the form
  form.addEventListener('submit', function (e) {
    e.preventDefault();  // Prevent the default form submission behavior (page reload)

    // Get the entered email and password values, trimming any extra spaces
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    messageDiv.textContent = ''; // Clear any previous messages

    // Retrieve users from localStorage or initialize empty array if none found
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Find the user with matching email (case-insensitive)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // If no user found with that email, show error and clear password input
    if (!user) {
      showMessage('User not found. Please sign up first.');
      form.password.value = '';
      return;
    }

    // If password does not match stored password, show error and clear password input
    if (user.password !== password) {
      showMessage('Incorrect password. Please try again.');
      form.password.value = '';
      return;
    }

    // If login successful, show welcome message with user's name (in green)
    showMessage(`Welcome back, ${user.name}! Redirecting...`, false);

    // Save the logged in user info to localStorage for session management
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // After 1.5 seconds, redirect user to their respective dashboard based on role
    setTimeout(() => {
      if (user.role === "owner") {
        window.location.href = 'myProperties.html';  // Owner dashboard
      } else if (user.role === "coworker") {
        window.location.href = 'coworker.html';  // Coworker dashboard
      }
    }, 1500);
  });
});
