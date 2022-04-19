import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
import SnackbarCloseButton from "./components/SnackbarCloseButton";

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider
      maxSnack={3}
      action={(snackbarKey) => (
        <SnackbarCloseButton snackbarKey={snackbarKey} />
      )}
    >
      <App />
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
