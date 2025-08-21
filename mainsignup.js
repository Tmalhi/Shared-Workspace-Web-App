document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signupForm');
  const messageDiv = document.getElementById('formMessage');

  const show = (m, bad = true) => {
    messageDiv.textContent = m;
    messageDiv.style.color = bad ? 'red' : 'green';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const number = document.getElementById('phone').value.trim();
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if (password !== confirmPassword) return show('Passwords do not match!');
    if (!role) return show('Please select a role.');

    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, phone: number, role, password })
      });
      const out = await res.json();
      if (!out.ok) return show(out.error || 'Sign-up failed');

      show('Sign-up successful! Redirecting to login...', false);
      setTimeout(() => (window.location.href = 'login.html'), 1200);
    } catch (err) {
      show('Network error. Try again.');
    }
  });
});
