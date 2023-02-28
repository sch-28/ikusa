<script lang="ts">
	import type { HeaderColumn, Row } from '../../../components/table/table';
	import Table from '../../../components/table/table.svelte';

	const header: HeaderColumn[] = [
		{ label: 'Column 1', width: 3 },
		{ label: 'Column 2', width: 1 },
		{ label: 'Column 3', width: 1 },
		{ label: 'Column 4', width: 1 }
	];
	const rows: Row[] = [
		{
			columns: ['row1col1', 'row1col2', 'row1col3', 'row1col4'],
			onclick: () => console.log('row1 clicked')
		},
		{
			columns: ['row2col1', 'row2col2', 'row2col3', 'row2col4'],
			onclick: () => console.log('row2 clicked')
		},
		{
			columns: ['row3col1', 'row3col2', 'row3col3', 'row3col4'],
			onclick: () => console.log('row3 clicked')
		},
		{
			columns: ['row4col1', 'row4col2', 'row4col3', 'row4col4'],
			onclick: () => console.log('row4 clicked')
		},
		{
			columns: ['row5col1', 'row5col2', 'row5col3', 'row5col4'],
			onclick: () => console.log('row5 clicked')
		},
		{
			columns: ['row6col1', 'row6col2', 'row6col3', 'row6col4'],
			onclick: () => console.log('row6 clicked')
		},
		{
			columns: ['row7col1', 'row7col2', 'row7col3', 'row7col4'],
			onclick: () => console.log('row7 clicked')
		},
		{
			columns: ['row8col1', 'row8col2', 'row8col3', 'row8col4'],
			onclick: () => console.log('row8 clicked')
		},
		{
			columns: ['row9col1', 'row9col2', 'row9col3', 'row9col4'],
			onclick: () => console.log('row9 clicked')
		},
		{
			columns: ['row10col1', 'row10col2', 'row10col3', 'row10col4'],
			onclick: () => console.log('row10 clicked')
		},
		{
			columns: ['row11col1', 'row11col2', 'row11col3', 'row11col4'],
			onclick: () => console.log('row11 clicked')
		},
		{
			columns: ['row12col1', 'row12col2', 'row12col3', 'row12col4'],
			onclick: () => console.log('row12 clicked')
		},
		{
			columns: ['row13col1', 'row13col2', 'row13col3', 'row13col4'],
			onclick: () => console.log('row13 clicked')
		},
		{
			columns: ['row14col1', 'row14col2', 'row14col3', 'row14col4'],
			onclick: () => console.log('row14 clicked')
		},
		{
			columns: ['row15col1', 'row15col2', 'row15col3', 'row15col4'],
			onclick: () => console.log('row15 clicked')
		},
		{
			columns: ['row16col1', 'row16col2', 'row16col3', 'row16col4'],
			onclick: () => console.log('row16 clicked')
		},
		{
			columns: ['row17col1', 'row17col2', 'row17col3', 'row17col4'],
			onclick: () => console.log('row17 clicked')
		},
		{
			columns: ['row18col1', 'row18col2', 'row18col3', 'row18col4'],
			onclick: () => console.log('row18 clicked')
		},
		{
			columns: ['row19col1', 'row19col2', 'row19col3', 'row19col4'],
			onclick: () => console.log('row19 clicked')
		},
		{
			columns: ['row20col1', 'row20col2', 'row20col3', 'row20col4'],
			onclick: () => console.log('row20 clicked')
		},
		{
			columns: ['row21col1', 'row21col2', 'row21col3', 'row21col4'],
			onclick: () => console.log('row21 clicked')
		},
		{
			columns: ['row22col1', 'row22col2', 'row22col3', 'row22col4'],
			onclick: () => console.log('row22 clicked')
		},
		{
			columns: ['row23col1', 'row23col2', 'row23col3', 'row23col4'],
			onclick: () => console.log('row23 clicked')
		},
		{
			columns: ['row24col1', 'row24col2', 'row24col3', 'row24col4'],
			onclick: () => console.log('row24 clicked')
		},
		{
			columns: ['row25col1', 'row25col2', 'row25col3', 'row25col4'],
			onclick: () => console.log('row25 clicked')
		},
		{
			columns: ['row26col1', 'row26col2', 'row26col3', 'row26col4'],
			onclick: () => console.log('row26 clicked')
		},
		{
			columns: ['row27col1', 'row27col2', 'row27col3', 'row27col4'],
			onclick: () => console.log('row27 clicked')
		},
		{
			columns: ['row28col1', 'row28col2', 'row28col3', 'row28col4'],
			onclick: () => console.log('row28 clicked')
		},
		{
			columns: ['row29col1', 'row29col2', 'row29col3', 'row29col4'],
			onclick: () => console.log('row29 clicked')
		},
		{
			columns: ['row30col1', 'row30col2', 'row30col3', 'row30col4'],
			onclick: () => console.log('row30 clicked')
		},
		{
			columns: ['row31col1', 'row31col2', 'row31col3', 'row31col4'],
			onclick: () => console.log('row31 clicked')
		},
		{
			columns: ['row32col1', 'row32col2', 'row32col3', 'row32col4'],
			onclick: () => console.log('row32 clicked')
		},
		{
			columns: ['row33col1', 'row33col2', 'row33col3', 'row33col4'],
			onclick: () => console.log('row33 clicked')
		},
		{
			columns: ['row34col1', 'row34col2', 'row34col3', 'row34col4'],
			onclick: () => console.log('row34 clicked')
		},
		{
			columns: ['row35col1', 'row35col2', 'row35col3', 'row35col4'],
			onclick: () => console.log('row35 clicked')
		},
		{
			columns: ['row36col1', 'row36col2', 'row36col3', 'row36col4'],
			onclick: () => console.log('row36 clicked')
		},
		{
			columns: ['row37col1', 'row37col2', 'row37col3', 'row37col4'],
			onclick: () => console.log('row37 clicked')
		},
		{
			columns: ['row38col1', 'row38col2', 'row38col3', 'row38col4'],
			onclick: () => console.log('row38 clicked')
		}
	];
</script>

<div class="h-80">
	<Table {header} {rows} />
</div>
