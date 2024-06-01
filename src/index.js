import React from "react";
import ReactDOM from "react-dom";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import "./index.css";
import App from "./App.jsx";

const theme = createTheme({
  palette: {
    primary: purple,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);