let item = localStorage.getItem('itemID');
let container = document.getElementById('container');
let comentariosContainer = document.getElementById('comments');
let enviarComentBtn = document.getElementById('enviarComent');
let relatedContainer = document.getElementById('relatedContainer');
let comprarBtn = '';

async function getProduct(id) {
  let product = await fetch(
    `https://japceibal.github.io/emercado-api/products/${id}.json`
  );
  product = await product.json();
  let comments = await fetch(
    `https://japceibal.github.io/emercado-api/products_comments/${id}.json`
  );
  comments = await comments.json();
  let commentsHtml = '';
  for (const comment of comments) {
    let stars = '';
    let emptyStars = 5;
    for (let i = 0; i < comment.score; i++) {
      stars += `<span class="fa fa-star checked"></span>`;
      emptyStars = emptyStars - 1;
    }

    for (let o = 0; o < emptyStars; o++) {
      stars += `<span class="fa fa-star"></span>`;
    }
    commentsHtml += `
    <div class="comment">
        <div class="commentInfo">
        <b>${comment.user}</b> - <p>${comment.dateTime}</p> - <p>${stars}</p>
        </div>
        <p>${comment.description}</p>
    </div>`;
  }

  comentariosContainer.innerHTML += commentsHtml;

  let images = '';
  for (const image of product.images) {
    images += `<img class="productImage" src="${image}">`;
  }
  container.innerHTML = `
  <div class="product">
  <div class="productInfo">
          <div class="d-flex justify-content-between">
            <h2>${product.name}</h2>
            <button id="agregarAlCarrito" class="agregaAlCarrito">Comprar</button>
          </div>
          <h4 id="mensajeComprado" class="sacarAgregadoAlCarrito">Agregado al Carrito</h4>
          <hr/>
          <b>Precio</b>
          <p>${product.currency} ${product.cost}</p>
          <b>Descripcion</b>
          <p>${product.description} </p>
          <b>Categoria</b>
          <p>${product.category}</p>
          <b>Cantidad de vendidos</b>
          <p>${product.soldCount}</p>
          <b>Imagenes Ilustrativas</b>
          </div>
          <div class="imgContainer">
            ${images}
          </div>
        </div>
      </div>
  
  `;
  comprarBtn = document.getElementById('agregarAlCarrito');
  comprarBtn.addEventListener('click', () => {
    let newProduct = {
      id: product.id,
      name: product.name,
      count: 1,
      unitCost: product.cost,
      currency: product.currency,
      image: product.images[0],
    };
    console.log(newProduct);
    if (JSON.parse(localStorage.getItem('carrito'))) {
      let newCarrito = JSON.parse(localStorage.getItem('carrito'));
      newCarrito = [...newCarrito, newProduct];
      localStorage.setItem('carrito', JSON.stringify(newCarrito));
    } else {
      let newCarrito = [];
      newCarrito.push(newProduct);
      localStorage.setItem('carrito', JSON.stringify(newCarrito));
    }

    let mensaje = document.getElementById('mensajeComprado');
    mensaje.classList.add('agregadoAlCarrito');
    mensaje.classList.remove('sacarAgregadoAlCarrito');
    setTimeout(() => {
      mensaje.classList.remove('agregadoAlCarrito');
      mensaje.classList.add('sacarAgregadoAlCarrito');
    }, 2000);
  });
  let productosRelacionados = product.relatedProducts;
  for (let i = 0; i < productosRelacionados.length; i++) {
    if (i === 0) {
      relatedContainer.innerHTML = `
      <div class="carousel-item active">
              <img src="${productosRelacionados[i].image}" class="d-block w-100"/>
              <div class="carousel-caption d-none d-md-block">
                <h5 class="relatedName">${productosRelacionados[i].name}</h5>
                <button onclick="guardarId(${productosRelacionados[i].id})">Ir!</button>
              </div>
            </div>`;
    } else {
      relatedContainer.innerHTML += `
      <div class="carousel-item">
              <img src="${productosRelacionados[i].image}" class="d-block w-100"/>
              <div class="carousel-caption d-none d-md-block">
                <h5 class="relatedName">${productosRelacionados[i].name}</h5>
                <button onclick="guardarId(${productosRelacionados[i].id})">Ir!</button>
              </div>
            </div>`;
    }
  }
}

getProduct(item);

function guardarId(relatedId) {
  localStorage.setItem('itemID', relatedId);
  window.location = 'product-info.html';
}

enviarComentBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (localStorage.getItem('email')) {
    const date = new Date();
    let [month, day, year] = [
      date.getMonth(),
      date.getDate(),
      date.getFullYear(),
    ];
    let [hour, minutes, seconds] = [
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ];
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }

    if (hour < 10) {
      hour = '0' + hour;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    let hoy =
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hour +
      ':' +
      minutes +
      ':' +
      seconds;
    let comentario = document.getElementById('opinion').value;
    let estrellas = document.getElementById('puntuacion').value;

    let stars = '';
    let emptyStars = 5;
    for (let i = 0; i < estrellas; i++) {
      stars += `<span class="fa fa-star checked"></span>`;
      emptyStars = emptyStars - 1;
    }

    for (let o = 0; o < emptyStars; o++) {
      stars += `<span class="fa fa-star"></span>`;
    }

    agregarComentario(localStorage.getItem('email'), hoy, stars, comentario);
    document.getElementById('opinion').value = '';
    document.getElementById('puntuacion').value = '';
  } else {
    alert('Debes estas loggeado para comentar!');
    window.location = 'index.html';
  }
});

//Tiene que agregar el comentario arriba del todo, quizas con el display puedo hacer que los muestre al reves o con un sort y la fecha
function agregarComentario(user, dateTime, stars, comment) {
  let comentariosActual = comentariosContainer.innerHTML;
  comentariosContainer.innerHTML = `
    <div class="comment">
        <div class="commentInfo">
        <b>${user}</b> - <p>${dateTime}</p> - <p>${stars}</p>
        </div>
        <p>${comment}</p>
    </div>`;
  comentariosContainer.innerHTML += comentariosActual;
}
