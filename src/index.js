import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import store from './redux/store/store.js';
import { createTheme } from "@mui/material/styles";
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import { ThemeProviderWrapper, useThemeContext } from './contexts/ThemeContext';
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));


function AppWithTheme() {
	const { darkMode } = useThemeContext();
	const theme = darkMode ? darkTheme : lightTheme;

	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline /> 
			<App />
		</MuiThemeProvider>
	);
}


root.render(
	<React.Fragment>
		<ThemeProviderWrapper> 
			<BrowserRouter>
				<Provider store={store}>
					<AppWithTheme />
				</Provider>
			</BrowserRouter>
		</ThemeProviderWrapper>
	</React.Fragment>
);
