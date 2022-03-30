import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div>
      <button
        onClick={async () => {
          // const end_time = new Date();
          // end_time.setMinutes(end_time.getMinutes() - 1);
          // const start_time = new Date();
          // start_time.setHours(start_time.getHours() - 1);
          // const params = new URLSearchParams({
          //   query: "lang:en war",
          //   start_time: start_time.toISOString(),
          //   end_time: end_time.toISOString(),
          //   expansions: "geo.place_id",
          //   max_results: "100",
          // });
          // const res = await fetch(
          //   `http://localhost:8000/https://api.twitter.com/1.1/search/tweets.json?${params.toString()}`,
          //   {
          //     headers: {
          //       Authorization:
          //         "Bearer AAAAAAAAAAAAAAAAAAAAAAjsagEAAAAAYQbD8Crk4Bd2nwAr2Bna0TmD21w%3DyI0XX3eDbYHShWZJdmMN2kdGfqxLYdgkumHzDfs0gGF1tljUTQ",
          //     },
          //   }
          // ).then((r) => r.json());
          // console.log(res);
        }}
      >
        fetch
      </button>
    </div>
  );
}

export default App;
