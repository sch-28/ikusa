/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			screens:{
				xs: '500px',
			},
			colors: {
				gold: {
					DEFAULT: '#f5cd40',
					muted: '#bd8e28',
					50: '#fbfaf3',
					100: '#f9efb8',
					200: '#f1dc7b',
					300: '#f5cd40',
					400: '#bd8e28',
					500: '#9e6f14',
					600: '#81560d',
					700: '#63400c',
					800: '#442c0b',
					900: '#2e1c08'
				},
				yellow: {
					50: '#faf9f1',
					100: '#f6efb4',
					200: '#eae075',
					300: '#cdbf45',
					400: '#9c9824',
					500: '#797a11',
					600: '#61620b',
					700: '#4b4a0b',
					800: '#33330a',
					900: '#231f08'
				},
				green: {
					DEFAULT: '1f5b26',
					50: '#f2f6f3',
					100: '#e0efe6',
					200: '#b8e5c7',
					300: '#7fc997',
					400: '#3ba966',
					500: '#298e40',
					600: '#23772e',
					700: '#1f5b26',
					800: '#173f1f',
					900: '#102718'
				},
				submarine: {
					50: '#eff5f5',
					100: '#d0eff3',
					200: '#9ae5e4',
					300: '#61cbc4',
					400: '#27ac9d',
					500: '#1c9177',
					600: '#197a5e',
					700: '#185e4a',
					800: '#124037',
					900: '#0c2829'
				},
				navy: {
					DEFAULT: '#244e74',
					50: '#f2f7f8',
					100: '#d8f0f8',
					200: '#ade1f1',
					300: '#79c3de',
					400: '#42a0c5',
					500: '#3181ad',
					600: '#2a6794',
					700: '#244e74',
					800: '#1a3553',
					900: '#102138'
				},
				cyan: {
					50: '#f5f8fa',
					100: '#dff0fb',
					200: '#bcdcf7',
					300: '#8ebceb',
					400: '#6096dc',
					500: '#4a74ce',
					600: '#3e58ba',
					700: '#314297',
					800: '#232d6d',
					900: '#151c46'
				},
				indigo: {
					50: '#f8f9fb',
					100: '#eaeffb',
					200: '#d4d6f7',
					300: '#b1b2ec',
					400: '#9489df',
					500: '#7b65d4',
					600: '#6549c1',
					700: '#4d379d',
					800: '#352670',
					900: '#1e1844'
				},
				purple: {
					50: '#fafafb',
					100: '#f2eff9',
					200: '#e4d3f4',
					300: '#cbace4',
					400: '#b981d2',
					500: '#a15dc1',
					600: '#8642a9',
					700: '#663184',
					800: '#46225a',
					900: '#291634'
				},
				cerise: {
					50: '#fcfbfa',
					100: '#faefee',
					200: '#f5d0de',
					300: '#e8a5bc',
					400: '#e27696',
					500: '#d25376',
					600: '#b93957',
					700: '#912b40',
					800: '#671e2b',
					900: '#3f1318'
				},
				cocoa: {
					50: '#fcfbf8',
					100: '#faefdc',
					200: '#f5d5b8',
					300: '#e7ac86',
					400: '#db7e58',
					500: '#c75c38',
					600: '#ab4225',
					700: '#85311d',
					800: '#5d2216',
					900: '#3b160e'
				}
			}
		}
	},
	plugins: [require('flowbite/plugin')],
	darkMode: 'class'
};
