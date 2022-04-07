import React from "react";
import { Tweet } from "../../@types/interfaces";
import NewsElement from "../NewsElement/NewsElement";
import "./NewsList.css";

export interface NewsListProps {
  tweets: Array<Tweet>;
  onTweetClick: (tweet: Tweet) => void;
}

const NewsList = ({ tweets, onTweetClick }: NewsListProps) => {
  return (
    <>
      <h4 className="news-list-header">Najnowsze wydarzenia</h4>
      <div className="list-container">
        {tweets.map((tweet) => (
          <NewsElement
            key={tweet.id}
            tweet={tweet}
            onTweetClick={onTweetClick}
          />
        ))}
      </div>
    </>
  );
};

export default NewsList;
