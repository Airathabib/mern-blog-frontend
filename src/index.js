import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import store from './redux/store/store.js';
import { createTheme } from "@mui/material/styles";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));


const theme = createTheme({
	shadows: ["none",
		'0px 1px 3px 0px rgba(0,0,0,0.12)', // elevation 1
		'0px 3px 6px 0px rgba(0,0,0,0.16)', // elevation 2
	],
	palette: {
		primary: {
			main: "#4361ee",
		},
	},
	typography: {
		button: {
			textTransform: "none",
			fontWeight: 400,
		},
	},
});


root.render(
	<React.Fragment>
		<CssBaseline />
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Provider store={store}>
					<App />
				</Provider>
			</BrowserRouter>
		</ThemeProvider>
	</React.Fragment>
);
