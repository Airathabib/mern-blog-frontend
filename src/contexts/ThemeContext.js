// src/contexts/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProviderWrapper = ({ children }) => {
	const [darkMode, setDarkMode] = useState(() => {
		const saved = localStorage.getItem('darkMode');
		if (saved !== null) {
			return JSON.parse(saved);
		}
		return prefersDarkMode; //
	});

	useEffect(() => {
		localStorage.setItem('darkMode', JSON.stringify(darkMode));
	}, [darkMode]);

	const toggleDarkMode = () => {
		setDarkMode(prev => !prev);
	};

	return (
		<ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
			{children}
		</ThemeContext.Provider>
	);
};
