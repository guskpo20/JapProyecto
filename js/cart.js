const URL = 'https://japceibal.github.io/emercado-api/user_cart/';
const tabla = document.getElementById('tableBody');
let datos = [];
let inputs = '';
let envioOpciones = document.getElementsByName('flexRadioDefault');
let opcionEnvio = '';
let formasDePago = document.getElementsByName('flexRadioDefaultCredito');
let formCompra = document.getElementById('formCompra');

async function getData() {
  if(!JSON.parse(localStorage.getItem('carrito'))){
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
        setearTotales()
      }
      datos.push(articulo);
    }
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
            <tr id="item${articulo.id}">
              <th scope="row">
                <img
                  style="max-width: 100px"
                  class="img-fluid"
                  src="${articulo.image}"
                />
              </th>
              <td class="align-middle">${articulo.name} </td>
              <td class="align-middle">${articulo.currency} <span id="valorUni">${articulo.unitCost}</span></td>
              <td class="align-middle">
                <input min="1" value="${articulo.count}" class="inputAEscuchar" id="${articulo.id}" style="max-width: 50px" type="number"/>
              </td>
              <td class="align-middle">USD <span class="subtotales" id="subTotal${articulo.id}"></span></td>
              <td class="align-middle"><button class="btn-danger borrarArticulo" name="${articulo.id}">Eliminar</button></td>
              </tr>
  
  `;
  let nuevoPrecio = articulo.unitCost;
  if (articulo.currency != 'USD') {
    nuevoPrecio = parseFloat(articulo.unitCost) / 40;
  }
  let subtotalHTML = document.getElementById(`subTotal${articulo.id}`);
  subtotalHTML.innerHTML = nuevoPrecio * parseFloat(articulo.count);
  
}

function setBorrar(){
  let eliminarBtns = document.getElementsByClassName("borrarArticulo")
  for (const eliminarBtn of eliminarBtns) {
    eliminarBtn.addEventListener("click", () =>{
      if (JSON.parse(localStorage.getItem('carrito'))) {
        let articuloBorrar =""
        let carrito = JSON.parse(localStorage.getItem('carrito'));
        let newCarrito = [];
        for (const item of carrito) {
          if(parseFloat(item.id) === parseFloat(eliminarBtn.name)){
            articuloBorrar = document.getElementById(`item${item.id}`)
          }else{
            newCarrito.push(item)
          }
        }
        localStorage.setItem('carrito', JSON.stringify(newCarrito));
        tabla.removeChild(articuloBorrar);
        setearTotales()
      }
      
    })
  }
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

        let subtotalArt = articulo.unitCost;
        if (articulo.currency != 'USD') {
          subtotalArt = parseFloat(subtotalArt) * 40;
        }
        let subtotalHTML = document.getElementById(`subTotal${articulo.id}`);
        subtotalHTML.innerHTML =
          parseFloat(subtotalArt) * parseFloat(input.value);
        //Actualizar el articulo.count del localstorage
        let newCarrito = JSON.parse(localStorage.getItem('carrito'));

        for (let i = 0; i < newCarrito.length; i++) {
          if (newCarrito[i].id === articulo.id) {
            newCarrito[i].count = input.value;
          }
        }
        localStorage.setItem('carrito', JSON.stringify(newCarrito));
        setearTotales(inputs);
      }
    });
  }
}

window.addEventListener('load', (event) => {
  inputs = document.getElementsByClassName('inputAEscuchar');
  setInputs(datos, inputs);
  setearTotales();
  let subtotal = document.getElementById('subtotal');
  let costoEnvio = document.getElementById('costoEnvio');
  opcionEnvio = 0.15;
  costoEnvio.innerHTML = Math.round(
    parseFloat(subtotal.innerHTML) * opcionEnvio
  );
  setBorrar()
  formCompra.addEventListener('submit', (e) => {
    e.preventDefault();

    //Hay articulos para comprar
    let hayArticulos = false;
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    if(carrito.length > 0 ){
      hayArticulos=true;
    }

    //Envio name = flexRadioDefault, tiene que estar chequeada alguna forma de envio
    let contador = 0;
    for (const opcion of envioOpciones) {
      if (!opcion.checked) {
        contador++;
      }
      if (contador >= 3) {
        alert('Debe seleccionar un tipo de envio');
      }
    }

    //SI todosLosArticulosCorrectos !!!!
    let articulos = document.getElementsByClassName('inputAEscuchar');
    let todosLosArticulosCorrectos = true;
    for (const articulo of articulos) {
      if (articulo.value < 1) {
        todosLosArticulosCorrectos = false;
      }
    }

    //Chequear que no esten vacios, SI chequeados todos true
    let chequeados = [true, true, true];
    let inputCalle = document.getElementById('inputEmail4');
    let inputNumero = document.getElementById('inputNumber4');
    let inputEsquina = document.getElementById('inputCorner');

    //Agregar un eventlistener a los 3 inputs de arriba para que cuando se escriba algo les quite la class invalid y esconda al texto.
    if (!inputCalle.value) {
      chequeados[0] = false;
    }
    if (!inputNumero.value) {
      chequeados[1] = false;
    }
    if (!inputEsquina.value) {
      chequeados[2] = false;
    }
    //Se tiene que seleccionar una forma de pago
    let formaDePagoTexto = document.getElementById('formaDePagoTexto');
    let metodoDePagoSeleccionado = false;
    if (formaDePagoTexto.innerText !== 'No Has Seleccionado') {
      metodoDePagoSeleccionado = true;
    } else {
      metodoDePagoSeleccionado = false;
    }
    // y tienen que estar todos los campos llenos, SI metodoDePagoLleno
    let metodoDePagoLleno = false;
    if (formaDePagoTexto.innerText === 'Tarjeta de Credito') {
      let tarjetaInput = document.getElementById('tarjeta');
      let codigoInput = document.getElementById('codigo');
      let vencimiento = document.getElementById('vencimiento');
      if (tarjetaInput.value && codigoInput.value && vencimiento.value) {
        metodoDePagoLleno = true;
      }
    } else if (formaDePagoTexto.innerText === 'Transferencia Bancaria') {
      let cuentaInput = document.getElementById('cuenta');
      if (cuentaInput.value) {
        metodoDePagoLleno = true;
      }
    }

    if (
      contador < 3 &&
      todosLosArticulosCorrectos &&
      chequeados[0] &&
      chequeados[1] &&
      chequeados[2] &&
      metodoDePagoLleno &&
      hayArticulos
    ) {
      let mensaje = document.getElementById('compraRealizada');
      mensaje.classList.remove('escondido');
      setTimeout(() => {
        mensaje.classList.add('escondido');
      }, 2000);
      inputCalle.classList.remove('inputInvalido');
      let textoCalleInvalid = document.getElementById('invalidCalle');
      textoCalleInvalid.classList.add('escondido');
      inputNumero.classList.remove('inputInvalido');
      let textoNumeroInvalid = document.getElementById('invalidNumero');
      textoNumeroInvalid.classList.add('escondido');
      inputEsquina.classList.remove('inputInvalido');
      let textoEsquinaInvalid = document.getElementById('invalidEsquina');
      textoEsquinaInvalid.classList.add('escondido');
      let textoPagoInvalido = document.getElementById('invalidPago');
      textoPagoInvalido.classList.add('escondido');
    } else {
      if (!todosLosArticulosCorrectos) {
        alert('Todos los articulos tienen que tener cantidades positivas!');
      }
      if (!chequeados[0]) {
        inputCalle.classList.add('inputInvalido');
        let textoCalleInvalid = document.getElementById('invalidCalle');
        textoCalleInvalid.classList.remove('escondido');
      } else {
        inputCalle.classList.remove('inputInvalido');
        let textoCalleInvalid = document.getElementById('invalidCalle');
        textoCalleInvalid.classList.add('escondido');
      }
      if (!chequeados[1]) {
        inputNumero.classList.add('inputInvalido');
        let textoNumeroInvalid = document.getElementById('invalidNumero');
        textoNumeroInvalid.classList.remove('escondido');
      } else {
        inputNumero.classList.remove('inputInvalido');
        let textoNumeroInvalid = document.getElementById('invalidNumero');
        textoNumeroInvalid.classList.add('escondido');
      }
      if (!chequeados[2]) {
        inputEsquina.classList.add('inputInvalido');
        let textoEsquinaInvalid = document.getElementById('invalidEsquina');
        textoEsquinaInvalid.classList.remove('escondido');
      } else {
        inputEsquina.classList.remove('inputInvalido');
        let textoEsquinaInvalid = document.getElementById('invalidEsquina');
        textoEsquinaInvalid.classList.add('escondido');
      }
      if (!metodoDePagoLleno) {
        let textoPagoInvalido = document.getElementById('invalidPago');
        textoPagoInvalido.classList.remove('escondido');
      } else {
        let textoPagoInvalido = document.getElementById('invalidPago');
        textoPagoInvalido.classList.add('escondido');
      }
      if(!hayArticulos){
        alert("Debes comprar almenos un articulo")
      }
    }
  });
});

let opcionesDePago = document.getElementsByName('flexRadioDefaultCredito');
for (const opcion of opcionesDePago) {
  opcion.addEventListener('change', () => {
    if (opcion.checked) {
      let texto = '';
      if (opcion.value === 'credito') {
        texto = 'Tarjeta de Credito';
      } else {
        texto = 'Transferencia Bancaria';
      }
      let formaDePagoTexto = document.getElementById('formaDePagoTexto');
      formaDePagoTexto.innerText = texto;
    }
  });
}

for (const opcion of envioOpciones) {
  opcion.addEventListener('change', () => {
    if (opcion.checked) {
      let subtotal = document.getElementById('subtotal');
      let costoEnvio = document.getElementById('costoEnvio');
      opcionEnvio = opcion.value;
      costoEnvio.innerHTML = Math.round(
        parseFloat(subtotal.innerHTML) * opcionEnvio
      );
      let total = document.getElementById('total');
      total.innerHTML =
        parseFloat(subtotal.innerHTML) + parseFloat(costoEnvio.innerHTML);
    }
  });
}

function setearTotales() {
  let subtotal = document.getElementById('subtotal');
  let total = document.getElementById('total');
  let subtotales = document.getElementsByClassName('subtotales');
  let costoEnvio = document.getElementById('costoEnvio');
  let subtotalNumero = 0;
  for (const input of subtotales) {
    subtotalNumero += parseFloat(input.innerHTML);
  }
  subtotal.innerHTML = subtotalNumero;
  for (const opcion of envioOpciones) {
    if (opcion.checked) {
      opcionEnvio = opcion.value;
      costoEnvio.innerHTML = Math.round(
        parseFloat(subtotal.innerHTML) * opcionEnvio
      );
    }
  }
  total.innerHTML =
    parseFloat(subtotal.innerHTML) + parseFloat(costoEnvio.innerHTML);
}

//vencimiento codigo tarjeta
for (const forma of formasDePago) {
  forma.addEventListener('change', () => {
    let numeroDeCuenta = document.getElementById('cuenta');
    let vencimiento = document.getElementById('vencimiento');
    let codigo = document.getElementById('codigo');
    let tarjeta = document.getElementById('tarjeta');
    if (formasDePago[0].checked) {
      vencimiento.disabled = false;
      codigo.disabled = false;
      tarjeta.disabled = false;
      numeroDeCuenta.disabled = true;
    } else {
      vencimiento.disabled = true;
      codigo.disabled = true;
      tarjeta.disabled = true;
      numeroDeCuenta.disabled = false;
    }
  });
}
