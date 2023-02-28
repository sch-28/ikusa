<script lang="ts">
	import type { HeaderColumn, Row } from '../../../components/table/table';
	import Table from '../../../components/table/table.svelte';

	const header: HeaderColumn<string>[] = [
		{ label: 'Column 1', width: 3, sortable: true },
		{ label: 'Column 2', width: 1, sortable: true },
		{ label: 'Column 3', width: 1 },
		{ label: 'Column 4', width: 1 }
	];
	const rows: Row[] = [
		{
			columns: ['row1col1', 1, 'row1col3', 'row1col4'],
			onclick: () => console.log('row1 clicked')
		},
		{
			columns: ['row2col1', 2, 'row2col3', 'row2col4'],
			onclick: () => console.log('row2 clicked')
		},
		{
			columns: ['row3col1', 3, 'row3col3', 'row3col4'],
			onclick: () => console.log('row3 clicked')
		},
		{
			columns: ['row4col1', 4, 'row4col3', 'row4col4'],
			onclick: () => console.log('row4 clicked')
		},
		{
			columns: ['row5col1', 5, 'row5col3', 'row5col4'],
			onclick: () => console.log('row5 clicked')
		},
		{
			columns: ['row6col1', 6, 'row6col3', 'row6col4'],
			onclick: () => console.log('row6 clicked')
		},
		{
			columns: ['row7col1', 7, 'row7col3', 'row7col4'],
			onclick: () => console.log('row7 clicked')
		},
		{
			columns: ['row8col1', 8, 'row8col3', 'row8col4'],
			onclick: () => console.log('row8 clicked')
		},
		{
			columns: ['row9col1', 9, 'row9col3', 'row9col4'],
			onclick: () => console.log('row9 clicked')
		},
		{
			columns: ['row10col1', 10, 'row10col3', 'row10col4'],
			onclick: () => console.log('row10 clicked')
		},
		{
			columns: ['row11col1', 11, 'row11col3', 'row11col4'],
			onclick: () => console.log('row11 clicked')
		},
		{
			columns: ['row12col1', 12, 'row12col3', 'row12col4'],
			onclick: () => console.log('row12 clicked')
		},
		{
			columns: ['row13col1', 13, 'row13col3', 'row13col4'],
			onclick: () => console.log('row13 clicked')
		},
		{
			columns: ['row14col1', 14, 'row14col3', 'row14col4'],
			onclick: () => console.log('row14 clicked')
		}
	];
</script>

<div class="h-80">
	<Table {header} {rows} searchable />
</div>
