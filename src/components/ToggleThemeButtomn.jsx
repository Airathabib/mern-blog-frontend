import React from 'react';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Тёмная тема
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Светлая тема
import { useThemeContext } from '../contexts/ThemeContext';

export const ToggleThemeButton = () => {
	const { darkMode, toggleDarkMode } = useThemeContext();

	return (
		<IconButton
			onClick={toggleDarkMode}
			color="inherit"
			sx={{ ml: 1 }}
			aria-label={darkMode ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
		>
			{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
		</IconButton>
	);
};
