<script lang="ts">
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import { onDestroy, onMount } from 'svelte';
	import { scrollbar_width } from '../../logic/util';
	import type { HeaderColumn, Row } from './table';
	import FaSort from 'svelte-icons/fa/FaSort.svelte';
	import FaSortUp from 'svelte-icons/fa/FaSortUp.svelte';
	import FaSortDown from 'svelte-icons/fa/FaSortDown.svelte';
	import Icon from '../elements/icon.svelte';

	export let header: HeaderColumn<any>[] = [];
	export let rows: Row[] = [];
	let sorted_rows: Row[] = [];

	let header_element: HTMLDivElement;
	let current_sort: HeaderColumn<any> | undefined = undefined;

	$: grid_template =
		`grid-template-columns:` +
		header.map((column) => `minmax(100px, ${column.width ?? 1}fr)`).join(' ') +
		';';

	onMount(() => {
		handle_resize();
		sorted_rows = rows;
		window.addEventListener('resize', handle_resize);
	});

	onDestroy(() => {
		window.removeEventListener('resize', handle_resize);
	});

	function handle_resize() {
		const v_list = document.querySelector('svelte-virtual-list-viewport') as HTMLDivElement;
		v_list.style.width = header_element.scrollWidth + 'px';
	}

	function handle_sort_change(column: HeaderColumn<any>) {
		if (current_sort && current_sort !== column) {
			current_sort.sort_dir = undefined;
		}

		if (column.sortable) {
			if (column.sort_dir === 'asc') {
				column.sort_dir = 'desc';
			} else if (column.sort_dir === 'desc') {
				column.sort_dir = undefined;
			} else {
				column.sort_dir = 'asc';
			}

			current_sort = column;
			handle_sort(column);
		}
		header = header;
	}

	function default_sort(a: any, b: any) {
		if (a < b) {
			return -1;
		} else if (a > b) {
			return 1;
		} else {
			return 0;
		}
	}

	function handle_sort(column: HeaderColumn<any>) {
		if (column.sortable) {
			const col_index = header.indexOf(column);

			if (column.sort_dir === undefined) {
				sorted_rows = [...rows];
				return;
			}

			sorted_rows = [...rows].sort((a, b) => {
				const a_val = a.columns[col_index];
				const b_val = b.columns[col_index];

				if (column.sort_dir === 'asc') {
					return column.sort?.(a_val, b_val) ?? default_sort(a_val, b_val);
				} else if (column.sort_dir === 'desc') {
					return column.sort?.(b_val, a_val) ?? default_sort(b_val, a_val);
				} else {
					return 0;
				}
			});
		}
	}
</script>

<div class="overflow-x-auto h-full flex flex-col min-w-0">
	<div
		class="items-start grid w-full min-w-0"
		style={grid_template + `padding-right:${scrollbar_width}px`}
		bind:this={header_element}
	>
		{#each header as head}
			<button
				class="max-w-full flex items-center {head.sortable ? 'cursor-pointer' : 'cursor-default'}"
				on:click={() => handle_sort_change(head)}
			>
				<span>{head.label}</span>
				{#if head.sortable}
					{#if head.sort_dir === 'asc'}
						<Icon icon={FaSortUp} />
					{:else if head.sort_dir === 'desc'}
						<Icon icon={FaSortDown} />
					{:else}
						<Icon icon={FaSort} />
					{/if}
				{/if}
			</button>
		{/each}
	</div>

	<VirtualList items={sorted_rows} let:item={row}>
		<button on:click={row.onclick} class="justify-items-start grid w-full " style={grid_template}>
			{#each row.columns as column}
				<div class="max-w-full">{column}</div>
			{/each}
		</button>
	</VirtualList>
</div>
