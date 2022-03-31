import L from "leaflet";
import React, { useEffect, useRef, useState } from "react";
import { Tweet } from "../../@types/interfaces";
import { getIconForCategory } from "../../utils/helpers";
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
        const customIcon = L.icon({
          iconUrl: getIconForCategory(tweet.category),
          iconSize: [38, 95],
        });

        const p = L.marker([tweet.geo![0], tweet.geo![1]], {
          icon: customIcon,
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
