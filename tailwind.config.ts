import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		screens: {
			xsm: '320px',
			sm: '480px',
			md: '768px',
			lg: '976px',
			xl: '1440px',
		},
		extend: {
			typography: {
				DEFAULT: {
					css: {
						'code::before': {
							content: '""',
						},
						'code::after': {
							content: '""',
						},
					},
				},
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			colors: {
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				accent: 'var(--color-accent)',
				background: 'var(--color-background)',
				surface: 'var(--color-surface)',
				selection: 'var(--color-selection)',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'], // Custom font
				serif: ['Merriweather', 'serif'],
			},
			spacing: {
				'128': '32rem', // Custom spacing value
			},
			borderRadius: {
				'none': '0',
				'sm': '0.125rem',
				'md': '0.375rem',
				'lg': '0.5rem',
				'xl': '0.75rem',
				'2xl': '1rem',
				'3xl': '1.5rem',
				'4xl': '2rem',  // Custom border radius
			},
		},
	},
	darkMode: 'class',
	plugins: [nextui(),
	require('@tailwindcss/typography')
	]
};
export default config;
