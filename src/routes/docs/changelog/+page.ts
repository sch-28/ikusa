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
