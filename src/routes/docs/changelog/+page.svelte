<script lang="ts">
	const oracle = {
		name: 'ORACLE',
		image: 'https://avatars.githubusercontent.com/u/42447473?s=48&v=4',
		link: 'https://github.com/sch-28'
	};

	const changes = [
		{
			version: '0.0.2',
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
			version: '0.0.1',
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
			<div class="flex items-center gap-2">
				<a href={change.author.link} class="text-blue-500"
					><img src={change.author.image} alt="github user" class="w-8 h-8 rounded-full" /></a
				>

				<h2 class="text-2xl font-bold">{change.version}</h2>
			</div>
			<p class="text-gray-500">{change.date}</p>
			<h3 class="text-xl font-medium">{change.title}</h3>
			<ul class="list-disc list-inside flex flex-col text-gold-muted text-sm">
				{#each change.changes as ch}
					<li>{ch}</li>
				{/each}
			</ul>
			<div class="flex items-center gap-2 mt-2" />
		</div>
	{/each}
</div>
