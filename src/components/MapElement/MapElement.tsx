import L from "leaflet";
import React, { useEffect, useRef, useState } from "react";
import { Tweet } from "../../@types/interfaces";
import { sampleTweetsWithGeo } from "../../utils/mockData";
import "./MapElement.css";

export interface MapElementProps {
  onTweetClick: (tweet: Tweet) => void;
}

const MapElement = ({ onTweetClick }: MapElementProps) => {
  const [map, setMap] = useState<L.Map | undefined>(undefined);
  const divElement = useRef<any>(undefined);
  useEffect(() => {
    const newMap = L.map(divElement.current, {
      center: [49, 31],
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

    const drawTweetsWithGeo = () => {
      sampleTweetsWithGeo.forEach((tweet) => {
        const markerIcon = L.icon({
          iconSize: [25, 41],
          iconAnchor: [10, 41],
          popupAnchor: [2, -40],
          // specify the path here
          iconUrl:
            "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png",
        });
        const p = L.marker([tweet.geo![0], tweet.geo![1]], {
          icon: markerIcon,
        });
        p.addTo(newMap);
        p.on("click", () => {
          onTweetClick(tweet);
        });
      });
    };

    drawTweetsWithGeo();
  }, []);
  console.log({ map });
  return <div className="map-element-container" ref={divElement}></div>;
};

export default MapElement;
