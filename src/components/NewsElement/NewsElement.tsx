import React, { useState, useEffect } from "react";
import "./NewsElement.css";
import { Tweet } from "../../@types/interfaces";

export interface NewsElementProps {
  tweet: Tweet;
  onTweetClick: (tweet: Tweet) => void;
}

const NewsElement = ({ tweet, onTweetClick }: NewsElementProps) => {
  const { text, created_at } = tweet;
  return (
    <div className="news-element-container" onClick={() => onTweetClick(tweet)}>
      <div className="news-element-date">
        {new Date(created_at)
          .toLocaleTimeString()
          .split(":")
          .slice(0, 2)
          .join(":")}
      </div>
      <div>{text}</div>
    </div>
  );
};

export default NewsElement;
