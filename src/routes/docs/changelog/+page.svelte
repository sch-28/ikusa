<script lang="ts">
	const oracle = {
		name: 'ORACLE',
		image: 'https://avatars.githubusercontent.com/u/42447473?s=48&v=4',
		link: 'https://github.com/sch-28'
	};

	const changes = [
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
</script>

<div class="flex flex-col gap-2">
	{#each changes as change}
		<div class="flex flex-col mb-4">
			<div class="flex items-center gap-2 mb-1">
				<a href={change.author.link} class="text-blue-500"
					><img src={change.author.image} alt="github user" class="w-8 h-8 rounded-full" /></a
				>

				<h2 class="text-2xl font-bold text-gold">{change.version}</h2>
			</div>
			<p class="text-gray-500">{change.date}</p>
			<h3 class="text-xl font-medium text-gold">{change.title}</h3>
			<ul class="list-disc list-inside flex flex-col text-sm">
				{#each change.changes as ch}
					<li>{ch}</li>
				{/each}
			</ul>
			<div class="flex items-center gap-2 mt-2" />
		</div>
	{/each}
</div>
