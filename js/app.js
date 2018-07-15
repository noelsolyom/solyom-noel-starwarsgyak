// ide deklaráljátok a függvényeket.

document.querySelector('title').innerHTML = 'STAR WARS vehicles';

var spaceshipList = document.querySelector('.spaceship-list');
var oneSpaceShip = document.querySelector('.one-spaceship');

var shipDetail = document.createElement('div');
shipDetail.className = 'ship-detail';
shipDetail.innerHTML = '<h1>Details</h1>';
oneSpaceShip.appendChild(shipDetail);

var tableLeftCol = ['ID',
  'Model',
  'Cost in credits',
  'Denomination',
  'Crew',
  'Passengers',
  'Cargo capacity',
  'Max atmosphering speed',
  'Lengthiness',
  'Manufacturer',
  'Consumables'
];

var tableRightCol = ['id',
  'model',
  'cost_in_credits',
  'denomination',
  'crew',
  'passengers',
  'cargo_capacity',
  'max_atmosphering_speed',
  'lengthiness',
  'manufacturer',
  'consumables'
];

// Megjegyzés: csak akkor módosít, ha a tulajdonság típusa nem egyezik meg az új típussal
function setTypeOfObjectProperty(inputObject, propertyName) {
  if (typeof inputObject[`${propertyName}`] !== 'number' && inputObject[`${propertyName}`] !== null) {
    inputObject[`${propertyName}`] = Number(inputObject[`${propertyName}`]);
  }
}

function deleteElementFromArrayOfObjects(inputArrayofObjects, key, value) {
  for (var i = 0; i < inputArrayofObjects.length; i++) {
    if (inputArrayofObjects[i][key] === value) {
      inputArrayofObjects.splice(i, 1);
      i -= 1;
    }
  }
}

// MEGJEGYZÉS: sokkal elegánsabb lenne, ha az objektum prototípusánál vennénk fel új metódusként az alábbi függvényt.
function overwriteValueOfObjectProprty(inpuObject, propertyName, newValue) {
  inpuObject[`${propertyName}`] = newValue;
}

// Javított buborékrendezés objektumokkal feltöltött tömbre. NUMBER-re!
function advBubbleSortForArrayOfObjects(inputArray, propertyName) {
  var i = inputArray.length - 1; var j = 0;
  while (i >= 2) {
    var swap = 0;
    for (j = 0; j < i; j++) {
      if ((inputArray[j][`${propertyName}`] > inputArray[j + 1][`${propertyName}`]) ||
          (typeof inputArray[j][`${propertyName}`] !== 'number'))  {
        [inputArray[j], inputArray[j + 1]] = [inputArray[j + 1], inputArray[j]];
        swap = j;
      }
    }
    i = swap;
  }
}

function maxPropertyValue(inputArray, propertyName) {
  var objectToReturn = inputArray[0];
  for (var i = 1; i < inputArray.length; i++) {
    if (inputArray[i][`${propertyName}`] > objectToReturn[`${propertyName}`]) {
      objectToReturn = inputArray[i];
    }
  }
  return objectToReturn;
}

// Visszatérési érték: boolean
function imageExists(imageUrl) {
  var http = new XMLHttpRequest();
  http.open('HEAD', imageUrl, false);
  http.send();
  return http.status !== 404;
}

function showShipDetail(shipObject) {
  if (document.querySelector('.main-ul')) {
    var mainUl = document.querySelector('.main-ul');
    mainUl.remove();
  }

  if (document.querySelector('.ship-image-detail')) {
    var shipImage = document.querySelector('.ship-image-detail');
    shipImage.remove();
  }

  mainUl = document.createElement('ul');
  mainUl.className = 'main-ul';

  for ( var i = 0; i < tableLeftCol.length; i++) {
    var propertyLi = document.createElement('li');
    propertyLi.className = 'property-li';
    propertyLi.innerHTML = tableLeftCol[i];
    var innerUl = document.createElement('ul');
    var valueLi = document.createElement('li');
    valueLi.className = 'value-li';
    valueLi.innerHTML = shipObject[`${tableRightCol[i]}`];
    innerUl.appendChild(valueLi);
    propertyLi.appendChild(innerUl);
    mainUl.appendChild(propertyLi);
  }

  shipDetail.appendChild(mainUl);

  shipImage = document.createElement('img');
  shipImage.className = 'ship-image-detail';
  if (imageExists(`/img/${shipObject.image}`)) {
    shipImage.setAttribute('src', `/img/${shipObject.image}`);
    shipImage.setAttribute('alt', 'Image');
  } else {
    shipImage.setAttribute('src', '/img/957888-200.png');
    shipImage.classList.add('fallback-image');
    shipImage.setAttribute('alt', 'Image');
  }

  shipDetail.appendChild(shipImage);
}

