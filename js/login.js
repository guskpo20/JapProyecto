const form = document.getElementById('logForm');
const errorMsg = document.getElementById('error');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let user = document.getElementById('email');
  let pass = document.getElementById('password');
  if (user.value && pass.value) {
    window.location.href = '/home.html';
    errorMsg.innerHTML = '';
  } else {
    if (!user.value) {
      if (!user.classList.contains('bad-input')) {
        user.classList.toggle('bad-input');
        if (!user.classList.contains('input-style-none')) {
          user.classList.add('input-style-none');
        }
      }
    }
    if (!pass.value) {
      if (!pass.classList.contains('bad-input')) {
        pass.classList.toggle('bad-input');
        if (!pass.classList.contains('input-style-none')) {
          pass.classList.add('input-style-none');
        }
      }
    }
    if (errorMsg.classList.contains('error')) {
      errorMsg.classList.toggle('error');
      errorMsg.innerHTML += `Ingrese datos requeridos!`;
    }

    if (user.value) {
      if (user.classList.contains('bad-input')) {
        user.classList.remove('bad-input');
        user.classList.remove('input-style-none');
      }
    }
    if (pass.value) {
      if (pass.classList.contains('bad-input')) {
        pass.classList.remove('bad-input');
        pass.classList.remove('input-style-none');
      }
    }
  }
});
