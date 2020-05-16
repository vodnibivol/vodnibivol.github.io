contentsDiv = document.getElementById('contents');

function randInt(num) {
  return Math.floor(Math.random() * num);
}

function displayText(obj) {
  objLength = Object.values(obj).length;
  
  randomEntry = Object.values(obj)[randInt(objLength) - 1]
  contentsDiv.innerHTML = randomEntry;
}

/* ------ HTTP Request ------- */

var xmlhttp = new XMLHttpRequest();
var url = `CHUNKS/${randInt(98)}.json`;

xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myObj = JSON.parse(this.responseText);
    
    displayText(myObj);
    }
};

xmlhttp.open("GET", url, true);
xmlhttp.send();

// contentsDiv.innerHTML = "<h1>header</h1>"