function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function noIdea() {
    if (this.readyState === 4 && this.status === 200) {
      callbackFunc(this);
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  // Innen lesz elérhető a JSON file tartalma, tehát az adatok amikkel dolgoznod kell
  var userDatas = JSON.parse(xhttp.responseText);

  // Elemek törlése
  deleteElementFromArrayOfObjects(userDatas, 'consumables', null);

  // Statisztika
  var singleCrew = 0;
  var sumPassengers = 0;

  for (var i = 0; i < userDatas.length; i++) {
    // Tulajdonságok típusainak módosítása
    setTypeOfObjectProperty(userDatas[i], 'cost_in_credits', 'number');
    setTypeOfObjectProperty(userDatas[i], 'cargo_capacity', 'number');
    setTypeOfObjectProperty(userDatas[i], 'crew', 'number');
    setTypeOfObjectProperty(userDatas[i], 'passengers', 'number');
    setTypeOfObjectProperty(userDatas[i],  'lengthiness', 'number');
    setTypeOfObjectProperty(userDatas[i],  'max_atmosphering_speed', 'number');

    // Tulajdonságok értékeinek módosítása
    for (var j in userDatas[i]) {
      if (userDatas[i][j] === null) {
        overwriteValueOfObjectProprty(userDatas[i], j, 'unknown');
      }
    }

    // Crew=1 -el rendelkező hajók száma:
    if (userDatas[i].crew === 1) {
      singleCrew += 1;
    // Az összes hajó utasainak (passengers) összesített száma:
    } else if (userDatas[i].passengers !== 'unknown') {
      sumPassengers += userDatas[i].passengers;
    }
  }

  // Sorbarendezés javított buborékrendezéssel
  advBubbleSortForArrayOfObjects(userDatas, 'cost_in_credits');

  // Adatok kiírása
  // Táblázat sorainak generálása
  for  (i = 0; i < userDatas.length; i++) {
    var cell; var row;
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    table.appendChild(thead);

    var tr = document.createElement('tr');
    thead.appendChild(tr);

    var th = document.createElement('th');
    th.innerHTML = 'property';
    tr.appendChild(th);

    th = document.createElement('th');
    th.innerHTML = 'value';
    tr.appendChild(th);

    var tbody = document.createElement('tbody');
    table.appendChild(tbody);

    for (j = 0; j < tableLeftCol.length; j++) {
      row = tbody.insertRow(j);
      cell = row.insertCell(0);
      cell.innerHTML = tableLeftCol[j];
      cell = row.insertCell(1);
      cell.innerHTML = userDatas[i][`${tableRightCol[j]}`];
    }

    row = tbody.insertRow(11);
    cell = row.insertCell(0);
    cell.innerHTML = 'Image';
    cell = row.insertCell(1);
    // Kép beszúrása
    if (imageExists(`/img/${userDatas[i].image}`)) {
      cell.innerHTML = `<img src=/img/${userDatas[i].image} alt="Image">`;
    } else {
      cell.innerHTML = '<img src=/img/957888-200.png alt="Image">';
    }

    // Táblázat hozzáfűzése a spacehip-list osztályú elemhez
    table.className = 'ship-table';
    table.classList.add('target-' + i);
    table.addEventListener('click', eventHandler);
    spaceshipList.appendChild(table);
  }

  // Statisztika
  var maxCargoCapacity = (maxPropertyValue(userDatas, 'cargo_capacity').model);
  var maxLengthiness = (maxPropertyValue(userDatas, 'lengthiness').model);

  var statsToShow = [
    {text: 'Nr. of ships where crew=1: ',
      value: singleCrew},
    {text: 'Name of the ship having the maximal cargo capacity: ',
      value: maxCargoCapacity},
    {text: 'Total amount of transportable passengers: ',
      value: sumPassengers},
    {text: "Name of the longest ship's image: ",
      value: maxLengthiness}
  ];

  // Statisztika kiírása
  var footerHeader = document.createElement('h1');
  footerHeader.innerHTML = 'Statistics';
  spaceshipList.appendChild(footerHeader);

  var statsTable = document.createElement('table');
  for (i = 0; i < statsToShow.length; i++) {
    row = statsTable.insertRow(0);
    cell = row.insertCell(0);
    cell.innerHTML = statsToShow[i].text;
    cell = row.insertCell(1);
    cell.innerHTML = statsToShow[i].value;
  }

  statsTable.className = 'stats-table';
  spaceshipList.appendChild(statsTable);

  // Keresés model-re - sorbarendezés után
  document.querySelector('#search-button').onclick = function modelSort() {
    // Javított buborékrendezés objektumokkal feltöltött tömbre. STRING-RE!
    var searchIn = userDatas.slice(0);
    i = searchIn.length - 1;
    j = 0;
    while (i >= 2) {
      var swap = 0;
      for (j = 0; j < i; j++) {
        var str1 = searchIn[j].model.toString();
        var str2 = searchIn[j + 1].model.toString();
        if (str1.localeCompare(str2) > 0) {
          [searchIn[j], searchIn[j + 1]] = [searchIn[j + 1], searchIn[j]];
          swap = j;
        }
      }
      i = swap;
    }

    var userSearch = document.querySelector('#search-text').value.toLowerCase();
    var foundModels = [];
    if (userSearch !== '') {
      for (i = 0; i < searchIn.length; i++) {
        if (searchIn[i].model.toLowerCase().indexOf(userSearch) > -1) {
          foundModels.push(searchIn[i]);
        }
      }
    }
    if (foundModels.length > 0) {
      showShipDetail(foundModels[0]);
    }
  };

  function eventHandler() {
    var targetId = this.classList[1];
    targetId = targetId.replace('target-', '');
    showShipDetail(userDatas[targetId]);
  }
}
getData('/json/spaceships.json', successAjax);
