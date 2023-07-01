<script lang="ts" context="module">
	export type Option = {
		title: string;
		values: string[];
	};
</script>

<script lang="ts">
	import LoadingCircle from '../elements/loading-circle.svelte';

	export let loading = false;
	export let stats: string[] = [];
	export let options: Option[] | undefined = undefined;
	export let selected: Option | undefined = undefined;

</script>

{#if !loading}
	<div class="flex items-start mb-4">
		<slot name="title" />
		<div class="flex gap-2 ml-auto justify-center my-auto">
			<slot name="actions" />
		</div>
	</div>
	<div class="mb-4 divide-x-2 space-x-2 flex divide-foreground-secondary overflow-x-auto whitespace-nowrap pb-1">
		{#each stats as stat}
			<div class="pl-2 first:pl-0">{stat}</div>
		{/each}
	</div>
	<div
		class="flex gap-4 sm:flex-row flex-col border border-foreground border-dashed p-2 rounded-lg"
	>
		{#if options}
			<div
				class="flex sm:flex-col gap-2 w-fit mx-auto sm:mx-0 shrink-0 overflow-y-auto pr-2 flex-wrap sm:flex-nowrap sm:h-[420px] justify-center sm:justify-start"
			>
				{#each options as option}
					<button
						class="flex flex-col p-2 border border-foreground rounded-lg min-w-0 h-[126px] aspect-square {selected ===
						option
							? 'bg-foreground text-black'
							: ''}"
						on:click={() => (selected = selected === option ? undefined : option)}
					>
						<div class="text-lg truncate font-bold w-full text-left">{option.title}</div>
						{#each option.values as value}
							<div class="flex gap-1 text-sm font-light">
								{value}
							</div>
						{/each}
					</button>
				{/each}
			</div>
		{/if}
		<div class="w-full min-w-0">
			<slot name="content" />
		</div>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
		<slot name="fields" />
	</div>
{:else}
	<div
		class="w-12 h-12 [&_svg]:!fill-gold [&_svg]:!text-gold-800 [&_svg]:dark:!text-dark-muted absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
	>
		<LoadingCircle />
	</div>
{/if}
