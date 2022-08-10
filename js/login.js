const form = document.getElementById('logForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let user = document.getElementById('email');
  let pass = document.getElementById('password');
  if (user.value) {
    if (pass.value) {
      window.location.href = '/home.html';
    } else {
      pass.classList.toggle('bad-input');
    }
  } else {
    user.classList.toggle('bad-input');
  }
});
