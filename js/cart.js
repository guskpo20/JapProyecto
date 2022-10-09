const URL = 'https://japceibal.github.io/emercado-api/user_cart/';
const tabla = document.getElementById('tableBody');
let datos = [];
let inputs = '';
let repetidos = [];

async function getData() {
  let data = await fetch(URL + '25801.json');
  data = await data.json();
  for (const articulo of data.articles) {
    setCart(articulo);
  }
  datos.push(...data.articles);
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
  let articuloRepetido = document.getElementById(articulo.id);
  if (articuloRepetido) {
    repetidos.push(articulo);
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
                <input min="1" value="1" class="inputAEscuchar" id="${articulo.id}" style="max-width: 50px" type="number"/>
              </td>
              <td class="align-middle">USD <span id="subTotal${articulo.id}"></span></td>
              </tr>
  
  `;
  let subtotalHTML = document.getElementById(`subTotal${articulo.id}`);
  subtotalHTML.innerHTML = parseFloat(articulo.unitCost);
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
      }
    });
  }
}

window.addEventListener('load', (event) => {
  inputs = document.getElementsByClassName('inputAEscuchar');
  setInputs(datos, inputs);
  for (const repetido of repetidos) {
    let input = document.getElementById(repetido.id);
    input.value++;
    let subtotalHTML = document.getElementById(`subTotal${repetido.id}`);
    subtotalHTML.innerHTML =
      parseFloat(repetido.unitCost) * parseFloat(input.value);
  }
});
