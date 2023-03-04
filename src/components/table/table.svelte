<script lang="ts">
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import { onDestroy, onMount } from 'svelte';
	import { scrollbar_width } from '../../logic/util';
	import type { HeaderColumn, Row } from './table';
	import FaSort from 'svelte-icons/fa/FaSort.svelte';
	import FaSortUp from 'svelte-icons/fa/FaSortUp.svelte';
	import FaSortDown from 'svelte-icons/fa/FaSortDown.svelte';
	import Icon from '../elements/icon.svelte';
	import Input from '../elements/input.svelte';

	export let header: HeaderColumn<any>[] = [];
	export let rows: Row[] = [];
	export let searchable: boolean = false;
	export let title: string = '';
	export let height: number = 300;

	export let instance: HTMLDivElement | undefined = undefined;

	let sorted_rows: Row[] = [];
	let search_string: string = '';
	let header_element: HTMLDivElement;
	let current_sort: HeaderColumn<any> | undefined = undefined;
	let v_list: HTMLDivElement;

	$: {
		height;
		header;
		rows;
		search_string;
		handle_sort();
	}

	$: grid_template =
		`grid-template-columns:` +
		header.map((column) => `minmax(75px, ${column.width ?? 1}fr)`).join(' ') +
		';';

	onMount(() => {
		v_list = document.querySelector('svelte-virtual-list-viewport') as HTMLDivElement;
		handle_resize();
		sorted_rows = rows;
		window.addEventListener('resize', handle_resize);
	});

	onDestroy(() => {
		window.removeEventListener('resize', handle_resize);
	});

	function handle_resize() {
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
			handle_sort();
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

	function handle_sort() {
		sorted_rows = [...rows];
		if (current_sort && current_sort.sortable && current_sort.sort_dir !== undefined) {
			const col_index = header.indexOf(current_sort);
			sorted_rows = [...rows].sort((a, b) => {
				if (!current_sort) return 0;

				const a_val = a.columns[col_index];
				const b_val = b.columns[col_index];

				if (current_sort.sort_dir === 'asc') {
					return current_sort.sort?.(a_val, b_val) ?? default_sort(a_val, b_val);
				} else if (current_sort.sort_dir === 'desc') {
					return current_sort.sort?.(b_val, a_val) ?? default_sort(b_val, a_val);
				} else {
					return 0;
				}
			});
		}

		sorted_rows = sorted_rows.filter((row) => {
			if (!search_string) return true;

			return row.columns.some((column) => {
				if (typeof column === 'string') {
					return column.toLowerCase().includes(search_string.toLowerCase());
				} else if (typeof column === 'number') {
					return column.toString().includes(search_string);
				} else {
					return false;
				}
			});
		});

		scroll_top();
	}

	function scroll_top() {
		if (v_list) v_list.scrollTop = 0;
	}
</script>

<div
	class="overflow-x-auto h-full flex flex-col min-w-0 relative"
	style="height: {height}px;"
	bind:this={instance}
>
	{#if searchable}
		<Input
			class="mb-2 sm:max-w-[12rem] max-w-[8rem] shrink"
			placeholder="Search..."
			bind:value={search_string}
			size="sm"
		/>
	{/if}
	<div class="absolute left-1/2 -translate-x-1/2 text-xl font-bold">{title}</div>
	<div
		class="items-start grid w-full min-w-0"
		style={grid_template + `padding-right:${scrollbar_width}px`}
		bind:this={header_element}
	>
		{#each header as head, index}
			<button
				class="max-w-full flex items-center font-bold 
				{index > 0 ? 'justify-self-center' : ''}
				{head.sortable ? 'cursor-pointer' : 'cursor-default'}"
				on:click={() => handle_sort_change(head)}
			>
				<span class="truncate" title={head.label}>{head.label}</span>
				{#if head.sortable}
					{#if head.sort_dir === 'asc'}
						<Icon class="hidden sm:block" icon={FaSortUp} />
					{:else if head.sort_dir === 'desc'}
						<Icon class="hidden sm:block" icon={FaSortDown} />
					{:else}
						<Icon class="hidden sm:block" icon={FaSort} />
					{/if}
				{/if}
			</button>
		{/each}
	</div>
	{#key height}
		<VirtualList items={sorted_rows} let:item={row}>
			<button
				on:click={row.onclick}
				class="grid w-full text-gold-muted hover:text-gold"
				style={grid_template}
			>
				{#each row.columns as column, index}
					<div class="max-w-full {index > 0 ? 'justify-self-center' : 'justify-self-start'}">
						{column}
					</div>
				{/each}
			</button>
		</VirtualList>
	{/key}
</div>
