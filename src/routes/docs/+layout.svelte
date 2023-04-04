<script lang="ts">
	import { page } from '$app/stores';

	type Item = {
		title: string;
		description: string;
		link: string;
	};
	type Section = {
		title: string;
	};

	const content: (Item | Section)[] = [
		{ title: 'Getting Started' },
		{
			title: 'Introduction',
			description: 'Learn about Ikusa and how it works.',
			link: '/docs/introduction'
		},

		{ title: 'Combat Logger' },
		{
			title: 'Installation',
			description: 'Learn how to install the combat logger',
			link: '/docs/installation'
		},
		{
			title: 'Configuration & Usage',
			description: 'Learn how to configure and use the combat logger',
			link: '/docs/usage'
		},

		{ title: 'Dashboard' },
		{
			title: 'Adding a new war',
			description: 'Learn how to add a new war to your dashboard',
			link: '/docs/adding-a-new-war'
		}
	];
    
</script>

<div class="flex flex-col gap-1">
	{#each content as entry}
		{#if 'link' in entry}
			<a href={entry.link}>
				<p
					class="font-light {$page.params.entry === entry.link.split("/")[2] ? 'text-gold' : 'text-gold-muted'}"
					title={entry.description}
				>
					{entry.title}
				</p>
			</a>
		{:else}
			<p class="font-bold text-gold-muted uppercase tracking-wider [&:not(:first-child)]:mt-4">{entry.title}</p>
		{/if}
	{/each}
</div>
