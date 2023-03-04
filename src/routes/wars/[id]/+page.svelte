<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '../../../components/elements/icon.svelte';
	import { ModalManager } from '../../../components/modal/modal-store';
	import WarForm from '../../../components/modal/modals/war-form.svelte';
	import type { HeaderColumn, Row } from '../../../components/table/table';
	import Table from '../../../components/table/table.svelte';
	import type { Local_Guild, War } from '../../../logic/data';
	import { Manager } from '../../../logic/stores';
	import { format } from '../../../logic/util';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
	import GiSkullCrack from 'svelte-icons/gi/GiSkullCrack.svelte';
	import GiCrownedSkull from 'svelte-icons/gi/GiCrownedSkull.svelte';

	let selected_guild: Local_Guild | undefined;

	const header: HeaderColumn<string>[] = [
		{ label: 'Name', width: 3, sortable: true },
		{ label: 'Kills', width: 1, sortable: true },
		{ label: 'Deaths', width: 1, sortable: true },
		{ label: 'Performance', width: 1, sortable: true },
		{ label: 'Joined', width: 1, sortable: true }
	];
	let rows: Row[] = [];

	let war: War | undefined;
	$: {
		const id = $page.params.id;
		if (id) {
			war = $Manager.get_war(id);
			update_rows();
		}
	}

	$: {
		selected_guild;
		update_rows();
	}

	function update_rows() {
		if (war) {
			rows.splice(0, rows.length);
			for (const local_player of selected_guild?.local_players ?? war.local_players) {
				rows.push({
					columns: [
						local_player.player.name,
						local_player.kills,
						local_player.deaths,
						format(local_player.performance),
						format(local_player.duration_percentage * 100)
					]
				});
			}
			rows = rows;
		}
	}

	$: chart_data = war?.local_guilds.map((local_guild) => local_guild.local_players.length) ?? [];
	$: chart_labels = war?.local_guilds.map((local_guild) => local_guild.guild.name) ?? [];
</script>

{#if war}
	<div class="flex justify-between items-start mb-4">
		<Icon
			size="lg"
			icon={war.won ? GiCrownedSkull : GiSkullCrack}
			class="{war.won ? 'text-submarine-500' : 'text-red-500'} mr-2 self-center"
		/>
		<div class="flex flex-col gap-1">
			<div class="text-xl font-medium">{war.name}</div>
			<div class="text-base text-gold-muted">{war.date}</div>
		</div>
		<button on:click={() => ModalManager.open(WarForm, { war: war })} class="ml-auto"
			><Icon icon={MdSettings} class="self-center " /></button
		>
	</div>
	<div class="mb-4 divide-x-2 space-x-2 flex divide-gold-muted">
		<div>{war.local_guilds.length} Guilds</div>
		<div class="pl-2">{war.local_players.length} Players</div>
		<div class="pl-2">{war.duration} minutes</div>
	</div>
	<div class="flex gap-4 sm:flex-row flex-col sm:h-[30rem] ">
		<div class="flex sm:flex-col gap-2 w-fit mx-auto sm:mx-0 shrink-0 overflow-y-auto pr-2 flex-wrap sm:flex-nowrap">
			{#each war.local_guilds as local_guild}
				<button
					class="flex flex-col p-2 border border-gold rounded-lg min-w-0 h-fit"
					on:click={() =>
						(selected_guild = selected_guild === local_guild ? undefined : local_guild)}
				>
					<div class="flex flex-col">
						<!-- <img src={local_guild.guild.icon} class="w-[5rem] h-[5rem]" /> -->
						<div class="text-lg truncate font-bold">{local_guild.guild.name}</div>
					</div>
					<div class="flex gap-1 text-sm font-light">
						<div class="">{local_guild.local_players.length}</div>
						<div class="">Members</div>
					</div>
					<div class="flex gap-1 text-sm font-light">
						<div class="">{local_guild.kills}</div>
						<div class="">Kills</div>
					</div>
					<div class="flex gap-1 text-sm font-light">
						<div class="">{local_guild.deaths}</div>
						<div class="">Deaths</div>
					</div>
					<div class="flex gap-1 text-sm font-light">
						<div class="">{format(local_guild.duration)}</div>
						<div class="">min</div>
					</div>
				</button>
			{/each}
		</div>
		<div class="w-full">
			<Table
				height={480}
				{header}
				{rows}
				searchable
				title={(selected_guild?.guild.name ?? 'All') + ' Players'}
			/>
		</div>
	</div>
	<!-- <div class="w-[450px] mt-4">
		<Chart data={chart_data} labels={chart_labels} type="donut" />
	</div> -->
{/if}
