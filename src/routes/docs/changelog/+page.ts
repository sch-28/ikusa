import type { PageLoad } from './$types';

export type Change = {
	version: string;
	date: string;
	title: string;
	changes: string[];
	author: {
		name: string;
		image: string;
		link: string;
	};
};

const oracle = {
	name: 'ORACLE',
	image: 'https://avatars.githubusercontent.com/u/42447473?s=48&v=4',
	link: 'https://github.com/sch-28'
};
const changes: Change[] = [
	{
		version: '0.5.1',
		date: '06.01.2025',
		title: 'Deadeye',
		changes: ['Added Deadeye class'],
		author: oracle
	},
	{
		version: '0.5.0',
		date: '07.02.2024',
		title: 'Infrastructure & Storage',
		changes: [
			'Moved website from vercel to cloud server',
			'Moved war storage from localstorage to indexDB',
			'Fixed supabase connection issues',
			'Improved authorization hook performance',
			'Adjusted header layout'
		],
		author: oracle
	},
	{
		version: '0.4.18',
		date: '12.01.2024',
		title: 'Bugs & Scholar',
		changes: ['Fixed a bug with wars without kills', 'Added Scholar class'],
		author: oracle
	},
	{
		version: '0.4.17',
		date: '04.10.2023',
		title: 'Performance & QOL Improvements',
		changes: [
			'Added cancel button to the war-sync loading modal',
			'Fixed an issue with the war sharing system, improving performance'
		],
		author: oracle
	},
	{
		version: '0.4.16',
		date: '27.07.2023',
		title: 'Logger Improvements & Documentation',
		changes: [
			'Added button to the Logger to restart it with developer mode enabled',
			'Added some additional error handling for the previous network interface changes',
			'Added some NA servers to the server list for the Logger',
			'Improved the Ikusa documentation'
		],
		author: oracle
	},
	{
		version: '0.4.15',
		date: '22.07.2023',
		title: 'Logger Improvements & Fixes',
		changes: [
			'Added Logger settings, allowing the user to change the sniffing target',
			'Added Logger updater that now also updates the logging executable',
			'Fixed chart menubar dropdown color'
		],
		author: oracle
	},
	{
		version: '0.4.14',
		date: '19.07.2023',
		title: 'Fixes & Improvements',
		changes: [
			'Fixed Login issue',
			'Added redirect to previous page after login',
			'Fixed war graph not loading on first render',
			'Fixed duplicate logs in the logger'
		],
		author: oracle
	},
	{
		version: '0.4.13',
		date: '17.07.2023',
		title: 'Logger Improvements',
		changes: ['Fix open recording issue', 'Fix overflow on with larger screen fonts'],
		author: oracle
	},
	{
		version: '0.4.12',
		date: '16.07.2023',
		title: 'Chart & Performance Improvements',
		changes: [
			'Fix chart label time format',
			'Improved navigation speed',
			'Player-Sync work in progress'
		],
		author: oracle
	},
	{
		version: '0.4.11',
		date: '16.07.2023',
		title: 'Timeline & Chart Improvements',
		changes: [
			'Added timeline to the war view',
			'Fixed an issue with the chart and date formats',
			'Added a padding to the shared war preview'
		],
		author: oracle
	},
	{
		version: '0.4.10',
		date: '15.07.2023',
		title: 'Refactoring & Fixes',
		changes: [
			'Improved FAQ',
			'Fixed Suggestion overflow',
			'Added Privacy Policy',
			'Removed Vercel analytics',
			'Fixed dashboard-layout title overflow'
		],
		author: oracle
	},
	{
		version: '0.4.9',
		date: '14.07.2023',
		title: 'Suggestions & Refactoring',
		changes: [
			'Added suggestions page',
			'Fixed GitHub & Discord links',
			'Refactored the form styling slightly'
		],
		author: oracle
	},
	{
		version: '0.4.8',
		date: '13.07.2023',
		title: 'Class issue & Fixes',
		changes: [
			'Updating your local data (e.g. uploading a war) caused all class data to be deleted. This issue has been resolved.',
			'The redirect after deleting a war now works correctly',
			'Fixed an issue with the "Add to Dashboard" redirect'
		],
		author: oracle
	},
	{
		version: '0.4.7',
		date: '11.07.2023',
		title: 'Mobile Layout',
		changes: ['Improved mobile layout of all views'],
		author: oracle
	},
	{
		version: '0.4.6',
		date: '06.07.2023',
		title: 'Performance & Fixes',
		changes: [
			'Fixed invalidation of logged-in user data',
			'Fixed share loading indicator lag',
			'Fixed the search functionality in the class tables',
			'Resolved an issue with the logger that caused recording issues'
		],
		author: oracle
	},
	{
		version: '0.4.5',
		date: '03.07.2023',
		title: 'Automatic BDO-Sync & Logger issue message',
		changes: [
			'Automatically syncs BDO data if the user has not disabled it',
			'Added a message to the logger indicating the current halting issue',
			'Fixed an issue that caused the class data to dissapear after an update'
		],
		author: oracle
	},
	{
		version: '0.4.4',
		date: '02.07.2023',
		title: 'Class view & Logger performance',
		changes: [
			'Added individual class view',
			'Improved logger performance',
			'Fixed a BDO-Sync issue'
		],
		author: oracle
	},
	{
		version: '0.4.3',
		date: '01.07.2023',
		title: 'Classes & Layout Improvements',
		changes: [
			'Added class overview',
			'Refactored the layout',
			'Added class specific colors to the charts',
			'Fixed some mobile layout issues'
		],
		author: oracle
	},
	{
		version: '0.4.2',
		date: '29.06.2023',
		title: 'Stability & Fixes',
		changes: [
			'Logger adjustments to improve stability',
			'Resolved a memory leak of the logger',
			'Fixed an issue with the parsing of logs that caused invalid guild names'
		],
		author: oracle
	},
	{
		version: '0.4.1',
		date: '28.06.2023',
		title: 'Chart Improvements & War Class Overview',
		changes: ['Improved issues & performance of charts', 'Added war class chart & table'],
		author: oracle
	},
	{
		version: '0.4.0',
		date: '25.06.2023',
		title: 'BDO Sync',
		changes: [
			'The logger now also saves the character names (can be disabled)',
			'Added BDO Sync for wars: using the character names, ikusa is able to fetch the official BDO Camping Grounds Website to fetch class information for all players. I am planning to add further class specific data tools, e.g. visualizing class distribution',
			'Fixed several issues'
		],
		author: oracle
	},
	{
		version: '0.3.1',
		date: '22.06.2023',
		title: 'New, additional backend',
		changes: [
			'Image preview service is now being handled seperatly to improve performance',
			'Prepared backend for class api endpoint',
			'Moved compression system to a web worker, this should drastically improve performance for sharing',
			'Added mounting loading indicator'
		],
		author: oracle
	},
	{
		version: '0.3.0',
		date: '20.06.2023',
		title: 'Migration',
		changes: [
			'Added a banner to https://nodewar.oracle-tools.site/ to inform users that the development of the site has been discontinued',
			'Added migration endpoint to ikusa, allowing easy migration from the old site to ikusa'
		],
		author: oracle
	},
	{
		version: '0.2.7',
		date: '18.06.2023',
		title: 'Exports & Responsiveness',
		changes: [
			'Wars can now be exported as *.log files',
			'Fixed naming issue of wars',
			'Fixed mobile overflow of tables',
			'Fixed the logger upload option'
		],
		author: oracle
	},
	{
		version: '0.2.6',
		date: '17.06.2023',
		title: 'Sharability & Logger fix',
		changes: [
			'Logger update: fixed an issue with the logger executable that caused inaccuracies',
			'Added share modal w/ copy-to-clipboard functionality',
			'Fixed some minor issues'
		],
		author: oracle
	},
	{
		version: '0.2.5',
		date: '16.06.2023',
		title: 'Meta Information & Logger Update',
		changes: [
			'Logger update: removed debug inspector & added discord to the footer',
			'Meta tags: added meta information to the website, and custom meta data for the shared wars',
			'Table improvements & fixes',
			'Published ikusa repository on GitHub'
		],
		author: oracle
	},
	{
		version: '0.2.4',
		date: '15.06.2023',
		title: 'Table Improvements & Header Changes',
		changes: ['Consistent table state', 'Individual column width fill', 'Responsive header'],
		author: oracle
	},
	{
		version: '0.2.3',
		date: '14.06.2023',
		title: 'Table Improvements',
		changes: ['Resizable table columns', 'Auto fit option', 'Fixed auto scroll issue'],
		author: oracle
	},
	{
		version: '0.2.2',
		date: '11.06.2023',
		title: 'Landing Page & Documentation',
		changes: [
			'Extended Landing page',
			'Refactored documentation',
			'List of shared wars',
			'Shared wars can now be deleted',
			'Graph date format toggle',
			'Multi-Add improvements',
			'Slight style adjustments',
			'Minor fixes'
		],
		author: oracle
	},
	{
		version: '0.2.1',
		date: '10.06.2023',
		title: 'Ikusa Logger',
		changes: [
			'Connected the Logger to the Ikusa API',
			'Logger auto patcher',
			'Logger config settings',
			'Logger installer'
		],
		author: oracle
	},
	{
		version: '0.2.0',
		date: '09.06.2023',
		title: 'Deployment',
		changes: ['Deployed the website'],
		author: oracle
	},
	{
		version: '0.1.4',
		date: '03.06.2023',
		title: 'Visual Overhaul',
		changes: ['Adjusted the overall theme', 'Fixed some minor bugs'],
		author: oracle
	},
	{
		version: '0.1.3',
		date: '12.04.2023',
		title: 'Documentation & Bugfixes',
		changes: [
			'Added usage and contributing documentation',
			'Apex Charts SSR error fixed',
			'Apex Charts placeholder',
			'Re-added deletion of shared wars'
		],
		author: oracle
	},
	{
		version: '0.1.2',
		date: '11.04.2023',
		title: 'Errors and Redirects',
		changes: [
			'Added a fallback error page',
			'Adjusted the discord redirect page to better fit the new design',
			'Removed the old toast colors and also adjusted it to fit the new design',
			'The user is now redirected and a toast is shown when a player, war or guild is not found',
			'Removed the overflow of the landing page',
			'Added configuration, installation and introduction to the documentation',
			'Favicon and Title are now set'
		],
		author: oracle
	},
	{
		version: '0.1.1',
		date: '10.04.2023',
		title: 'Adjustments',
		changes: [
			'Adjusted the description for a players join duration',
			'Added a percentage sign for the join duration',
			'A selected Guild or War is now indicated by a yellow background',
			'Added a Footer',
			'Added this Changelog',
			'Sidebar autocloses when a link is clicked'
		],
		author: oracle
	},
	{
		version: '0.1.0',
		date: '10.04.2023',
		title: 'Alpha Release',
		changes: [
			'War Upload',
			'Multi War Upload',
			'Custom Tables',
			'Guild View',
			'Player View',
			'War View',
			'Performance immensely improved compares to the old version',
			'Discord Auth'
		],
		author: oracle
	}
];

export const load: PageLoad = (event) => {
	const version = event.url.searchParams.get('version');
	if (version) {
		const change = changes.find((c) => c.version === version);
		if (change) {
			return {
				subtitle: change.date,
				title: `Ikusa | Version ${change.version}`,
				description: change.changes.map((c) => `- ${c}`).join('\n'),
				changes,
				change
			};
		}
	}

	return {
		changes
	};
};
