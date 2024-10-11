<script lang="ts">
	import { onMount } from 'svelte';
	import type { Change } from './+page';

	export let data: { changes: Change[]; change?: Change };
	$: ({ changes, change } = data);

	onMount(() => {
		if (change) {
			const el = document.getElementById(change.version);
			if (el) {
				el.scrollIntoView({ behavior: 'smooth' });
			}
		}
	});
</script>

<div class="flex flex-col gap-2">
	{#each changes as change}
		<div class="flex flex-col mb-4" id={change.version}>
			<div class="flex items-center gap-2 mb-1">
				<a href={change.author.link} class="text-blue-500"
					><img src={change.author.image} alt="github user" class="w-8 h-8 rounded-full" /></a
				>

				<h2 id={change.version} class="text-2xl font-bold text-gold">{change.version}</h2>
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
