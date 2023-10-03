<script lang="ts">
	import Icon from '../../components/elements/icon.svelte';
	import GiSkullCrack from 'svelte-icons/gi/GiSkullCrack.svelte';
	import GiCrownedSkull from 'svelte-icons/gi/GiCrownedSkull.svelte';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
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

	const header: HeaderColumn[] = [
		{
			label: 'Name',
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
			label: 'Avg. Kill Difference',
			sortable: true
		},
		{
			label: 'Avg. Members',
			sortable: true
		},
		{
			label: 'Members',
			sortable: true
		},
		{
			label: 'Wars',
			sortable: true
		}
	];

	$: rows = $Manager.guilds.map((guild) => {
		return {
			columns: [
				guild.name,
				format(guild.average_kills),
				format(guild.average_deaths),
				format(guild.average_kill_difference),
				format(guild.average_members),
				guild.players.length,
				guild.locals.length
			],
			onclick() {
				goto(`/guilds/${guild.name}`);
			}
		} as Row;
	});
	let table: HTMLDivElement;
	$: table_height = get_remaining_height(table, 16);
</script>

<div class="flex justify-between mb-4">
	<p>All Guilds</p>
	<p>{$Manager.guilds.length} Guilds</p>
</div>

<Table id="guilds" {header} {rows} searchable height={table_height} bind:instance={table} />
