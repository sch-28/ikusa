<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '../../../components/elements/icon.svelte';
	import type { HeaderColumn, Row } from '../../../components/table/table';
	import Table from '../../../components/table/table.svelte';
	import type { War } from '../../../logic/data';
	import { Manager } from '../../../logic/stores';
	import { format, redirect_and_toast } from '../../../logic/util';
	import GiSwordsEmblem from 'svelte-icons/gi/GiSwordsEmblem.svelte';
	import { Toggle } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Option } from '../../../components/dashboard/dashboard-layout.svelte';
	import DashboardLayout from '../../../components/dashboard/dashboard-layout.svelte';

	$: guild = $Manager.get_guild($page.params.name);

	$: guild &&
		(show_all || !show_all) &&
		(selected_war || !selected_war) &&
		calculate_local_players();

	onMount(() => {
		if (!guild) {
			redirect_and_toast('/guilds', 'Guild not found');
		}
	});

	let rows: Row[] = [];
	let show_all = false;
	let selected_war: War | undefined;

	function calculate_local_players() {
		if (!guild) return;

		const player_locals = guild?.players
			.filter(
				(player) =>
					(player.guilds[player.guilds.length - 1].name === guild?.name || show_all) &&
					(!selected_war ||
						player.locals.some(
							(local) =>
								local.local_guild.war.id === selected_war?.id &&
								local.local_guild.guild.name === guild?.name
						))
			)
			.map((player) =>
				player.locals.filter((local) => {
					return (
						local.local_guild.guild.name === guild?.name &&
						(local.local_guild.war.id === selected_war?.id || !selected_war)
					);
				})
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

	$: options = guild?.locals.map((l) => ({
		title: l.war.date,
		values: [
			`${l.local_players.length} Members`,
			`${format(l.kill_difference)} Kill Diff.`,
			`${format(l.duration)} min`
		]
	})) as Option[];

	let selected_option: Option | undefined = undefined;

	$: selected_war = selected_option
		? guild?.locals.find((l) => l.war.date === selected_option?.title)?.war
		: undefined;
</script>

<DashboardLayout
	loading={!guild}
	bind:selected={selected_option}
	{options}
	stats={[
		`${format(guild?.average_members ?? 0)} Wars`,
		`${format(guild?.average_kill_difference ?? 0)} Avg. Kill Difference`,
		`${format(guild?.average_kills ?? 0)} Avg. Kills`,
		`${format(guild?.average_deaths ?? 0)} Avg. Deaths`
	]}
>
	<div slot="title" class="flex">
		<Icon size="lg" icon={GiSwordsEmblem} class="mr-2 self-center" />
		<div class="flex flex-col gap-1">
			<div class="text-xl font-medium text-foreground">{guild?.name}</div>
			<div class="text-base text-gold-muted">
				{show_all ? guild?.players.length : guild?.current_players.length} Members
			</div>
		</div>
	</div>

	<svelte:fragment slot="actions"><Toggle bind:checked={show_all} /> Show all</svelte:fragment>
	<svelte:fragment slot="content">
		<Table
			height={420}
			id="guild-{guild?.name}"
			{header}
			{rows}
			searchable
			title={(selected_war?.date ?? 'All') + ' Members'}
		/>
	</svelte:fragment>

	<svelte:fragment slot="fields" />
</DashboardLayout>
