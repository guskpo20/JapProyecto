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

function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  /*var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());*/
  window.location.href = '/home.html';

  // The ID token you need to pass to your backend:
  //var id_token = googleUser.getAuthResponse().id_token;
  //console.log("ID Token: " + id_token);
} //funcion predeterminada para ver funciones del google login
