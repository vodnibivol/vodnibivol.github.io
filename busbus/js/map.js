// global
let map;
let buses;
let lines;

const Main = (async function () {
  // init
  init();

  // f(x)
  function init() {
    map = L.map('map').setView([46.05, 14.52], 13);

    initMap();
    L.control.locate().addTo(map);

    // get bus line
    const params = new URLSearchParams(location.search);
    const r = params.get('line') || '';
    const routes = r.split(',').map((i) => i.trim());

    buses = new Buses(routes);
    buses.update();

    setInterval(() => {
      buses.update();
    }, 1000);

    // lines
    lines = new Lines(routes);
  }

  function initMap() {
    const mapConfig = {
      maxZoom: 18,
      minZoom: 12,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1Ijoidm9kbmliaXZvbCIsImEiOiJjbDBrb2ZhNTIwb2YxM2ltOXVmMG5qbW05In0.eH6IYRJquEFQgNTXGcyBmA',
      attribution: 'vodnibivol | <a href="/">Home</a>',
    };
    const tileLayer = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}{r}?access_token={accessToken}';

    L.tileLayer(tileLayer, mapConfig).addTo(map);

    // attribution
    document.querySelector('.leaflet-control-attribution').innerHTML = mapConfig.attribution;
  }
})();

const Icons = {
  bus: L.icon({
    iconUrl: 'img/bus_arrow.png',
    iconSize: [48, 48],
  }),
  station: L.icon({
    iconUrl: 'img/station.png',
    iconSize: [32, 32],
  }),
};
