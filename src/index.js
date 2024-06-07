import React from "react";
import ReactDOM from "react-dom";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import "./index.css";
import App from "./App.jsx";
import { CssBaseline } from '@material-ui/core';
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const theme = createTheme({
  palette: {
    primary: purple,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);