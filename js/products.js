const itemsContainer = document.getElementById('container');
let nombreCat = document.getElementById('nombreCat');
async function getData() {
  let promise = await fetch(
    `https://japceibal.github.io/emercado-api/cats_products/${localStorage.getItem(
      'catID'
    )}.json`
  );
  let data = await promise.json();
  nombreCat.innerText = data.catName;
  setHtml(data.products);
}
let ids = [];

function setHtml(data) {
  itemsContainer.innerHTML = '';
  for (const car of data) {
    itemsContainer.innerHTML += `
    
          <a  class="item" id="${car.id}">
            <img src="${car.image}" alt="Foto de ${car.name}" />
            <div class="item-info">
                <div class="item-info-primerRenglon">
                    <h3><span class="nombre">${car.name}</span> - ${car.currency}<span class="costo">${car.cost}</span></h3>
                    <p class="cantidadVendidos">${car.soldCount} vendidos</p>
                </div>
                <p class="descriptionItem">${car.description}</p>
            </div>
          </a>
        `;
    ids.push(car.id);
    for (const id of ids) {
      let item = document.getElementById(id);
      item.addEventListener('click', () => {
        localStorage.setItem('itemID', id);
        window.location.href = '../product-info.html';
      });
    }
  }
}

getData();

//ponerles un eventlistener que guarde el id del clickeado

//botones de ordenar alfabetico
let alfabeticoBtn = document.getElementById('sortAsc');
let contAlfabeticoBtn = document.getElementById('sortDesc');

alfabeticoBtn.addEventListener('click', () => {
  ordenarListar(true);
});

contAlfabeticoBtn.addEventListener('click', () => {
  ordenarListar(false);
});

function ordenarListar(enOrden) {
  let elementos, i, cambiando, b, deboCambiar;
  elementos = document.getElementsByClassName('item');
  cambiando = true;
  while (cambiando) {
    cambiando = false;
    b = elementos;
    for (i = 0; i < b.length - 1; i++) {
      deboCambiar = false;

      if (enOrden) {
        if (
          //se cumple este if,sale del for y cambia los elementos de lugar
          b[i].getElementsByClassName('costo')[0].innerHTML.toLowerCase() >
          b[i + 1].getElementsByClassName('costo')[0].innerHTML.toLowerCase()
        ) {
          deboCambiar = true;
          break;
        }
      } else if (!enOrden) {
        if (
          b[i].getElementsByClassName('costo')[0].innerHTML.toLowerCase() <
          b[i + 1].getElementsByClassName('costo')[0].innerHTML.toLowerCase()
        ) {
          deboCambiar = true;
          break;
        }
      }
    }

    if (deboCambiar) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      cambiando = true;
    }
  }
}

let rangoMin = document.getElementById('rangeFilterCountMin');
let rangoMax = document.getElementById('rangeFilterCountMax');
let filtrarBtn = document.getElementById('rangeFilterCount');
let clearRangeFilter = document.getElementById('clearRangeFilter');
//les pongo display none a los que no cumplan el filtro
filtrarBtn.addEventListener('click', () => {
  if (rangoMin.value <= rangoMax.value) {
    let elementos = document.getElementsByClassName('item');
    for (const elemento of elementos) {
      let costo = elemento.getElementsByClassName('costo')[0].innerText;
      if (
        parseInt(costo) >= rangoMin.value &&
        parseInt(costo) <= rangoMax.value
      ) {
        elemento.style.display = 'flex';
      } else {
        elemento.style.display = 'none';
      }
    }
  }
});
//les pongo a todos display flex para que aparezcan todos
clearRangeFilter.addEventListener('click', () => {
  let elementos = document.getElementsByClassName('item');
  for (const elemento of elementos) {
    elemento.style.display = 'flex';
  }
});

let filtroPorCantidadBtn = document.getElementById('sortByCount');
//es la misma funcion que con los nombres pero por cantidad
filtroPorCantidadBtn.addEventListener('click', () => {
  var elementos,
    i,
    cambiando,
    b,
    deboCambiar,
    dir,
    contadorCambios = 0;
  elementos = document.getElementsByClassName('item');
  cambiando = true;
  dir = 'desc';
  while (cambiando) {
    cambiando = false;
    b = elementos;
    for (i = 0; i < b.length - 1; i++) {
      deboCambiar = false;
      if (dir == 'asc') {
        if (
          b[i]
            .getElementsByClassName('cantidadVendidos')[0]
            .innerHTML.toLowerCase() >
          b[i + 1]
            .getElementsByClassName('cantidadVendidos')[0]
            .innerHTML.toLowerCase()
        ) {
          deboCambiar = true;
          break;
        }
      } else if (dir == 'desc') {
        if (
          b[i]
            .getElementsByClassName('cantidadVendidos')[0]
            .innerHTML.toLowerCase() <
          b[i + 1]
            .getElementsByClassName('cantidadVendidos')[0]
            .innerHTML.toLowerCase()
        ) {
          deboCambiar = true;
          break;
        }
      }
    }
    if (deboCambiar) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      cambiando = true;
      contadorCambios++;
    } else {
      if (contadorCambios == 0 && dir == 'desc') {
        dir = 'asc';
        cambiando = true;
      }
    }
  }
});

let nombreInput = document.getElementById('inputSearch');
// me fijo si el input del usuario esta incluido en el nombre, si no esta display none
nombreInput.addEventListener('input', () => {
  let elementos = document.getElementsByClassName('item');
  for (const elemento of elementos) {
    let nombre = elemento
      .getElementsByClassName('nombre')[0]
      .innerText.toLowerCase();
    let descripcion = elemento
      .getElementsByClassName('descriptionItem')[0]
      .innerText.toLowerCase();
    let input = nombreInput.value.toLowerCase();
    if (!nombre.includes(input) && !descripcion.includes(input)) {
      elemento.style.display = 'none';
    } else {
      elemento.style.display = 'flex';
    }
  }
});

// .descriptionItem es la clase de la descripcion de cada item
