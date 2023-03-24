<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '../../../components/elements/icon.svelte';
	import { ModalManager } from '../../../components/modal/modal-store';
	import WarForm from '../../../components/modal/modals/war-form.svelte';
	import type { HeaderColumn, Row } from '../../../components/table/table';
	import Table from '../../../components/table/table.svelte';
	import type { Guild, Local_Guild, War } from '../../../logic/data';
	import { Manager } from '../../../logic/stores';
	import { format, get_remaining_height } from '../../../logic/util';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
	import GiSkullCrack from 'svelte-icons/gi/GiSkullCrack.svelte';
	import GiCrownedSkull from 'svelte-icons/gi/GiCrownedSkull.svelte';
	import GiSwordsEmblem from 'svelte-icons/gi/GiSwordsEmblem.svelte';
	import Checkbox from '../../../components/elements/checkbox.svelte';
	import { Toggle } from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	$: guild = $Manager.get_guild($page.params.name);

	$: guild && (show_all || !show_all) && calculate_local_players();

	let rows:Row[] = [];
	let show_all = false;

	function calculate_local_players() {
		if (!guild) return;

		const player_locals = guild?.players.filter(player => player.guilds[player.guilds.length-1].name === guild?.name || show_all).map((player) =>
			player.locals.filter((local) => local.local_guild.guild.name === guild?.name )
		);

		const player_data_sum = player_locals.map((player_locals) =>
			player_locals.reduce(
				(acc, local) => {
					acc.kills += local.kills;
					acc.deaths += local.deaths;
					acc.duration += local.duration;
					return acc;
				},
				{ kills: 0, deaths: 0, duration: 0 }
			)
		);

		const player_data = player_data_sum?.map((data, i) => {
			return {
				name: player_locals[i][0].player.name,
				average_kills: data.kills / player_locals[i].length,
				average_deaths: data.deaths / player_locals[i].length,
				average_performance: data.kills / player_locals[i].length / (guild?.average_kills ?? 1),
				average_duration_percentage: player_locals[i].length / player_locals[i].length,
				locals: player_locals[i].length,
				guild: player_locals[i][0].player.guilds[player_locals[i][0].player.guilds.length - 1].name
			};
		});

		rows = player_data.map((player) => {
			return {
				columns: [
					player.name,
					format(player.average_kills),
					format(player.average_deaths),
					format(player.average_performance),
					format(player.average_duration_percentage),
					player.locals,
					player.guild
				],
				onclick() {
					goto(`/players/${player.name}`);
				}
			} as Row;
		});
	}

	const header: HeaderColumn<string>[] = [
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

{#if guild}
	<div class="flex justify-between items-start mb-4">
		<Icon size="lg" icon={GiSwordsEmblem} class="mr-2 self-center" />
		<div class="flex flex-col gap-1">
			<div class="text-xl font-medium">{guild.name}</div>
			<div class="text-base text-gold-muted">{show_all ? guild.players.length : guild.current_players.length} Members</div>
		</div>
		<div class="ml-auto my-auto flex gap-2">
			<Toggle bind:checked={show_all} /> Show all
		</div>
	</div>
	<div class="mb-4 divide-x-2 space-x-2 flex divide-gold-muted">
		<div>{guild.locals.length} Wars</div>
		<div class="pl-2">{format(guild.average_members)} Avg. Members</div>
		<div class="pl-2">{format(guild.average_kill_difference)} Avg. Kill Difference</div>
		<div class="pl-2">{format(guild.average_kills)} Avg. Kills</div>
		<div class="pl-2">{format(guild.average_deaths)} Avg. Deaths</div>
	</div>
	<div class="flex gap-4 sm:flex-row flex-col border border-gold border-dashed p-2 rounded-lg">
		<!-- <div
			class="flex sm:flex-col gap-2 w-fit mx-auto sm:mx-0 shrink-0 overflow-y-auto pr-2 flex-wrap sm:flex-nowrap sm:h-[30rem] justify-center sm:justify-start"
		>
			{#each guild.local_guilds as local_guild}
				<button
					class="flex flex-col p-2 border border-gold rounded-lg min-w-0 h-[126px] aspect-square"
					on:click={() =>
						(selected_guild = selected_guild === local_guild ? undefined : local_guild)}
				>
					<div class="text-lg truncate font-bold w-full text-left">{local_guild.guild.name}</div>
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
		</div> -->
		<div class="w-full">
			<Table
				height={table_height}
				bind:instance={table}
				id="guild"
				{header}
				{rows}
				searchable
				title={(guild.name ?? 'All') + ' Players'}
			/>
		</div>
	</div>
	<!-- <div class="w-[450px] mt-4">
		<Chart data={chart_data} labels={chart_labels} type="donut" />
	</div> -->
{/if}
