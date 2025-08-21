document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  const messageDiv = document.getElementById('loginMessage');
  const show = (m, bad = true) => { messageDiv.textContent = m; messageDiv.style.color = bad ? 'red' : 'green'; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    messageDiv.textContent = '';

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const out = await res.json();
      if (!out.ok) return show(out.error || 'Login failed');

      // Save token + user for later
      localStorage.setItem('authToken', JSON.stringify(out.data.token));
      localStorage.setItem('loggedInUser', JSON.stringify(out.data.user));

      show(`Welcome back, ${out.data.user.name}! Redirecting...`, false);
      setTimeout(() => {
        if (out.data.user.role === 'owner') window.location.href = 'myProperties.html';
        else window.location.href = 'coworker.html';
      }, 1000);
    } catch {
      show('Network error. Try again.');
    }
  });
});
