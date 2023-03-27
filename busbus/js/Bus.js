class Buses {
  constructor(routes) {
    this.routes = routes;
    this.buses = [];
    this.trips = [];

    this.i = 0;
    // this.routes = [1, 2, 9, 11, 25, 19, 27, 6];
    // this.routes = [2, '11b'];
    console.log(this.routes);
  }

  updateTrips() {
    this.trips = [...new Set(this.buses.map((b) => b.data.trip_id))]; //.sort();
    this.buses.forEach((b) => (b.data.direction = this.trips.indexOf(b.data.trip_id)));
  }

  async update() {
    this.routeNo = this.routes[this.i++ % this.routes.length];
    await this.updateData();
    this.updateTrips();
    this.draw();
  }

  async updateData() {
    // update buses data
    const r = await fetch(`${BUS_SERVER}/api/getBusData/${this.routeNo}`);
    const j = await r.json();

    for (let busData of j.data) {
      const id = busData.bus_unit_id;

      let bus = this.buses.find((b) => b.id === id);

      if (bus) bus.update(busData);
      else this.buses.push(new Bus(id, busData));
    }
  }

  draw() {
    this.buses.forEach((b) => b.draw());
  }
}

// --- class BUS

class Bus {
  constructor(id, data) {
    this.id = id;
    this.data = null;
    this.marker = null;

    this.update(data);
  }

  get age() {
    // when was bus data last updated (seconds)
    return Math.round((new Date() - new Date(this.data.bus_timestamp)) / 1000);
  }

  get popupContent() {
    let age = this.age;
    let ageMsg;
    if (age > 3600) ageMsg = `pred ${Math.round(age / 3600)} urami`;
    else if (age > 60) ageMsg = `pred ${Math.round(age / 60)} minutami`;
    else ageMsg = `pred ${age} sekundami`;

    return [`- ${this.data.destination} (${this.data.route_number})`, `- ${ageMsg}`, `- [${this.data.bus_name}]`].join(
      '<br>'
    );
  }

  update(data) {
    // update (only data)
    this.data = data;
    this.latlon = [data.latitude, data.longitude];
  }

  draw() {
    if (!this.marker) {
      // first time
      this.marker = L.marker(this.latlon, {
        icon: Icons.bus,
        rotationOrigin: 'center',
      });

      this.marker.addTo(map);

      // --- events
      this.marker.on('click', () => this.marker.bindPopup(this.popupContent));
      this.marker.on('popupopen', () => lines.show(this.data.trip_id));
      this.marker.on('popupclose', () => lines.hide(this.data.trip_id));
    }

    this.marker.setLatLng(new L.LatLng(...this.latlon));
    this.marker.setRotationAngle(this.data.cardinal_direction - 90);
    this.marker.bindPopup(this.popupContent);

    this.marker._icon.style.opacity = this.age > 60 ? '0.5' : '1';
    this.marker._icon.style.filter = 'hue-rotate(' + this.data.direction * 280 + 'deg)';
  }

  removeMarker() {
    if (this.marker) map.removeLayer(this.marker);
  }
}
