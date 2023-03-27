class Lines {
  constructor(lines) {
    this.lines = lines;

    this.init();
  }

  async init() {
    const res = await fetch(BUS_SERVER + '/api/getRoute/' + this.lines.join(','));
    const routes = await res.json();

    this.trips = routes.map((r) => new Line(r));
    console.log('loaded');

    if (this.trips.length) this.trips[0].focus();
  }

  show(trip_id) {
    if (!this.trips) return console.log('lines not yet loaded ..');

    console.log(trip_id);
    const line = this.trips.find((t) => t.trip_id === trip_id);
    if (line) line.show();
  }

  hide(trip_id) {
    console.log('hide');
    const line = this.trips.find((t) => t.trip_id === trip_id);
    if (line) line.hide();
  }
}

class Line {
  constructor({ trip_id, coordinates }) {
    this.trip_id = trip_id;
    this.coordinates = coordinates;

    this.polyline = L.polyline(coordinates, {
      color: 'indianred',
      opacity: 0.5,
      lineCap: 'round',
      lineJoin: 'round',
    });
  }

  show() {
    this.polyline.addTo(map);
  }

  hide() {
    map.removeLayer(this.polyline);
  }

  focus() {
    map.fitBounds(this.polyline.getBounds());
  }
}
