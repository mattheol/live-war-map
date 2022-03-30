import React from "react";
import "./App.css";
import MapElement from "./components/MapElement/MapElement";
import { config as TwitterConfig } from "./config/twitterConfig";

function App() {
  return (
    <div className="app-container">
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
            const filtered = res.statuses.filter((st: any) => st.geo);
            console.log(filtered);
          }}
        >
          Fetch tweets
        </button>
      </div>
    </div>
  );
}

export default App;
