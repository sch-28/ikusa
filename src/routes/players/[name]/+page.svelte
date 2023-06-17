<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '../../../components/elements/icon.svelte';
	import { Manager } from '../../../logic/stores';
	import MdPerson from 'svelte-icons/md/MdPerson.svelte';
	import Table from '../../../components/table/table.svelte';
	import type { HeaderColumn, Row } from '../../../components/table/table';
	import { format, redirect_and_toast } from '../../../logic/util';
	import { goto } from '$app/navigation';
	import Chart from '../../../components/chart/chart.svelte';
	import type { Guild } from '../../../logic/data';
	import { onMount } from 'svelte';

	const chart_annotation = [{ height: 1, label: 'Average' }];

	$: player = $Manager.players.find((player) => player.name === $page.params.name);
	$: player_locals = selected_guild ? get_locals_for_guild(selected_guild) : player?.locals ?? [];
	$: chart_data = [
		{ data: player_locals.map((local) => format(local.performance)) ?? [], name: 'Performance' }
	];
	$: chart_labels = player?.locals.map((local) => local.local_guild.war.date) ?? [];

	onMount(() => {
		if (!player) {
			redirect_and_toast('/players', 'Player not found');
		}
	});

	function get_locals_for_guild(guild: Guild) {
		return player?.locals.filter((local) => local.local_guild.guild === guild) ?? [];
	}

	let selected_guild = player?.guilds[player.guilds.length - 1];

	const header: HeaderColumn[] = [
		{
			label: 'Date',
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
			label: 'Performance',
			title: 'Average Performance (Kills Compared to Guild Average Kills)',
			sortable: true
		},
		{
			label: 'Duration',
			title: 'Amount of minutes participated',
			sortable: true
		},
		{
			label: 'Guild',
			sortable: true
		}
	];

	$: rows =
		player_locals.map((local) => {
			return {
				columns: [
					local.local_guild.war.date,
					local.kills,
					local.deaths,
					format(local.performance),
					local.duration,
					local.local_guild.guild.name
				],
				onclick() {
					goto(`/wars/${local.local_guild.war.id}`);
				}
			} as Row;
		}) ?? [];
</script>

{#if player}
	<div class="lg:flex">
		<div class="w-full">
			<div class="flex items-start mb-4">
				<Icon size="lg" icon={MdPerson} class="mr-2 self-center" />
				<div class="flex flex-col gap-1">
					<div class="text-xl font-medium text-foreground">{player.name}</div>
					<div class="text-base text-gold-muted">
						{player.guilds[player.guilds.length - 1].name}
					</div>
				</div>
				<!-- <button on:click={() => ModalManager.open(WarForm, { war: war })} class="ml-auto"
			><Icon icon={MdSettings} class="self-center " /></button
		> -->
			</div>
			<div class="mb-4 divide-x-2 space-x-2 flex divide-foreground-secondary">
				<div>{format(player.average_kills)} avg kills</div>
				<div class="pl-2">{format(player.average_deaths)} avg deaths</div>
				<div class="pl-2">{format(player.average_performance)} avg performance</div>
				<div class="pl-2">
					{format(player.average_duration_percentage * 100, 0)} % avg join duration
				</div>
				<div class="pl-2">
					{format(player.participation_percentage * 100, 0)} % avg attendance
				</div>
				<div class="pl-2">{player.locals.length} joined wars</div>
			</div>
			<div
				class="flex gap-4 sm:flex-row flex-col border border-foreground border-dashed p-2 rounded-lg"
			>
				<div
					class="flex sm:flex-col gap-2 w-fit mx-auto sm:mx-0 shrink-0 overflow-y-auto pr-2 flex-wrap sm:flex-nowrap sm:h-[480px] justify-center sm:justify-start"
				>
					{#each player.guilds as guild}
						<button
							class="flex flex-col p-2 border border-foreground rounded-lg min-w-0 h-[146px] aspect-square {selected_guild ===
							guild
								? 'bg-foreground text-black'
								: ''}"
							on:click={() => (selected_guild = selected_guild === guild ? undefined : guild)}
						>
							<div class="text-lg truncate font-bold w-full text-left">{guild.name}</div>
							<div class="flex gap-1 text-sm font-light">
								<div class="">
									{get_locals_for_guild(guild).reduce((sum, local) => local.kills + sum, 0)}
								</div>
								<div class="">Kills</div>
							</div>
							<div class="flex gap-1 text-sm font-light">
								<div class="">
									{get_locals_for_guild(guild).reduce((sum, local) => local.deaths + sum, 0)}
								</div>
								<div class="">Deaths</div>
							</div>
							<div class="flex gap-1 text-sm font-light">
								<div class="">
									{format(
										get_locals_for_guild(guild).reduce((sum, local) => local.performance + sum, 0) /
											get_locals_for_guild(guild).length
									)}
								</div>
								<div class="">Performance</div>
							</div>
							<div class="flex gap-1 text-sm font-light">
								<div class="">
									{format(
										get_locals_for_guild(guild).reduce((sum, local) => local.duration + sum, 0) /
											get_locals_for_guild(guild).length
									)}
								</div>
								<div class="">Duration</div>
							</div>
							<div class="flex gap-1 text-sm font-light">
								<div class="">
									{get_locals_for_guild(guild).length}
								</div>
								<div class="">Joined</div>
							</div>

							<!-- <div class="flex gap-1 text-sm font-light">
						<div class="">{format(guild.duration * 100)}</div>
						<div class="">Joined</div>
					</div> -->
						</button>
					{/each}
				</div>
				<div class="w-full h-[30rem]">
					<Table
						id="player-table-{player.name}"
						{header}
						{rows}
						searchable
						title={(selected_guild?.name ?? 'All') + ' Stats'}
						height={480}
					/>
				</div>
			</div>
		</div>
		<div class="lg:w-1/3 w-full mx-auto p-2 shrink-0 lg:mt-14">
			<Chart
				type="area"
				title="Performance"
				data={chart_data}
				labels={chart_labels}
				annotations={chart_annotation}
				max={Math.max(3, (player?.average_performance ?? 2) + 1)}
			/>
		</div>
	</div>
{/if}
