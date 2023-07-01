<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '../../../components/elements/icon.svelte';
	import { Manager } from '../../../logic/stores';
	import MdPerson from 'svelte-icons/md/MdPerson.svelte';
	import Table from '../../../components/table/table.svelte';
	import type { HeaderColumn, Row } from '../../../components/table/table';
	import { format, redirect_and_toast, table_format } from '../../../logic/util';
	import { goto } from '$app/navigation';
	import Chart from '../../../components/chart/chart.svelte';
	import type { Guild } from '../../../logic/data';
	import { onMount } from 'svelte';
	import Field from '../../../components/dashboard/dashboard-field.svelte';
	import DashboardLayout, {
		type Option
	} from '../../../components/dashboard/dashboard-layout.svelte';

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
					table_format(local.performance),
					local.duration,
					local.local_guild.guild.name
				],
				onclick() {
					goto(`/wars/${local.local_guild.war.id}`);
				}
			} as Row;
		}) ?? [];

	$: options = player?.guilds.map((g) => ({
		title: g.name,
		values: [
			`${get_locals_for_guild(g).reduce((sum, local) => local.kills + sum, 0)} Joined`,
			`${get_locals_for_guild(g).reduce((sum, local) => local.deaths + sum, 0)} Deaths`,
			`${format(
				get_locals_for_guild(g).reduce((sum, local) => local.performance + sum, 0) /
					get_locals_for_guild(g).length
			)} Performance`,
			`${format(
				get_locals_for_guild(g).reduce((sum, local) => local.duration + sum, 0) /
					get_locals_for_guild(g).length
			)} Duration`
		]
	})) as Option[];

	let selected_option: Option | undefined = undefined;

	$: selected_guild = selected_option
		? player?.guilds.find((g) => g.name === selected_option?.title)
		: undefined;
</script>

<DashboardLayout
	loading={!player}
	bind:selected={selected_option}
	{options}
	stats={[
		`${format(player?.average_kills ?? 0)} avg kills`,
		`${format(player?.average_deaths ?? 0)} avg deaths`,
		`${format(player?.average_performance ?? 0)} avg performance`,
		`${format((player?.average_duration_percentage ?? 0) * 100, 0)} % avg join duration`,
		`${format((player?.participation_percentage ?? 0) * 100, 0)} % avg attendance`,
		`${player?.locals.length ?? 0} joined wars`
	]}
>
	<div slot="title" class="flex">
		<Icon size="lg" icon={MdPerson} class="mr-2 self-center" />
		<div class="flex flex-col gap-1">
			<div class="text-xl font-medium text-foreground">{player?.name}</div>
			<div class="text-base text-gold-muted">
				{player?.guilds[player.guilds.length - 1].name}
			</div>
		</div>
	</div>

	<svelte:fragment slot="actions"><!-- fetch class --></svelte:fragment>
	<svelte:fragment slot="content">
		<Table
			id="player-table-{player?.name}"
			{header}
			{rows}
			searchable
			title={(selected_guild?.name ?? 'All') + ' Stats'}
			height={420}
		/>
	</svelte:fragment>

	<svelte:fragment slot="fields">
		<Field title="Performance overview">
			<Chart
				type="area"
				title="Performance"
				data={chart_data}
				labels={chart_labels}
				annotations={chart_annotation}
				dates
				max={Math.max(3, (player?.average_performance ?? 2) + 1)}
			/>
		</Field>
	</svelte:fragment>
</DashboardLayout>
