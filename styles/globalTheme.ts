import { createTheme } from '@mui/material/styles';

const GlobalTheme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 900,
			lg: 1200,
			xl: 1536,
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				contained: {
					fontSize: '0.875rem',
					width: '40%',
					background: '#333',
					'&:hover': {
						background: '#333',
					},
				},
			},
		},
		MuiCssBaseline: {
			styleOverrides: {
				html: {
					fontSize: '62.5%',
					'@media (max-width:1000px)': {
						fontSize: '50%',
					},
					'@media (max-width:550px)': {
						fontSize: '40%',
					},
				},
				'*': {
					margin: 0,
					padding: 0,
					boxsizing: 'border-box',
				},
				fontFamily: ['Nunito', 'san-serif'].join(','),
			},
		},
	},
});

GlobalTheme.palette.primary.main = '#333';
GlobalTheme.palette.primary.main = '#333';
GlobalTheme.palette.secondary.main = '#fff';
GlobalTheme.palette.secondary.light = '#fff';
GlobalTheme.palette.background.default = '#ffffff';

GlobalTheme.typography.body1 = {
	fontSize: '1.4rem',
	fontWeight: 800,
};

GlobalTheme.typography.body2 = {
	fontSize: '1rem',
	fontWeight: 400,
};

GlobalTheme.typography.h1 = {
	fontSize: '12rem',
	fontWeight: 900,
	letterSpacing: '0.5rem',
};

GlobalTheme.typography.h2 = {
	fontSize: '10rem',
	fontWeight: 900,
	letterSpacing: '0.5rem',
	margin: '2rem 0',
};

GlobalTheme.typography.h3 = {
	fontSize: '8rem',
	fontWeight: 900,
	letterSpacing: '0.5rem',
	margin: '2rem 0',
};

GlobalTheme.typography.h4 = {
	fontSize: '6rem',
	fontWeight: 900,
	letterSpacing: '0.5rem',
	margin: '2rem 0',
};

GlobalTheme.typography.h5 = {
	fontSize: '4rem',
	fontWeight: 900,
	letterSpacing: '0.5rem',
	margin: '2rem 0',
};

GlobalTheme.typography.h6 = {
	fontSize: '2.5rem',
	fontWeight: 900,
};

export default GlobalTheme;
