module.exports = {
	mode: 'jit',
	purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				primary: '#1300BA',
				'dark-primary-1': '#1F1D23',
				'dark-primary-2': '#26222C',
				'dark-primary-3': '#2C2835',
				'dark-primary-4': '#332D3E',
				'dark-primary-5': '#3A3346',
				'dark-primary-6': '#40384F',
				'dark-primary-7': '#473E58',
				'dark-primary-8': '#4D4360',
				'dark-primary-9': '#544869',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
