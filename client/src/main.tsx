import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App";
import { store, persistor } from "./redux/store";

import "./index.css";

import AppProvider from "./components/shared/AppProvider";

const options = {
  timeout: 5000,
  position: positions.TOP_RIGHT,
  transitions: transitions.SCALE,
};

const theme = extendTheme({
  colors: {
    brand: {
      default: "#000",
      light: "#ddd",
    },
    heading: {
      large: "#000",
      small: "#4A5568",
    },
  },
  fonts: {
    body: "system-ui, sans-serif",
    heading: "Georgia, serif",
    mono: "Menlo, monospace",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeights: {
    normal: "normal",
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: "2",
    "3": ".75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "9": "2.25rem",
    "10": "2.5rem",
  },
  letterSpacings: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading="null" persistor={persistor}>
      <ChakraProvider theme={theme}>
        <AlertProvider template={AlertTemplate} {...options}>
          <AppProvider>
            <App />
          </AppProvider>
        </AlertProvider>
      </ChakraProvider>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
