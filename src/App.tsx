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
  const [dateFilter, setDateFilter] = useState<number>(Date.now());
  const provider = useMemo(createTweetsProvider, []);

  useEffect(() => {
    let cancel = false;
    const fetchNews = async () => {
      const tweets: Tweet[] = await provider.getTweets({ date: dateFilter });
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
