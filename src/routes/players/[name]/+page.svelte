<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '../../../components/elements/icon.svelte';
	import { Manager } from '../../../logic/stores';
	import MdPerson from 'svelte-icons/md/MdPerson.svelte';
	import Table from '../../../components/table/table.svelte';
	import type { HeaderColumn, Row, RowElement } from '../../../components/table/table';
	import { format, redirect_and_toast, show_toast, table_format } from '../../../logic/util';
	import { goto } from '$app/navigation';
	import Chart from '../../../components/chart/chart.svelte';
	import type { Guild, Local_Guild_Player } from '../../../logic/data';
	import { onMount } from 'svelte';
	import Field from '../../../components/dashboard/dashboard-field.svelte';
	import DashboardLayout, {
		type Option
	} from '../../../components/dashboard/dashboard-layout.svelte';
	import { PUBLIC_IKUSA_API } from '$env/static/public';
	import type { PlayerCharacters } from '@prisma/client';
	import { User } from '../../../logic/user';
	import Class from '../../classes/class.svelte';
	import { bind } from 'svelte-simple-modal';

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

	$: {
		if (player) {
			sync_player();
		}
	}

	let loading = true;
	let player_data:
		| {
				characters: PlayerCharacters[];
				family_name: string;
				guild: string;
				region: string;
		  }
		| undefined = undefined;

	async function sync_player() {
		if (!player || !$User.bdo_sync) {
			loading = false;
			return;
		}

		loading = true;
		const result = await fetch(
			`${PUBLIC_IKUSA_API}/api/player?name=${player.name}&region=${'EU'}`,
			{
				method: 'GET'
			}
		).catch(() => {
			show_toast('Something went wrong, please try again later', 'error');
			loading = false;
		});
		loading = false;

		if (!result || result.status !== 200) return;

		player_data = await result.json();
		loading = false;
	}

	function get_locals_for_guild(guild: Guild) {
		return player?.locals.filter((local) => local.local_guild.guild === guild) ?? [];
	}

	let selected_guild = player?.guilds[player.guilds.length - 1];

	const header: HeaderColumn[] = [
		{ label: 'Class', title: 'Class', min_width: 25, width: 25, sortable: true },
		{ label: 'Character', sortable: true },
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
		},
		{
			label: 'Date',
			sortable: true
		}
	];

	$: rows =
		player_locals.map((local) => {
			return {
				columns: [
					...(local.character_class
						? [
								{
									label: bind(Class, { bdo_class: local.character_class }),
									value: local.character_class,
									type: 'component'
								} as RowElement
						  ]
						: ['-']),
					local.character_name ?? '-',
					local.kills,
					local.deaths,
					table_format(local.performance),
					local.duration,
					local.local_guild.guild.name,
					local.local_guild.war.date
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

	$: characters =
		player_data?.characters.map((c) => c.name) ??
		player?.locals.filter((l) => l.character_name).map((l) => l.character_name) ??
		[];

	$: character_table_header = [
		{ label: 'Class', sortable: true },
		{ label: 'Name', sortable: true },
		{ label: 'Level', sortable: true },
		{ label: 'Performance', sortable: true },
		{ label: 'War Count', sortable: true }
	] as HeaderColumn[];

	$: character_table_rows = characters.map((character) => {
		const player_data_character = player_data?.characters.find((c) => c.name === character);
		const locals = player?.locals.filter((l) => l.character_name === character) ?? [];

		const class_name = locals[0]?.character_class ?? player_data_character?.class ?? '-';
		const performance =
			locals.length > 0
				? table_format(locals.reduce((sum, local) => local.performance + sum, 0) / locals.length)
				: 0;

		return {
			columns: [
				{
					label: bind(Class, { bdo_class: class_name }),
					value: class_name,
					type: 'component'
				} as RowElement,
				character,
				player_data?.characters.find((c) => c.name === character)?.level ?? '-',
				performance,
				locals.length
			]
		} as Row;
	});
</script>

<DashboardLayout
	loading={!player || loading}
	loading_text="Syncing Player Data..."
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
				{player_data && player_data.guild
					? player_data.guild
					: player?.guilds[player.guilds.length - 1].name}
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
		<Field title="Performance overview" class="col-span-1">
			<Chart
				type="area"
				title="Performance"
				data={chart_data}
				labels={chart_labels}
				annotations={chart_annotation}
				dates
				date_switch
				height="100%"
				max={Math.max(3, (player?.average_performance ?? 2) + 1)}
			/>
		</Field>
		<Field title="Characters">
			<Table
				id="player-characters"
				height={275}
				header={character_table_header}
				rows={character_table_rows}
				searchable
				title={'Characters'}
			/>
		</Field>
	</svelte:fragment>

	<svelte:fragment slot="loading" />
</DashboardLayout>
