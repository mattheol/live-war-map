import React, { useState } from "react";
import { Tweet } from "./@types/interfaces";
import "./App.css";
import MapElement from "./components/MapElement/MapElement";
import NewsList from "./components/NewsList/NewsList";
import TweetDialog from "./components/TweetDialog/TweetDialog";
import { config as TwitterConfig } from "./config/twitterConfig";

function App() {
  const [activeTweet, setActiveTweet] = useState<Tweet | undefined>(undefined);
  return (
    <div className="app-container">
      <TweetDialog
        tweet={activeTweet}
        onClosed={() => {
          setActiveTweet(undefined);
        }}
      />
      <div className="map-container">
        <MapElement />
      </div>
      <div className="right-panel">
        <button
          onClick={async () => {
            const params = new URLSearchParams({
              q: "(#Ukraine OR #war) -filter:retweets",
              count: "100",
              result_type: "recent",
              geocode: "49,31,700km",
              lang: "en",
            });
            const res = await fetch(
              `http://localhost:8000/https://api.twitter.com/1.1/search/tweets.json?${params.toString()}`,
              {
                headers: {
                  Authorization: `Bearer ${TwitterConfig.token}`,
                },
              }
            ).then((r) => r.json());
            const tweetsWithGeo = res.statuses.filter((st: any) => st.geo);
            console.log({ tweetsWithGeo });
          }}
        >
          Fetch tweets
        </button>
        <NewsList
          onTweetClick={(tweet: Tweet) => {
            setActiveTweet(tweet);
          }}
        />
      </div>
    </div>
  );
}

export default App;
