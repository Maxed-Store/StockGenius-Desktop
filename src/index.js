import React from "react";
import ReactDOM from "react-dom";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import "./index.css";
import App from "./App.jsx";
import { CssBaseline } from '@material-ui/core';

const theme = createTheme({
  palette: {
    primary: purple,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);