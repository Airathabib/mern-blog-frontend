// src/theme.js
import { createTheme } from '@mui/material/styles';

const createShadows = () => {
	const shadows = Array(25).fill('none');
	shadows[1] = '0px 1px 3px 0px rgba(0,0,0,0.12)';
	shadows[2] = '0px 3px 6px 0px rgba(0,0,0,0.16)';
	// Добавим ещё пару уровней для полноты
	shadows[3] = '0px 4px 8px 0px rgba(0,0,0,0.2)';
	shadows[4] = '0px 6px 12px 0px rgba(0,0,0,0.24)';
	// Остальные можно оставить "none" или скопировать из MUI по умолчанию
	return shadows;
};
const commonThemeSettings = {
	components: {
		MuiContainer: {
			styleOverrides: {
				maxWidthLg: {
					maxWidth: '1440px !important', // ← увеличиваем до 1440px
				},
			},
		},
	},
};


const defaultTransition = {
	duration: {
		shortest: 150,
		shorter: 200,
		short: 250,
		standard: 300,
		complex: 375,
		enteringScreen: 225,
		leavingScreen: 195,
	},
	easing: {
		easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
		easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
		easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
		sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
	},
};

export const lightTheme = createTheme({
	...commonThemeSettings,
	palette: {
		mode: 'light',
		primary: {
			main: '#4361ee', // твой текущий primary
		},
		background: {
			default: '#f5f5f5',
			paper: '#ffffff',
		},
		text: {
			primary: '#333333',
			secondary: '#666666',
		},
	},
	typography: {
		fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		button: {
			textTransform: 'none',
			fontWeight: 400,
		},

	},
	transitions: defaultTransition,
	shadows: createShadows()
});

export const darkTheme = createTheme({
	...commonThemeSettings,
	palette: {
		mode: 'dark',
		primary: {
			main: '#90caf9', // светло-голубой для тёмной темы
		},
		background: {
			default: '#343434',
			paper: '#1c1b1b',
		},
		text: {
			primary: '#ffffff',
			secondary: '#b0b0b0',
		},
	},
	typography: {
		fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		button: {
			textTransform: 'none',
			fontWeight: 400,
		},
	},
	transitions: defaultTransition,
	shadows: createShadows()
});
