<script lang="ts">
	import { page } from '$app/stores';
	import type { HeaderColumn, Row } from '../../../components/table/table';
	import Table from '../../../components/table/table.svelte';
	import { Manager } from '../../../logic/stores';
	import { format, redirect_and_toast } from '../../../logic/util';
	import { goto } from '$app/navigation';
	import DashboardLayout from '../../../components/dashboard/dashboard-layout.svelte';
	import { classes } from '../../../logic/bdo-api/classes';
	import Class from '../class.svelte';

	let selected_class: string | undefined;
	$: {
		const name = $page.params.name;
		if (!name || !classes.includes(name)) {
			redirect_and_toast('/classes', 'Class not found');
		} else {
			selected_class = name;
			calculate_local_players();
		}
	}

	let rows: Row[] = [];

	type ClassData = {
		name: string;
		performance: number;
		locals: number;
		kills: number;
		deaths: number;
	};

	let class_data = {} as Record<string, ClassData>;

	$: {
		$Manager;
		update_class_data();
	}

	function reset_class_data() {
		class_data = classes.reduce((acc, cur) => {
			acc[cur] = {
				name: cur,
				performance: 0,
				locals: 0,
				kills: 0,
				deaths: 0
			} as ClassData;
			return acc;
		}, {} as Record<string, ClassData>);
	}

	function update_class_data() {
		reset_class_data();
		$Manager.players.forEach((player) => {
			player.locals.forEach((local) => {
				if (local.character_class && local.character_class === selected_class) {
					class_data[local.character_class].locals++;
					class_data[local.character_class].kills += local.kills;
					class_data[local.character_class].deaths += local.deaths;
					class_data[local.character_class].performance += local.performance;
				}
			});

			Object;
		});
		Object.values(class_data).forEach((class_data) => {
			class_data.performance /= class_data.locals;
			class_data.kills /= class_data.locals;
			class_data.deaths /= class_data.locals;
		});
	}

	function calculate_local_players() {
		if (!selected_class) return;

		const player_locals = $Manager.players.filter((player) =>
			player.locals.some(
				(local) => local.character_class && local.character_class === selected_class
			)
		);

		const player_data_sum = player_locals.map((player) =>
			player.locals
				.filter((local) => local.character_class && local.character_class === selected_class)
				.reduce(
					(acc, local) => {
						if (local.character_class === selected_class) {
							acc.kills += local.kills;
							acc.deaths += local.deaths;
							acc.performance += local.performance;
							acc.players++;
						}
						return acc;
					},
					{ kills: 0, deaths: 0, performance: 0, players: 0 }
				)
		);

		const player_data = player_data_sum.map((data, i) => {
			return {
				name: player_locals[i].name,
				average_kills: data.kills / data.players,
				average_deaths: data.deaths / data.players,
				average_performance: data.performance / data.players,
				locals: data.players,
				guild: player_locals[i].guilds[player_locals[i].guilds.length - 1].name
			};
		});

		rows = player_data.map((player) => {
			return {
				columns: [
					player.name,
					format(player.average_kills),
					format(player.average_deaths),
					format(player.average_performance),
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
</script>

<DashboardLayout
	loading={!selected_class}
	stats={[
		`${format(class_data[selected_class ?? ''].kills)} Avg. Kills`,
		`${format(class_data[selected_class ?? ''].deaths)} Avg. Deaths`,
		`${format(class_data[selected_class ?? ''].performance)} Avg. Performance`
	]}
>
	<div slot="title" class="flex">
		<Class bdo_class={selected_class} show_text={false} size={'large'} />
		<div class="flex flex-col gap-1">
			<div class="text-xl font-medium text-foreground">{selected_class}</div>
			<div class="text-base text-gold-muted whitespace-nowrap">
				{rows.length} Players
			</div>
		</div>
	</div>

	<svelte:fragment slot="content">
		<Table height={420} id="class-{selected_class}" {header} {rows} searchable />
	</svelte:fragment>

	<svelte:fragment slot="fields" />
</DashboardLayout>
