<script lang="ts">
	import { Manager } from '../../logic/stores';
	import { goto } from '$app/navigation';
	import Table from '../../components/table/table.svelte';
	import { format, get_remaining_height, table_format } from '../../logic/util';
	import type { Row, HeaderColumn, RowElement } from '../../components/table/table';
	import { classes } from '../../logic/bdo-api/classes';
	import { bind } from 'svelte-simple-modal';
	import Class from './class.svelte';

	type ClassData = {
		name: string;
		performance: number;
		locals: number;
		kills: number;
		deaths: number;
	};

	let class_data = {} as Record<string, ClassData>;

	$: {
		$Manager;
		update_class_data();
	}

	function reset_class_data() {
		class_data = classes.reduce((acc, cur) => {
			acc[cur] = {
				name: cur,
				performance: 0,
				locals: 0,
				kills: 0,
				deaths: 0
			} as ClassData;
			return acc;
		}, {} as Record<string, ClassData>);
	}

	function update_class_data() {
		reset_class_data();
		$Manager.players.forEach((player) => {
			player.locals.forEach((local) => {
				if (local.character_class) {
					class_data[local.character_class].locals++;
					class_data[local.character_class].kills += local.kills;
					class_data[local.character_class].deaths += local.deaths;
					class_data[local.character_class].performance += local.performance;
				}
			});

			Object;
		});
		Object.values(class_data).forEach((class_data) => {
			class_data.performance /= class_data.locals;
			class_data.kills /= class_data.locals;
			class_data.deaths /= class_data.locals;
		});
	}

	$: rows = Object.values(class_data).map((class_data) => {
		return {
			columns: [
				{
					label: bind(Class, { bdo_class: class_data.name }),
					value: class_data.name,
					type: 'component'
				} as RowElement,
				table_format(class_data.kills),
				table_format(class_data.deaths),
				table_format(class_data.performance),
				table_format(class_data.locals)
			],
			onclick: () => {
				goto(`/classes/${class_data.name}`);
			}
		} as Row;
	});

	const header: HeaderColumn[] = [
		{
			label: 'Class',
			sortable: true
		},
		{
			label: 'Avg. Kills',
			sortable: true
		},
		{
			label: 'Avg. Deaths',
			sortable: true
		},
		{
			label: 'Avg. Performance',
			sortable: true
		},
		{
			label: 'Players',
			sortable: true
		}
	];

	let table: HTMLDivElement;
	$: table_height = get_remaining_height(table, 16);
</script>

<div class="flex justify-between mb-4">
	<p>All Classes</p>
	<p>{rows.length} Classes</p>
</div>

<Table id="classes" {header} {rows} searchable height={table_height} bind:instance={table} />
