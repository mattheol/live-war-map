export class MapProvider {
  private map!: L.Map;

  registerMap(map: L.Map) {
    this.map = map;
  }

  getMap(): L.Map {
    return this.map;
  }
}

export const mapProvider = new MapProvider();
