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

	let page_entry = $page.route.id;

	$: {
		page_entry = $page.route.id;
		visible = false;
	}

	const content: (Item | Section)[] = [
		{ title: 'Settings' },
		{ title: 'General', description: 'General settings', link: '/settings/general' },
		{ title: 'Shared Wars', description: 'Dashboard settings', link: '/settings/shared-wars' }
	];
	let visible = false;
</script>

<div class="flex gap-2">
	<div class="mr-8 sm:mr-0 flex">
		<button class="sm:hidden absolute" on:click={() => (visible = !visible)}>
			<Icon icon={IoIosMenu} />
		</button>
		<div
			class="sm:w-80 p-2 sm:p-0 sm:relative absolute transition left-0 bg-background border-foreground border sm:border-0 sm:border-r rounded-lg sm:rounded-none {visible
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
								class="font-light {page_entry === entry.link ? 'text-foreground' : 'text-foreground-secondary'}"
								title={entry.description}
							>
								{entry.title}
							</p>
						</a>
					{:else}
						<p
							class="font-bold text-sm text-foreground-secondary uppercase tracking-wider [&:not(:first-child)]:mt-10"
						>
							{entry.title}
						</p>
					{/if}
				{/each}
			</div>
		</div>
	</div>
	<slot />
</div>
