contentsDiv = document.getElementById("contents");
infoButton = document.getElementById('info');
message = document.getElementById('message');

infoButton.addEventListener('click', () => {message.classList.toggle('show')});

function gabi_content(element) {
  // var element = document.getElementById('txt');
  text = element.innerText || element.textContent;

  console.log(text);
}

function randInt(num) {
  return Math.floor(Math.random() * num);
}

function displayText(obj) {
  objLength = Object.values(obj).length;

  randomEntry = Object.values(obj)[randInt(objLength) - 1];

  console.log(randomEntry.length);
  gabi_content(randomEntry);

  if (randomEntry.length < 2000) {
    contentsDiv.innerHTML = randomEntry;
  } else {
    displayText(obj);
  }
}

/* ------ HTTP Request ------- */

function jsonRequest() {
  var xmlhttp = new XMLHttpRequest();
  var url = `CHUNKS/${randInt(98)}.json`;

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);

      displayText(myObj);
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

jsonRequest();
