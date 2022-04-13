import React, { useEffect, useMemo, useState } from "react";
import { Tweet } from "./@types/interfaces";
import "./App.css";
import MapElement from "./components/MapElement/MapElement";
import NewsList from "./components/NewsList/NewsList";
import TweetDialog from "./components/TweetDialog/TweetDialog";
import { createTweetsProvider } from "./providers/TweetsProviderFactory";

function App() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [activeTweet, setActiveTweet] = useState<Tweet | undefined>(undefined);
  const [dateFilter, setDateFilter] = useState<number>(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    return today.getTime();
  });
  const provider = useMemo(createTweetsProvider, []);
  useEffect(() => {
    let cancel = false;
    const fetchNews = async () => {
      const startDate = new Date(dateFilter);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(dateFilter);
      endDate.setHours(23, 59, 59, 59);
      const tweets: Tweet[] = await provider.getTweets({
        start_date: startDate.getTime(),
        end_date: endDate.getTime(),
      });
      if (cancel) return;
      setTweets(tweets);
    };
    fetchNews();
    return () => {
      cancel = true;
    };
  }, [dateFilter]);

  return (
    <div className="app-container">
      <TweetDialog
        tweet={activeTweet}
        onClosed={() => {
          setActiveTweet(undefined);
        }}
      />
      <div className="map-container">
        <MapElement
          tweets={tweets}
          onTweetClick={(tweet: Tweet) => {
            setActiveTweet(tweet);
          }}
        />
      </div>
      <div className="right-panel">
        <NewsList
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          tweets={tweets}
          onTweetClick={(tweet: Tweet) => {
            setActiveTweet(tweet);
          }}
        />
      </div>
    </div>
  );
}

export default App;
