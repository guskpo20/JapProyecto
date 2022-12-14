const form = document.getElementById('logForm');
const errorMsg = document.getElementById('error');

//Hacer la funcion para chequear el localStorage localStorage.getItem('email') si ya existe redireccionar
if (localStorage.getItem('email')) {
  console.log('Entramos');
  window.location = 'home.html';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let user = document.getElementById('email');
  let pass = document.getElementById('password');
  if (user.value && pass.value) {
    localStorage.setItem('email', user.value);
    window.location = 'home.html';
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

function handleCredentialResponse(response) {
  const responsePayload = decodeJwtResponse(response.credential);
  console.log('ID: ' + responsePayload.sub);
  console.log('Email: ' + responsePayload.email);
  localStorage.setItem('email', responsePayload.email);
  window.location = 'home.html';
}

//Esta funcion no valida el token, solo extrae la parte del json que necesito con la info de google, puede haber sido manipulada
//tengo que decodificar el JWT token que me da google
function decodeJwtResponse(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

//https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
