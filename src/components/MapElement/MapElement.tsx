import L from "leaflet";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Tweet } from "../../@types/interfaces";
import { mapProvider } from "../../providers/MapProvider";
import { getIconForCategory, getTextForCategory } from "../../utils/helpers";
import "./MapElement.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../providers/FirebaseProvider";
import {
  DRAW_EVENT,
  END_DRAW_EVENT,
  OPEN_ADD_DIALOG_EVENT,
} from "../../utils/constants";
import CreateTweetDialog from "../CreateTweetDialog/CreateTweetDialog";
export interface MapElementProps {
  tweets: Array<Tweet>;
  onTweetClick: (tweet: Tweet) => void;
}

//require leaflet-draw plugin
const leafletDraw = require("leaflet-draw");
const iconUrl = require("leaflet/dist/images/marker-icon.png");
const MapElement = ({ tweets, onTweetClick }: MapElementProps) => {
  const [map, setMap] = useState<L.Map | undefined>(undefined);
  const [refreshButton, setRefreshButton] = useState<number | undefined>(
    undefined
  );
  const [user, loading, error] = useAuthState(auth);
  const legendControlRef = useRef<L.Control | undefined>(undefined);
  const buttonAddRef = useRef<L.Control | undefined>(undefined);
  const divElement = useRef<any>(undefined);

  const onClosed = useCallback(() => {
    setRefreshButton(Date.now());
  }, []);

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
    const drawer = new L.Draw.Marker(newMap);
    const customIcon = L.icon({
      iconUrl: getIconForCategory("warning"),
      iconSize: [38, 95],
    });
    drawer.initialize(newMap, { icon: customIcon });
    newMap.on("draw:created", (e) => {
      window.dispatchEvent(
        new CustomEvent(END_DRAW_EVENT, { detail: e.layer._latlng })
      );
    });
    const listener = () => {
      drawer.enable();
    };
    window.addEventListener(DRAW_EVENT, listener);
    return () => {
      window.removeEventListener(DRAW_EVENT, listener);
      drawer.disable();
    };
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
            window.dispatchEvent(new Event(OPEN_ADD_DIALOG_EVENT));
            map.removeControl(buttonAddRef.current!);
            buttonAddRef.current = undefined;
          });
          return buttonElem;
        };
        buttonAdd.addTo(map);
        buttonAddRef.current = buttonAdd;
      }
    }
  }, [map, user, refreshButton]);

  return (
    <>
      <div className="map-element-container" ref={divElement}></div>
      <CreateTweetDialog onClosed={onClosed} />
    </>
  );
};

export default MapElement;
