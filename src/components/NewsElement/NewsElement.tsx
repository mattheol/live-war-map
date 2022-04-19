import React, { useState, useEffect } from "react";
import "./NewsElement.css";
import { Tweet } from "../../@types/interfaces";
import Button from "@mui/material/Button";
import { mapProvider } from "../../providers/MapProvider";
import { LatLngLiteral } from "leaflet";
import { getIconForCategory } from "../../utils/helpers";

export interface NewsElementProps {
  tweet: Tweet;
  onTweetClick: (tweet: Tweet) => void;
}

const NewsElement = ({ tweet, onTweetClick }: NewsElementProps) => {
  const { text, date } = tweet;
  return (
    <div className="news-element-container" onClick={() => onTweetClick(tweet)}>
      <div className="news-element-header">
        <div className="news-element-header-left">
          <div className="news-element-date">
            {new Date(date)
              .toLocaleTimeString()
              .split(":")
              .slice(0, 2)
              .join(":")}
          </div>
          <div>
            {[
              tweet.mainCategory,
              ...tweet.categories.filter((c) => c !== tweet.mainCategory),
            ].map((category) => (
              <img
                key={category}
                height="35px"
                width="35px"
                src={getIconForCategory(category)}
              ></img>
            ))}
          </div>
        </div>
        <Button
          variant="text"
          onClick={(e: any) => {
            e.stopPropagation();
            const map = mapProvider.getMap();
            const geom = { lat: tweet.lat, lng: tweet.lng } as LatLngLiteral;
            map.setView(geom, 15);
          }}
        >
          Pokaż na mapie
        </Button>
      </div>
      <div>{text}</div>
    </div>
  );
};

export default NewsElement;
