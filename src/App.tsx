import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MapElement from "./components/MapElement/MapElement";

function App() {
  return (
    <div className="app-container">
      <div className="map-container">
        <MapElement />
      </div>
      <div className="right-panel"></div>
    </div>
  );
}

export default App;
