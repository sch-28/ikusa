<script lang="ts">
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import { onDestroy, onMount } from 'svelte';
	import { scrollbar_width } from '../../logic/util';
	import type { HeaderColumn, Row } from './table';

	export let header: HeaderColumn[] = [];
	export let rows: Row[] = [];

	let header_element: HTMLDivElement;

	$: grid_template =
		`grid-template-columns:` +
		header.map((column) => `minmax(100px, ${column.width ?? 1}fr)`).join(' ') +
		';';

	onMount(() => {
		handle_resize();
		window.addEventListener('resize', handle_resize);
	});

	onDestroy(() => {
		window.removeEventListener('resize', handle_resize);
	});

	function handle_resize() {
		const v_list = document.querySelector('svelte-virtual-list-viewport') as HTMLDivElement;
		v_list.style.width = header_element.scrollWidth + 'px';
	}
</script>

<div class="overflow-x-auto h-full flex flex-col min-w-0">
	<div
		class="items-start grid w-full min-w-0"
		style={grid_template + `padding-right:${scrollbar_width}px`}
		bind:this={header_element}
	>
		{#each header as head}
			<div class="max-w-full">{head.label}</div>
		{/each}
	</div>

	<VirtualList items={rows} let:item={row}>
		<button on:click={row.onclick} class="justify-items-start grid w-full " style={grid_template}>
			{#each row.columns as column}
				<div class="max-w-full">{column}</div>
			{/each}
		</button>
	</VirtualList>
</div>
