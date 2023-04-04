<script lang="ts">
	import { page } from '$app/stores';
	import IoIosMenu from 'svelte-icons/io/IoIosMenu.svelte';
	import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
	import Icon from '../../components/elements/icon.svelte';

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
			// description: 'Learn how to install the combat logger',
			link: '/docs/installation'
		},
		{
			title: 'Configuration & Usage',
			// description: 'Learn how to configure and use the combat logger',
			link: '/docs/usage'
		},

		{ title: 'Dashboard' },
		{
			title: 'Adding a new war',
			description: 'Learn how to add a new war to your dashboard',
			link: '/docs/adding-a-new-war'
		}
	];
	let visible = false;
</script>

<button class="sm:hidden block" on:click={() => (visible = !visible)}>
	<Icon icon={IoIosMenu} />
</button>
<div
	class="flex flex-col gap-1 sm:relative absolute transition top-0 bottom-0 left-0 bg-black border-gold border rounded-lg {visible
		? 'translate-x-4'
		: '-translate-x-full'} "
>
	<div class="sm:hidden block mb-52">
		<button on:click={() => (visible = !visible)}>
			<Icon icon={IoIosClose} />
		</button>
	</div>
	{#each content as entry}
		{#if 'link' in entry}
			<a href={entry.link}>
				<p
					class="font-light {$page.params.entry === entry.link.split('/')[2]
						? 'text-gold'
						: 'text-gold-muted'}"
					title={entry.description}
				>
					{entry.title}
				</p>
			</a>
		{:else}
			<p class="font-bold text-gold-muted uppercase tracking-wider [&:not(:first-child)]:mt-4">
				{entry.title}
			</p>
		{/if}
	{/each}
</div>
