<script lang="ts">
	import { page } from '$app/stores';
	import IoIosMenu from 'svelte-icons/io/IoIosMenu.svelte';
	import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
	import Icon from '../../components/elements/icon.svelte';
	import Footer from '../../components/footer.svelte';
	import { get_remaining_height } from '../../logic/util';

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
		{
			title: 'Examples',
			description: 'Some examples showcasing features of Ikusa.',
			link: '/docs/examples'
		},
		{ title: 'Combat Logger' },
		{
			title: 'Installation',
			description: 'Learn how to install the combat logger',
			link: '/docs/installation'
		},
		{
			title: 'Configuration',
			description: 'Learn how to configure the combat logger',
			link: '/docs/configuration'
		},
		{
			title: 'Usage',
			description: 'Learn how to use the combat logger',
			link: '/docs/usage'
		},
		{
			title: 'Contributing',
			description: 'Learn how to contribute to the combat logger',
			link: '/docs/contributing'
		},
		{ title: 'Dashboard' },
		{
			title: 'Adding a new war',
			description: 'Learn how to add a new war to your dashboard',
			link: '/docs/adding-a-new-war'
		},
		{
			title: 'Sharing wars',
			description: 'Learn how to share wars with other users',
			link: '/docs/sharing-wars'
		},
		{
			title: 'Explanation of statistics',
			description: 'Learn about the statistics displayed on the dashboard',
			link: '/docs/explanation-of-statistics'
		},

		{ title: 'Appendix' },
		{
			title: 'Troubleshooting',
			description: 'Learn how to troubleshoot common issues',
			link: '/docs/troubleshooting'
		},
		{
			title: 'Frequently Asked Questions',
			description: 'Learn about common questions',
			link: '/docs/faq'
		},
		{
			title: 'Changelog',
			description: 'Learn about the latest changes',
			link: '/docs/changelog'
		}
	];
	let visible = false;
	let container: HTMLElement;

	$: height = get_remaining_height(container);

	let page_entry = $page.route.id;

	$: {
		page_entry = $page.route.id;
		visible = false;
	}
</script>

<div class="flex flex-col" style="height: {height}px;" bind:this={container}>
	<div class="flex gap-2">
		<div class="mr-8 sm:mr-0 flex">
			<button class="sm:hidden absolute" on:click={() => (visible = !visible)}>
				<Icon icon={IoIosMenu} />
			</button>
			<div
				class="sm:w-80 p-2 sm:p-0 sm:relative absolute transition left-0 bg-background border-gold border sm:border-0 sm:border-r rounded-lg sm:rounded-none {visible
					? 'translate-x-4 sm:translate-x-0'
					: '-translate-x-[105%] sm:translate-x-0'} "
			>
				<div class="sm:hidden flex">
					<button on:click={() => (visible = !visible)}>
						<Icon icon={IoIosClose} />
					</button>
				</div>
				<div class="flex flex-col gap-1 ">
					{#each content as entry}
						{#if 'link' in entry}
							<a href={entry.link}>
								<p
									class="font-light {page_entry === entry.link ? 'text-gold' : 'text-gold-muted'}"
									title={entry.description}
								>
									{entry.title}
								</p>
							</a>
						{:else}
							<p
								class="font-bold text-sm text-gold-muted uppercase tracking-wider [&:not(:first-child)]:mt-10"
							>
								{entry.title}
							</p>
						{/if}
					{/each}
				</div>
			</div>
		</div>
		<div class="text-gold-muted">
			<slot />
		</div>
	</div>
	<div class="mt-auto">
		<Footer />
	</div>
</div>
