import L from "leaflet";
import React, { useEffect, useRef, useState } from "react";
import "./MapElement.css";

const MapElement = () => {
  const [map, setMap] = useState<L.Map | undefined>(undefined);
  const divElement = useRef<any>(undefined);
  useEffect(() => {
    const newMap = L.map(divElement.current, {
      center: [49, 32],
      zoom: 6,
    });
    setMap(newMap);

    const tiles = new L.TileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );
    tiles.addTo(newMap);
  }, []);
  console.log({ map });
  return <div className="map-element-container" ref={divElement}></div>;
};

export default MapElement;
