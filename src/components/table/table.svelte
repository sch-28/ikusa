<script lang="ts">
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import { onDestroy, onMount } from 'svelte';
	import { debounce, scrollbar_width } from '../../logic/util';
	import {
		TableSort,
		type HeaderColumn,
		type Row,
		type RowObject,
		type RowElement,
		type TableData
	} from './table';
	import FaSort from 'svelte-icons/fa/FaSort.svelte';
	import FaSortUp from 'svelte-icons/fa/FaSortUp.svelte';
	import FaSortDown from 'svelte-icons/fa/FaSortDown.svelte';
	import Icon from '../elements/icon.svelte';
	import Input from '../elements/input.svelte';
	import { draggable } from '@neodrag/svelte';
	import MdZoomOutMap from 'svelte-icons/md/MdZoomOutMap.svelte';
	import IoMdCode from 'svelte-icons/io/IoMdCode.svelte';

	export let header: HeaderColumn[] = [];
	export let rows: Row[] = [];
	export let searchable: boolean = false;
	export let title: string = '';
	export let height: number = 300;
	export let id: string;

	export let instance: HTMLDivElement | undefined = undefined;

	let sorted_rows: Row[] = [];
	let search_string: string = '';
	let header_element: HTMLDivElement;
	let current_sorts: HeaderColumn[] = [];
	let v_list: HTMLDivElement;

	let v_list_container: VirtualList;

	$: {
		height;
		rows;
		search_string;
		handle_sort();
	}

	$: {
		if (search_string) {
			const table = $TableSort.find((sort) => sort.table_id === id);
			if (table) {
				table.search = search_string;
			} else {
				$TableSort.push({ table_id: id, search: search_string, scroll_y: 0, sorts: current_sorts });
			}
		}
	}

	const update_table_store_debounced = debounce(update_table_store, 500);

	function update_table_store() {
		const table = $TableSort.find((sort) => sort.table_id === id);
		const columnSizes = header.reduce((acc: Record<string, number>, col) => {
			if (col.width) acc[col.label] = col.width;
			return acc;
		}, {});
		if (table) {
			table.search = search_string;
			table.columnSizes = columnSizes;
			$TableSort = $TableSort;
		} else {
			$TableSort.push({
				table_id: id,
				search: search_string,
				scroll_y: 0,
				sorts: current_sorts,
				columnSizes
			});
		}
	}

	$: {
		if (v_list_container) {
			update_v_list();
			load_cached_table();
		}
	}

	$: {
		search_string;
		header;
		update_table_store_debounced();
	}

	function update_v_list() {
		v_list = document.querySelector('svelte-virtual-list-viewport') as HTMLDivElement;
		if (v_list) {
			v_list.addEventListener('scroll', handle_scroll);
			v_list.style.minWidth = 'fit-content';
			v_list.style.overflowY = 'scroll';
		}
	}

	function load_cached_table() {
		const table = $TableSort.find((sort) => sort.table_id === id);
		if (!table) return;
		if (table.columnSizes === undefined || table.columnSizes.length === 0) {
			fitTable();
		}
		header.forEach((col) => {
			col.width = table.columnSizes?.[col.label] ?? col.width;
		});
		current_sorts =
			(table.sorts
				.map((sort) => header.find((col) => col.label === sort.label))
				.filter((col) => col !== undefined) as HeaderColumn[]) ?? [];

		current_sorts.forEach((col) => {
			col.sort_dir = table.sorts.find((sort) => sort.label === col.label)?.sort_dir;
		});
		search_string = table.search ?? '';
		handle_sort(table.scroll_y);
	}

	onDestroy(() => {
		v_list?.removeEventListener('scroll', handle_scroll);
	});

	function handle_scroll() {
		const data = $TableSort.find((sort) => sort.table_id === id);
		if (data) {
			data.scroll_y = v_list.scrollTop;
		} else {
			$TableSort.push({
				table_id: id,
				sorts: current_sorts,
				scroll_y: v_list.scrollTop
			});
		}
	}

	function handle_sort_change(column: HeaderColumn, multiple = false) {
		if (!current_sorts.includes(column) && !multiple) {
			current_sorts.forEach((col) => {
				col.sort_dir = undefined;
			});
			current_sorts = [];
		} else if (current_sorts.includes(column) && !multiple) {
			current_sorts.forEach((col) => {
				if (col !== column) col.sort_dir = undefined;
			});
			current_sorts = current_sorts.filter((col) => col === column);
		}

		if (column.sortable) {
			if (column.sort_dir === 'asc') {
				column.sort_dir = 'des';
			} else if (column.sort_dir === 'des') {
				column.sort_dir = undefined;
			} else {
				column.sort_dir = 'asc';
			}

			if (!current_sorts.includes(column)) {
				current_sorts.push(column);
			}
		}
		handle_sort();

		const table_sort = $TableSort.find((sort) => sort.table_id === id);
		if (table_sort) {
			table_sort.sorts = current_sorts;
		} else {
			$TableSort.push({
				table_id: id,
				sorts: current_sorts,
				scroll_y: 0
			});
		}
	}

	function default_sort(
		a: RowElement,
		b: RowElement,
		...alt: [RowElement, RowElement, 'asc' | 'des'][]
	): -1 | 0 | 1 {
		if (a < b) {
			return -1;
		} else if (a > b) {
			return 1;
		} else {
			if (alt.length > 0) {
				if (alt[0][2] === 'asc') return default_sort(alt[0][0], alt[0][1], ...alt.slice(1));
				else if (alt[0][2] === 'des') return default_sort(alt[0][1], alt[0][0], ...alt.slice(1));
			}
			return 0;
		}
	}

	function handle_sort(scroll_y = 0) {
		sorted_rows = [...rows];
		if (current_sorts.length > 0 && current_sorts.some((colum) => colum.sort_dir !== undefined)) {
			const col_index = header.indexOf(current_sorts[0]);
			sorted_rows = [...rows].sort((a, b) => {
				let a_val;
				let b_val;
				if (typeof a.columns[col_index] !== 'object') {
					a_val = a.columns[col_index];
				} else {
					const col = a.columns[col_index] as RowObject;
					a_val = col.value ?? col.label;
				}

				if (typeof b.columns[col_index] !== 'object') {
					b_val = b.columns[col_index];
				} else {
					const col = b.columns[col_index] as RowObject;
					b_val = col.value ?? col.label;
				}

				const alt: [RowElement, RowElement, 'asc' | 'des'][] = [];
				for (let i = 1; i < current_sorts.length; i++) {
					const column = current_sorts[i];
					if (column.sort_dir === undefined) continue;
					const col_index = header.indexOf(column);
					alt.push([a.columns[col_index], b.columns[col_index], column.sort_dir]);
				}

				const sort = current_sorts[0].sort;

				if (current_sorts[0].sort_dir === 'asc') {
					return sort?.(a_val, b_val) ?? default_sort(a_val, b_val, ...alt);
				} else if (current_sorts[0].sort_dir === 'des') {
					return sort?.(b_val, a_val) ?? default_sort(b_val, a_val, ...alt);
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
		header = header;
		scroll_top(scroll_y);
	}

	function scroll_top(y: number) {
		if (v_list) setTimeout(() => v_list.scrollTo({ top: y, behavior: 'auto' }), 20);
	}

	function fitTable() {
		if (!instance) return;
		const width = (instance.clientWidth - (scrollbar_width ?? 4)) / header.length;
		header.forEach((col, index) => (col.width = width));
		header = header;
	}

	$: remaining_width = instance
		? instance?.clientWidth -
		  header.reduce((acc, col) => acc + (col.width ?? col.min_width ?? 50), 0) -
		  (scrollbar_width ?? 4)
		: 0;

	function fitColumn(selectedHeader: HeaderColumn) {
		selectedHeader.width =
			(selectedHeader.width ?? selectedHeader.min_width ?? 50) + remaining_width;
		header = header;
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
		class="items-start flex min-w-0 w-fit"
		style={`padding-right:${scrollbar_width}px`}
		bind:this={header_element}
	>
		{#each header as head, index}
			<div
				class="flex items-center group"
				style={`width: ${Math.max(head.width ?? 50, head.min_width ?? 50)}px;`}
			>
				<button
					class="min-w-0 flex items-center font-bold text-foreground
				{index > 0 ? 'justify-self-center' : ''}
				{head.sortable ? 'cursor-pointer' : 'cursor-default'}
				"
					on:click={(e) => handle_sort_change(head, e.shiftKey)}
				>
					<span class="truncate" title={head.title ?? head.label}>{head.label}</span>
					{#if head.sortable && head.width}
						{#if head.sort_dir === 'asc'}
							<Icon class="hidden sm:block" icon={FaSortUp} />
						{:else if head.sort_dir === 'des'}
							<Icon class="hidden sm:block" icon={FaSortDown} />
						{:else}
							<!-- <Icon class="hidden sm:block" icon={FaSort} /> -->
						{/if}
					{/if}
				</button>
				<div class="ml-auto flex items-center">
					<button
						on:click={() => fitColumn(head)}
						class="hidden {remaining_width > 5 ? 'group-hover:block' : ''}"
					>
						<Icon icon={IoMdCode} />
					</button>
					<div
						use:draggable={{
							onDrag(data) {
								head.width = Math.max(data.offsetX, head.min_width ?? 50);
							},
							axis: 'x',
							position: { x: Math.max(head.width ?? 50, head.min_width ?? 50), y: 0 },
							transform({ offsetX, offsetY, rootNode }) {}
						}}
						class="w-[15px] h-full flex items-center justify-center cursor-col-resize shrink-0"
					>
						<div class="h-2 w-0.5 my-auto bg-foreground-secondary cursor-col-resize" />
					</div>
				</div>
			</div>
		{/each}
	</div>
	{#key height}
		<VirtualList items={sorted_rows} let:item={row} bind:this={v_list_container}>
			<button
				on:click={row.onclick}
				class="flex w-full text-foreground-secondary hover:text-foreground"
			>
				{#each row.columns as column, index}
					<div
						class="flex items-center"
						style="color: {column.color}; width: {Math.max(
							header[index].width ?? 50,
							header[index].min_width ?? 50
						)}px;"
					>
						{#if typeof column === 'string' || typeof column === 'number'}
							<span class="truncate" title={column.toString()}>{column}</span>
						{:else if typeof column === 'object' && (typeof column.data === 'string' || typeof column.data === 'number')}
							<span class="truncate" title={column.label.toString()}>{column.label}</span>
						{:else}
							<Icon icon={column.label} />
						{/if}
					</div>
				{/each}
			</button>
		</VirtualList>
	{/key}
	<div>
		<button on:click={fitTable} class="flex gap-1"><Icon icon={MdZoomOutMap} /> Fit width</button>
	</div>
</div>
