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
                format(player.average_performance),
				format(player.average_duration_percentage),
				player.locals.length,
				player.guilds[player.guilds.length - 1].name
			],
			onclick() {
				goto(`/players/${player.name}`);
			}
		} as Row;
	});

	const header: HeaderColumn[] = [
		{
			label: 'Name',
			sortable: true
		},
		{
			label: 'Kills',
			sortable: true,
			title: 'Average Kills'
		},
		{
			label: 'Deaths',
			sortable: true,
			title: 'Average Deaths'
		},
        {
            label: 'Performance',
            sortable: true,
			title: 'Average Performance (Kills Compared to Guild Average Kills)'
        },
		{
			label: 'Duration',
			sortable: true,
			title: 'Average Join Duration'
		},
		{
			label: 'Joined',
			sortable: true,
			title: 'Number of Joined Wars'
		},
		{
			label: 'Guild',
			sortable: true,
			title: 'Current Guild'
		}
	];

	let table: HTMLDivElement;
	$: table_height = get_remaining_height(table, 16);
</script>

<div class="flex justify-between mb-4">
	<p>All Players</p>
	<p>{$Manager.players.length} Players</p>
</div>

<Table id="players" {header} {rows} searchable height={table_height} bind:instance={table} />
