import L from "leaflet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tweet } from "../../@types/interfaces";
import { mapProvider } from "../../providers/MapProvider";
import { createTweetsProvider } from "../../providers/TweetsProviderFactory";
import { getIconForCategory } from "../../utils/helpers";
import "./MapElement.css";

export interface MapElementProps {
  tweets: Array<Tweet>;
  onTweetClick: (tweet: Tweet) => void;
}

const MapElement = ({ tweets, onTweetClick }: MapElementProps) => {
  const [map, setMap] = useState<L.Map | undefined>(undefined);
  const divElement = useRef<any>(undefined);
  useEffect(() => {
    const newMap = L.map(divElement.current, {
      center: [49, 31],
      zoom: 6,
    });
    mapProvider.registerMap(newMap);
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

  useEffect(() => {
    if (!map) return;
    const drawTweetsWithGeo = () => {
      const processedTweets: Tweet[] = [];
      tweets
        .filter((tweet) => tweet.category)
        .forEach((tweet) => {
          const customIcon = L.icon({
            iconUrl: getIconForCategory(tweet.category),
            iconSize: [38, 95],
          });
          if (
            processedTweets.find(
              (t) => t.lat === tweet.lat && t.lng === tweet.lng
            )
          ) {
            const up = Math.random() > 0.5;
            const right = Math.random() > 0.5;
            const latOffset = Math.random() / 20;
            const lngOffset = Math.random() / 20;
            tweet.lat = tweet.lat + (up ? +latOffset : -latOffset);
            tweet.lng = tweet.lng + (right ? +lngOffset : -lngOffset);
          }
          const p = L.marker([tweet.lat, tweet.lng], {
            icon: customIcon,
          });
          p.addTo(map);
          p.on("click", () => {
            onTweetClick(tweet);
          });
          processedTweets.push(tweet);
        });
    };
    drawTweetsWithGeo();
  }, [map, tweets]);

  return <div className="map-element-container" ref={divElement}></div>;
};

export default MapElement;
