import { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/**/*.{js,ts,jsx,tsx}', // Ensure all relevant files are included
	],
	theme: {
		extend: {
			colors: {
				primary: '#FF69B4', // Custom primary color
				secondary: '#F0E68C', // Custom secondary color
			},
			fontFamily: {
				sans: ['Geist', 'sans-serif'], // Custom font family
			},
		},
	},
	plugins: [], // Ensure no conflicting or missing plugins
};

export default config;
