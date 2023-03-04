<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '../../../components/elements/icon.svelte';
	import { Manager } from '../../../logic/stores';
	import MdPerson from 'svelte-icons/md/MdPerson.svelte';
	import Table from '../../../components/table/table.svelte';
	import type { HeaderColumn, Row } from '../../../components/table/table';
	import { format } from '../../../logic/util';
	import { goto } from '$app/navigation';

	$: player = $Manager.players.find((player) => player.name === $page.params.name);

	let selected_guild = player?.guilds[player.guilds.length - 1];

	const header: HeaderColumn<string>[] = [
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
			sortable: true
		},
		{
			label: 'Duration',
			sortable: true
		},
		{
			label: 'Guild',
			sortable: true
		}
	];

	$: rows =
		player?.locals
			.filter((local) => local.local_guild.guild.name === selected_guild?.name || !selected_guild)
			.map((local) => {
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
	<div class="flex items-start mb-4">
		<Icon size="lg" icon={MdPerson} class="mr-2 self-center" />
		<div class="flex flex-col gap-1">
			<div class="text-xl font-medium">{player.name}</div>
			<div class="text-base text-gold-muted">{player.guilds[player.guilds.length - 1].name}</div>
		</div>
		<!-- <button on:click={() => ModalManager.open(WarForm, { war: war })} class="ml-auto"
			><Icon icon={MdSettings} class="self-center " /></button
		> -->
	</div>
	<div class="mb-4 divide-x-2 space-x-2 flex divide-gold-muted">
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
	<div class="flex gap-4 sm:flex-row flex-col sm:h-[30rem] ">
		<div
			class="flex sm:flex-col gap-2 w-fit mx-auto sm:mx-0 shrink-0 overflow-y-auto pr-2"
		>
			{#each player.guilds as guild}
				<button
					class="flex flex-col p-2 border border-gold rounded-lg min-w-0 h-fit"
					on:click={() => (selected_guild = selected_guild === guild ? undefined : guild)}
				>
					<div class="flex flex-col">
						<!-- <img src={local_guild.icon} class="w-[5rem] h-[5rem]" /> -->
						<div class="text-lg truncate font-bold">{guild.name}</div>
					</div>
					<div class="flex gap-1 text-sm font-light">
						<div class="">{guild.players.length}</div>
						<div class="">Members</div>
					</div>
					<div class="flex gap-1 text-sm font-light">
						<div class="">{guild.kills}</div>
						<div class="">Kills</div>
					</div>
					<div class="flex gap-1 text-sm font-light">
						<div class="">{guild.deaths}</div>
						<div class="">Deaths</div>
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
				{header}
				{rows}
				searchable
				title={(selected_guild?.name ?? 'All') + ' Stats'}
				height={480}
			/>
		</div>
	</div>
{/if}
