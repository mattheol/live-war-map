import React, { useState, useEffect } from "react";
import "./NewsList.css";
import { sampleTweets } from "../../utils/mockData";
import { Tweet } from "../../@types/interfaces";
import NewsElement from "../NewsElement/NewsElement";

export interface NewsListProps {
  onTweetClick: (tweet: Tweet) => void;
}

const NewsList = ({ onTweetClick }: NewsListProps) => {
  const [news, setNews] = useState<Array<Tweet>>([]);

  useEffect(() => {
    let cancel = false;
    const fetchNews = () => {
      //TODO fetch with pagination
      const testNews = sampleTweets.map((tweet: any) => {
        return {
          source: "twitter",
          text: tweet.text,
          _tweetId: tweet.id_str,
          uuid: tweet.id_str,
          created_at: new Date(tweet.created_at).getTime(),
        } as Tweet;
      });
      if (cancel) return;
      setNews(testNews);
    };
    fetchNews();
    return () => {
      cancel = true;
    };
  }, []);

  console.log({ news });

  return (
    <>
      <h4 className="news-list-header">Najnowsze wydarzenia</h4>
      <div className="list-container">
        {news.map((tweet) => (
          <NewsElement
            key={tweet.uuid}
            tweet={tweet}
            onTweetClick={onTweetClick}
          />
        ))}
      </div>
    </>
  );
};

export default NewsList;
