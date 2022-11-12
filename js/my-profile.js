let formulario = document.getElementById('formulario');
let nombre = document.getElementById('name');
let segundoNombre = document.getElementById('secondName');
let apellido = document.getElementById('lastName');
let segundoApellido = document.getElementById('secondLastName');
let email = document.getElementById('email');
let img = document.getElementById('imagen');
let imgPerfil = document.getElementById('profileImg');
let telefono = document.getElementById('telefono');
let imgURL = '';
let alertaCorrecta = document.getElementById('correctAlert');

function cargarPerfilLS() {
  let emailLogeado = localStorage.getItem('email');
  email.value = emailLogeado;
  if (localStorage.getItem('perfil')) {
    let perfiles = JSON.parse(localStorage.getItem('perfil'));
    for (const perfil of perfiles) {
      if (emailLogeado === perfil.email) {
        let {
          nombre: nombreLS,
          segundoNombre: segundoNombreLS,
          apellido: apellidoLS,
          segundoApellido: segundoApellidoLS,
          email: emailLS,
          img: imgLS,
          telefono: telefonoLS,
        } = perfil;

        nombre.value = nombreLS;
        segundoNombre.value = segundoNombreLS;
        apellido.value = apellidoLS;
        segundoApellido.value = segundoApellidoLS;
        email.value = emailLS;
        imgPerfil.src = imgLS;
        telefono.value = telefonoLS;
      }
    }
  }
}

cargarPerfilLS();

//transformar la imagen a base64
img.addEventListener('change', (e) => {
  const reader = new FileReader();

  reader.addEventListener('load', () => {
    imgURL = reader.result;
  });

  reader.readAsDataURL(e.target.files[0]);
});

formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  if (nombre.value && apellido.value && email.value) {
    let perfilCompleto = {
      nombre: nombre.value,
      segundoNombre: segundoNombre.value,
      apellido: apellido.value,
      segundoApellido: segundoApellido.value,
      email: email.value,
      img: imgURL,
      telefono: telefono.value,
    };
    let arregloLS = JSON.parse(localStorage.getItem('perfil')) || [];
    let index = 1;
    let repetido = false;
    if (JSON.parse(localStorage.getItem('perfil'))) {
      for (let i = 0; i < arregloLS.length; i++) {
        if (perfilCompleto.email === arregloLS[i].email) {
          repetido = true;
          index = i;
        }
      }
      if (repetido) {
        if (perfilCompleto.img === '') {
          perfilCompleto.img = arregloLS[index].img;
        }
        arregloLS[index] = perfilCompleto;
        localStorage.setItem('perfil', JSON.stringify(arregloLS));
      } else {
        if (perfilCompleto.img === '') {
          perfilCompleto.img = './img/img_perfil.png';
        }
        arregloLS = [...arregloLS, perfilCompleto];
        localStorage.setItem('perfil', JSON.stringify(arregloLS));
      }
    } else {
      if (perfilCompleto.img === '') {
        perfilCompleto.img = './img/img_perfil.png';
      }
      arregloLS = [...arregloLS, perfilCompleto];
      localStorage.setItem('perfil', JSON.stringify(arregloLS));
    }
  }
  alertaCorrecta.classList.remove('d-none');
  setTimeout(() => {
    location.reload();
  }, 2000);
});
