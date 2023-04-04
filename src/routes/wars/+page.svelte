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
	import { get_remaining_height } from '../../logic/util';

	const header: HeaderColumn<any>[] = [
		{
			label: 'Name',
			sortable: true
		},
		{
			label: 'Date',
			sortable: true
		},
		{
			label: 'Duration',
			sortable: true
		},
		{
			label: 'Players',
			sortable: true
		},
		{
			label: 'Guilds',
			sortable: true
		},
		{
			label: 'Won',
			sortable: true
		},
		{
			label: 'Guild',
			sortable: true
		}
	];

	$: rows = $Manager.wars.map((war) => {
		return {
			columns: [
				war.name,
				war.date,
				war.duration,
				war.local_players.length,
				war.local_guilds.length,
				war.won
					? { label: GiCrownedSkull, color: '#1c9177', value: true }
					: { label: GiSkullCrack, color: '#f05252', value: false },
				war.guild_name

				/* {
					icon: MdSettings,
					color: 'blue',
					onclick() {
						ModalManager.open(WarForm, { war });
					}
				} */
			],
			onclick() {
				goto(`/wars/${war.id}`);
			}
		} as Row;
	});

	let table: HTMLDivElement;
	$: table_height = get_remaining_height(table, 16);
</script>

<div class="flex justify-between mb-4">
	<p>All Wars</p>
	<p>{$Manager.wars.length} Wars</p>
	<Button
		class="absolute left-1/2 -translate-x-1/2"
		on:click={() => ModalManager.open(WarForm, { war: undefined })}
	>
		<Icon icon={MdAdd} />
		Add War
	</Button>
</div>

<!-- <div class="flex flex-col">
	<WarList editable wars={$Manager.wars} on_click={(war) => goto(`wars/${war.id}`)} />
</div> -->
<Table id="wars" {header} {rows} searchable height={table_height} bind:instance={table} />
