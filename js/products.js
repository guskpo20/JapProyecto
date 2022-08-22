const itemsContainer = document.getElementById('container');

async function getData() {
  let promise = await fetch(
    'https://japceibal.github.io/emercado-api/cats_products/101.json'
  );
  let data = await promise.json();
  setHtml(data.products);
}

function setHtml(data) {
  itemsContainer.innerHTML = '';
  for (const car of data) {
    itemsContainer.innerHTML += `
        <div class="item">
            <img src="${car.image}" alt="Foto de ${car.name}" />
            <div class="item-info">
                <div class="item-info-primerRenglon">
                    <h3>${car.name} - ${car.currency}${car.cost}</h3>
                    <p>${car.soldCount} vendidos</p>
                </div>
                <p>${car.description}</p>
            </div>
        </div>
        `;
  }
}

getData();
