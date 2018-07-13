// ide deklaráljátok a függvényeket.

var spaceshipList = document.querySelector('.spaceship-list');
var searchBar = document.querySelector('#search-text');

var searchButton = document.querySelector('#search-button');
searchButton.setAttribute('onclick', 'searchSnipplet()');

// Függvény, ami módosítja a paraméterként átadott objektum egy tulajdonságának a típusát numberre
// Paraméter: Objektum, tulajdonság, új típus
// Megjegyzés: csak akkor módosít, ha a tulajdonság típusa nem egyezik meg az új típussal
function setTypeOfObjectProperty(inputObject, propertyName) {
  if (typeof inputObject[`${propertyName}`] !== 'number' && inputObject[`${propertyName}`] !== null) {
    inputObject[`${propertyName}`] = Number(inputObject[`${propertyName}`]);
  }
}

// FÜggvény,  ami törli a tömbből az adott elemet, ha az adott kulcs értéke megegyezik a keresési feltétellel
// Bemeneti paraméterek: Tömb, ami obektumokkal van feltöltve; kulcs, ahol keres; érték, amit keres
// Visszatérési érték: Módosított tömb, a törölt elemek nélkül.
function deleteElementFromArrayOfObjects(inputArray, key, value) {
  for (var i = 0; i < inputArray.length; i++) {
    if (inputArray[i][key] === value) {
      inputArray.splice(i, 1);
      i -= 1;
    }
  }
}

// Függvény, ami felülírja a paraméterként átadott objektum adott tulajdonságának értékét.
// Paraméter: objektum, tulajdonság, új érték.
// MEGJEGYZÉS: sokkal elegánsabb lenne, ha az objektum prototípusánál vennénk fel új metódusként az alábbi függvényt.
function overwriteValueOfObjectProprty(inpuObject, propertyName, newValue) {
  inpuObject[`${propertyName}`] = newValue;
}

// Javított buborékrendezés objektumokkal feltöltött tömbre. NUMBER-re!
// Paraméter: tömb, objektum tulajdonsága.
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

// Maximum-kereső függvény objektumokkal feltöltött tömbre
// Paraméter: tömb, objektum tulajdonság
// Visszatérési érték: legnagyobb értékkel rendelkező objektum.
function maxPropertyValue(inputArray, propertyName) {
  var objectToReturn = inputArray[0];
  for (var i = 1; i < inputArray.length; i++) {
    if (inputArray[i][`${propertyName}`] > objectToReturn[`${propertyName}`]) {
      objectToReturn = inputArray[i];
    }
  }
  return objectToReturn;
}

// Függvény, ami leellenőrzi, hogy létezik e a kép
// Paraméter: a kép elérési útvonala
// Visszatérési érték: boolean
function imageExists(imageUrl) {
  var http = new XMLHttpRequest();
  http.open('HEAD', imageUrl, false);
  http.send();
  return http.status !== 404;
}

function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
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
  for (i = 0; i < userDatas.length; i++) {
    var cell; var row;

    var table = document.createElement('table');

    var thead = document.createElement('thead');
    table.appendChild(thead);

    var th = document.createElement('th');
    th.innerHTML = 'property';
    thead.appendChild(th);

    th = document.createElement('th');
    th.innerHTML = 'value';
    thead.appendChild(th);

    row = table.insertRow(0);
    cell = row.insertCell(0);
    cell.innerHTML = 'ID';
    cell = row.insertCell(1);
    cell.innerHTML = userDatas[i].id;

    row = table.insertRow(1);
    cell = row.insertCell(0);
    cell.innerHTML = 'Model';
    cell = row.insertCell(1);
    cell.innerHTML = userDatas[i].model;

    row = table.insertRow(2);
    cell = row.insertCell(0);
    cell.innerHTML = 'Cost in credits';
    cell = row.insertCell(1);
    cell.innerHTML = userDatas[i].cost_in_credits;

    row = table.insertRow(3);
    cell = row.insertCell(0);
    cell.innerHTML = 'Denomination';
    cell = row.insertCell(1);
    cell.innerHTML = userDatas[i].denomination;

    row = table.insertRow(4);
    cell = row.insertCell(0);
    cell.innerHTML = 'Crew';
    cell = row.insertCell(1);
    cell.innerHTML = userDatas[i].crew;

    row = table.insertRow(5);
    cell = row.insertCell(0);
    cell.innerHTML = 'Passengers';
    cell = row.insertCell(1);
    cell.innerHTML = userDatas[i].passengers;

    row = table.insertRow(6);
    cell = row.insertCell(0);
    cell.innerHTML = 'Cargo capacity';
    cell = row.insertCell(1);
    cell.innerHTML = userDatas[i].cargo_capacity;

    row = table.insertRow(7);
    cell = row.insertCell(0);
    cell.innerHTML = 'Max atmosphering speed';
    cell = row.insertCell(1);
    cell.innerHTML = userDatas[i].max_atmosphering_speed;

    row = table.insertRow(8);
    cell = row.insertCell(0);
    cell.innerHTML = 'Lengthiness';
    cell = row.insertCell(1);
    cell.innerHTML = userDatas[i].lengthiness;

    row = table.insertRow(9);
    cell = row.insertCell(0);
    cell.innerHTML = 'Manufacturer';
    cell = row.insertCell(1);
    cell.innerHTML = userDatas[i].manufacturer;

    row = table.insertRow(10);
    cell = row.insertCell(0);
    cell.innerHTML = 'Consumables';
    cell = row.insertCell(1);
    cell.innerHTML = userDatas[i].consumables;

    row = table.insertRow(11);
    cell = row.insertCell(0);
    cell.innerHTML = 'Image';
    cell = row.insertCell(1);
    if (imageExists(`/img/${userDatas[i].image}`)) {cell.innerHTML = `<img src=/img/${userDatas[i].image} >`; } else {cell.innerHTML = '<img src=/img/957888-200.png >';}

    table.className = 'ship-table';
    table.classList.add('ship-' + userDatas[i].id);
    table.addEventListener('click', eventOnClick);
    spaceshipList.appendChild(table);
  }

  function eventOnClick(ev) {
    // Kattintási esemény leírása
  }

  // Statisztika
  var maxCargoCapacity = (maxPropertyValue(userDatas, 'cargo_capacity').model);
  var maxLengthiness = (maxPropertyValue(userDatas, 'lengthiness').model);

  var statsToShow = [
    {text: 'Nr. of ships where crew=1: ',
      value: singleCrew},
    {text: 'Name of the ship having the maximal cargo capacity: ',
      value: maxCargoCapacity},
    {text: 'Total amount of carrigeable passengers: ',
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
  statsTable.addEventListener('click', eventOnClick);
  spaceshipList.appendChild(statsTable);
}
getData('/json/spaceships.json', successAjax);
