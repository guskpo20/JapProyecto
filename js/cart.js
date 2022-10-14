const URL = 'https://japceibal.github.io/emercado-api/user_cart/';
const tabla = document.getElementById('tableBody');
let datos = [];
let inputs = '';

async function getData() {
  let data = await fetch(URL + '25801.json');
  data = await data.json();
  let dataLS = JSON.parse(localStorage.getItem('carrito'));
  if (!dataLS) {
    dataLS = [];
  }
  for (const articulo of data.articles) {
    let existente = false;
    for (const articuloLS of dataLS) {
      if (articulo.id === articuloLS.id) {
        existente = true;
      }
    }
    if (!existente) {
      console.log(existente);
      setCart(articulo);
      let newProduct = {
        id: articulo.id,
        name: articulo.name,
        count: 1,
        unitCost: articulo.unitCost,
        currency: articulo.currency,
        image: articulo.image,
      };
      if (JSON.parse(localStorage.getItem('carrito'))) {
        let newCarrito = JSON.parse(localStorage.getItem('carrito'));
        newCarrito = [...newCarrito, newProduct];
        localStorage.setItem('carrito', JSON.stringify(newCarrito));
      } else {
        let newCarrito = [];
        newCarrito.push(newProduct);
        localStorage.setItem('carrito', JSON.stringify(newCarrito));
      }
      location.reload();
    }
    datos.push(articulo);
  }
}

getData();

function getLSData() {
  let data = JSON.parse(localStorage.getItem('carrito'));
  if (!data) {
    data = [];
  }
  for (const articulo of data) {
    setCart(articulo);
  }
  datos.push(...data);
}

getLSData();

function setCart(articulo) {
  if (!articulo) {
    return;
  }
  tabla.innerHTML += `
            <tr>
              <th scope="row">
                <img
                  style="max-width: 100px"
                  class="img-fluid"
                  src="${articulo.image}"
                />
              </th>
              <td class="align-middle">${articulo.name} </td>
              <td class="align-middle">USD <span id="valorUni">${articulo.unitCost}</span></td>
              <td class="align-middle">
                <input min="1" value="${articulo.count}" class="inputAEscuchar" id="${articulo.id}" style="max-width: 50px" type="number"/>
              </td>
              <td class="align-middle">USD <span id="subTotal${articulo.id}"></span></td>
              </tr>
  
  `;
  let subtotalHTML = document.getElementById(`subTotal${articulo.id}`);
  subtotalHTML.innerHTML =
    parseFloat(articulo.unitCost) * parseFloat(articulo.count);
}

function setInputs(data, inputs) {
  for (const input of inputs) {
    input.addEventListener('input', () => {
      if (input.value <= 0) {
        alert('Elija una cantidad positiva de articulos');
      } else {
        let articulo = data.filter(
          (dato) => parseFloat(dato.id) === parseFloat(input.id)
        );
        articulo = articulo[0];

        let subtotalHTML = document.getElementById(`subTotal${articulo.id}`);
        subtotalHTML.innerHTML =
          parseFloat(articulo.unitCost) * parseFloat(input.value);
        //Actualizar el articulo.count del localstorage
        let newCarrito = JSON.parse(localStorage.getItem('carrito'));

        for (let i = 0; i < newCarrito.length; i++) {
          if (newCarrito[i].id === articulo.id) {
            newCarrito[i].count = input.value;
          }
        }
        localStorage.setItem('carrito', JSON.stringify(newCarrito));
      }
    });
  }
}

window.addEventListener('load', (event) => {
  inputs = document.getElementsByClassName('inputAEscuchar');
  setInputs(datos, inputs);
});
