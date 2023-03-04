<script lang="ts">
	import Icon from '../../components/elements/icon.svelte';
	import { ModalManager } from '../../components/modal/modal-store';
	import WarForm from '../../components/modal/modals/war-form.svelte';
	import { Manager } from '../../logic/stores';
	import WarList from '../../components/war-list.svelte';
	import { goto } from '$app/navigation';
	import Button from '../../components/elements/button.svelte';
	import MdAdd from 'svelte-icons/md/MdAdd.svelte';
	import Table from '../../components/table/table.svelte';
	import type { HeaderColumn, Row } from '../../components/table/table';
	import { format, get_remaining_height } from '../../logic/util';

	$: rows = $Manager.players.map((player) => {
		return {
			columns: [
				player.name,
				format(player.average_kills),
				format(player.average_deaths),
				format(player.average_duration_percentage),
				player.locals.length,
				player.guilds[player.guilds.length - 1].name
			]
		} as Row;
	});

	const header: HeaderColumn<string>[] = [
		{
			label: 'Name',
			sortable: true
		},
		{
			label: 'Kills',
			sortable: true
		},
		{
			label: 'Deaths',
			sortable: true
		},
		{
			label: 'Duration',
			sortable: true
		},
		{
			label: 'Joined',
			sortable: true
		},
		{
			label: 'Guild',
			sortable: true
		}
	];

	let table: HTMLDivElement;
	$: table_height = get_remaining_height(table, 16);
</script>

<div class="flex justify-between mb-4">
	<p>All Players</p>
	<p>{$Manager.players.length} Players</p>
</div>

<Table {header} {rows} searchable height={table_height} bind:instance={table} />
