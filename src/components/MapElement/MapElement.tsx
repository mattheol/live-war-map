import L from "leaflet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tweet } from "../../@types/interfaces";
import { mapProvider } from "../../providers/MapProvider";
import { getIconForCategory, getTextForCategory } from "../../utils/helpers";
import "./MapElement.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../providers/FirebaseProvider";

export interface MapElementProps {
  tweets: Array<Tweet>;
  onTweetClick: (tweet: Tweet) => void;
}

const MapElement = ({ tweets, onTweetClick }: MapElementProps) => {
  const [map, setMap] = useState<L.Map | undefined>(undefined);
  const [user, loading, error] = useAuthState(auth);
  const legendControlRef = useRef<L.Control | undefined>(undefined);
  const buttonAddRef = useRef<L.Control | undefined>(undefined);
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
      map.eachLayer((layer: any) => {
        if (
          !(layer instanceof L.TileLayer) &&
          layer.options.myCustomProperty != "myMainMarker"
        ) {
          map.removeLayer(layer);
        }
      });
      tweets
        .filter((tweet) => tweet.mainCategory)
        .forEach((tweet) => {
          // const iconUrl = getIconForCategory(tweet.mainCategory);
          // console.log(tweet.mainCategory, iconUrl);
          const customIcon = L.icon({
            iconUrl: getIconForCategory(tweet.mainCategory),
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
      const legend = new L.Control({ position: "bottomleft" });
      if (legendControlRef.current) {
        map.removeControl(legendControlRef.current);
      }
      legend.onAdd = (map: L.Map) => {
        const legendDiv = L.DomUtil.create("div", "legend-container");
        const uniqueCategories = Array.from(
          new Set(
            tweets
              .map((t) => t.categories)
              .flat()
              .sort()
          )
        );
        legendDiv.innerHTML = `${uniqueCategories
          .map((cat) => {
            const icon = getIconForCategory(cat);
            const text = getTextForCategory(cat);
            return `<div class="legend-item"><img class="legend-icon" src=${icon} height="25" width="25"></img><span class="legend-text">${text}</span></div>`;
          })
          .join("")}`;
        return legendDiv;
      };
      legend.addTo(map);
      legendControlRef.current = legend;
    };
    drawTweetsWithGeo();
  }, [map, tweets]);

  useEffect(() => {
    if (map) {
      if (buttonAddRef.current) {
        map.removeControl(buttonAddRef.current);
      }
      if (user) {
        const buttonAdd = new L.Control({ position: "topright" });
        buttonAdd.onAdd = (map: L.Map) => {
          const buttonElem = L.DomUtil.create("button", "legend-container");
          buttonElem.innerHTML = `Add a news`;
          buttonElem.addEventListener("click", () => {
            //TODO handle
            console.log("click add button");
          });
          return buttonElem;
        };
        buttonAdd.addTo(map);
        buttonAddRef.current = buttonAdd;
      }
    }
  }, [map, user]);

  return <div className="map-element-container" ref={divElement}></div>;
};

export default MapElement;
