<script lang="ts">
	//@ts-expect-error types
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import GiBroadsword from 'svelte-icons/gi/GiBroadsword.svelte';
	import { page } from '$app/stores';
	import Icon from '../../../components/elements/icon.svelte';
	import { ModalManager } from '../../../components/modal/modal-store';
	import WarForm from '../../../components/modal/modals/war-form.svelte';
	import type { HeaderColumn, Row, RowElement } from '../../../components/table/table';
	import Table from '../../../components/table/table.svelte';
	import { Manager } from '../../../logic/stores';
	import { format, redirect_and_toast, show_toast, table_format } from '../../../logic/util';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
	import MdClose from 'svelte-icons/md/MdClose.svelte';
	import GiSkullCrack from 'svelte-icons/gi/GiSkullCrack.svelte';
	import GiCrownedSkull from 'svelte-icons/gi/GiCrownedSkull.svelte';
	import Button from '../../../components/elements/button.svelte';
	import IoIosShareAlt from 'svelte-icons/io/IoIosShareAlt.svelte';
	import { User } from '../../../logic/user';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { Local_Guild_Player, Log, type Local_Guild, type War } from '../../../logic/data';
	import { parse } from 'flatted';
	import Share from '../../../components/modal/modals/share.svelte';
	import MdFileDownload from 'svelte-icons/md/MdFileDownload.svelte';
	import { saveAs } from 'file-saver';
	import { PUBLIC_IKUSA_API } from '$env/static/public';
	import Class from '../../classes/class.svelte';
	import { bind } from 'svelte-simple-modal';
	import { LoaderManager } from '../../../components/loader/loader-store';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import Chart from '../../../components/chart/chart.svelte';
	import Field from '../../../components/dashboard/dashboard-field.svelte';
	import { get_class_color } from '../../../logic/bdo-api/classes';
	import DashboardLayout, {
		type Option
	} from '../../../components/dashboard/dashboard-layout.svelte';
	import LZString from 'lz-string';
	import dayjs from 'dayjs';

	$: is_puppeteer = $page.url.searchParams.has('puppeteer');

	let selected_guild: Local_Guild | undefined;
	export let data: PageData;

	$: ({ war: war_raw, is_public, is_own, is_new_share } = data);
	let war: War | undefined;
	let has_characters = false;
	let has_classes = false;
	let loading = false;

	let header: HeaderColumn[] = [];
	let rows: Row[] = [];

	onMount(() => {
		if (war_raw) {
			if (!is_public) {
				war = $Manager.get_war(war_raw);
			} else {
				war = is_new_share
					? parse(war_raw)
					: parse(LZString.decompressFromEncodedURIComponent(war_raw));

				war?.local_guilds.forEach((local) =>
					local.local_events.forEach((e) => (e.time = dayjs(e.time)))
				);
			}
		}

		if (!war) {
			redirect_and_toast('/wars', 'War not found');
		} else {
			has_characters = war.logs.some(
				(l) => l.character_names && l.character_names.length > 0 && l.character_names[0]
			);
			has_classes = war.local_players.some((p) => p.character_class);
			header = [
				{ label: 'Name', sortable: true },
				{ label: 'Kills', sortable: true, sort_dir: 'des' },
				{ label: 'Deaths', sortable: true },
				{
					label: 'Performance',
					title: 'Average Performance (Kills Compared to Guild Average Kills)',
					sortable: true
				},
				{ label: 'Join Duration', title: 'Percentage of war joined', sortable: true }
			];

			if (has_classes) add_class_column();
			else update_rows();

			if (has_characters && !has_classes && $User.bdo_sync) sync_war();
		}
	});

	$: {
		selected_guild;
		update_rows();
	}

	function add_class_column() {
		header = [
			{ label: 'Class', title: 'Class', min_width: 25, width: 25, sortable: true },
			...header
		];
		update_rows();
	}
	let selected_player: Local_Guild_Player | undefined = undefined;
	$: selected_player_enemy_columns = Object.entries(
		selected_player?.local_events.reduce((acc, event) => {
			const enemy = event.player_two;
			if (!(enemy.name in acc)) {
				acc[enemy.name] = {
					kills: 0,
					deaths: 0,
					class: event.local_player_two?.character_class,
					guild: event.local_player_two.local_guild.guild.name
				};
			}

			if (event.kill) {
				acc[enemy.name].kills += 1;
			} else {
				acc[enemy.name].deaths += 1;
			}

			return acc;
		}, {} as Record<string, { kills: number; deaths: number; class?: string; guild: string }>) ?? {}
	).map(([name, value]) => {
		return {
			columns: [
				{
					label: value.class ? bind(Class, { bdo_class: value.class, show_text: false }) : '-',
					value: value.class,
					type: value.class ? 'component' : 'literal'
				},
				name,
				value.kills,
				value.deaths,
				value.guild
			]
		} as Row;
	});
	function update_rows() {
		if (war) {
			rows.splice(0, rows.length);
			for (const local_player of selected_guild?.local_players ?? war.local_players) {
				rows.push({
					onclick: () => {
						if (selected_player?.player.name === local_player.player.name) {
							selected_player = undefined;
						} else {
							selected_player = local_player;
						}
					},
					columns: [
						...(has_classes
							? local_player.character_class
								? [
										{
											label: bind(Class, { bdo_class: local_player.character_class }),
											value: local_player.character_class,
											type: 'component'
										} as RowElement
								  ]
								: ['-']
							: []),
						local_player.player.name,
						local_player.kills,
						local_player.deaths,
						table_format(local_player.performance),
						{
							value: local_player.duration_percentage * 100,
							label: format(local_player.duration_percentage * 100, 0) + '%'
						}
					]
				});
			}
			rows = rows;
			header = header;
		}
	}
	let kill_chart_labels: number[] = [];
	$: {
		kill_chart_labels = [];
		if (war && war.kill_events.length > 0) {
			const first_time = dayjs(war?.kill_events[0].time).valueOf();
			const last_time = dayjs(war?.kill_events[war.kill_events.length - 1].time).valueOf();
			for (let i = first_time; i < last_time; i += 60000) {
				kill_chart_labels.push(i);
			}
		}
	}
	$: kills_chart_data = kill_chart_labels.map((l) => {
		const events = (selected_guild?.kill_events ?? war?.kill_events ?? []).filter((k) => {
			return k.time.valueOf() >= l && k.time.valueOf() < l + 60000;
		});
		return events ? events.length : 0;
	});

	$: deaths_chart_data = kill_chart_labels.map((l) => {
		const events = (selected_guild?.death_events ?? war?.death_events ?? []).filter((k) => {
			return k.time.valueOf() >= l && k.time.valueOf() < l + 60000;
		});
		return events ? events.length : 0;
	});

	$: member_chart_data =
		war?.local_guilds.map((local_guild) => local_guild.local_players.length) ?? [];
	$: member_chart_labels = war?.local_guilds.map((local_guild) => local_guild.guild.name) ?? [];

	$: class_data = has_classes
		? (selected_guild?.local_players ?? war?.local_players ?? [])
				.filter((l) => l.character_class)
				.reduce((acc, curr) => {
					const index = acc.findIndex((a) => a.name === curr.character_class);
					if (index !== -1) {
						acc[index].data++;
					} else if (curr.character_class) {
						acc.push({ name: curr.character_class, data: 1 });
					}
					return acc;
				}, [] as { name: string; data: number }[])
		: [];

	$: class_chart_data = class_data?.map((c) => c.data) ?? [];
	$: class_chart_labels = class_data?.map((c) => c.name) ?? [];
	$: class_colors = class_data?.map((c) => get_class_color[c.name] ?? '#630101') ?? [];

	$: class_table_rows = (class_data?.map((c) => ({
		columns: [
			{
				label: bind(Class, { bdo_class: c.name }),
				value: c.name,
				type: 'component'
			},
			{
				label: `${c.data} (${(
					(c.data / (selected_guild?.local_players.length ?? war?.local_players.length ?? 0)) *
					100
				).toFixed(0)}%)`,
				value: c.data
			},
			table_format(
				(selected_guild?.local_players ?? war?.local_players ?? [])
					.filter((l) => l.character_class === c.name)
					.reduce((acc, curr) => acc + curr.performance, 0) / c.data
			)
		]
	})) ?? []) as Row[];

	$: class_table_header = [
		{ label: 'Class', sortable: true },
		{ label: 'Amount', sortable: true },
		{ label: 'Performance', sortable: true, sort_dir: 'des' }
	] as HeaderColumn[];

	async function add_war() {
		if (war) {
			$Manager.add_war({
				guild_name: war.guild_name,
				date: war.date,
				logs: Log.parse_logs(war.logs),
				name: war.name,
				unique_id: '',
				won: war.won
			});
			goto(`/wars/${encodeURIComponent(war.id)}`, { invalidateAll: true });
		}
	}

	function open_share() {
		if ($User.discord_data) {
			ModalManager.open(Share, { war: war });
		} else {
			show_toast('You need to login via discord to share a war', 'error');
		}
	}

	function download_logs() {
		const blob = new Blob([war?.logs.map((l) => l.message).join('\n') ?? ''], {
			type: 'text/plain;charset=utf-8'
		});
		saveAs(blob, `${war?.name}.log`);
	}

	async function sync_war() {
		if (war) {
			LoaderManager.set_status('Fetching characters', 0);
			const canceled = { current: false };
			LoaderManager.open(() => {
				canceled.current = true;
			});
			const all_characters = war.logs
				.filter(
					(l) =>
						l.character_names &&
						l.character_names.length == 2 &&
						l.character_names[0] &&
						l.character_names[1]
				)
				.map((l) => l.character_names)
				.flat();

			let character_names = [...new Set(all_characters)];
			const region = $User.region ?? 'EU';

			fetch(`${PUBLIC_IKUSA_API}/api/characters`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ names: character_names, region: region })
			})
				.then((res) => {
					if (res.status === 200) {
						return res.body?.getReader();
					} else {
						LoaderManager.close();
						show_toast('Could not fetch characters', 'error');
					}
				})

				.then(async (reader) => {
					if (canceled.current) return;

					const players: {
						char_name: string;
						name?: string;
						class?: string;
						progress: number;
						total: number;
					}[] = [];

					let remaining_string = '';

					await (async (reader) => {
						if (!reader) return;

						if (canceled.current) {
							reader.cancel();
							return;
						}

						let done, value;
						while (!done) {
							({ value, done } = await reader.read());
							if (done || canceled.current) {
								return true;
							}
							try {
								const full_string = remaining_string + new TextDecoder('utf-8').decode(value);
								const progress = full_string
									.split('{')
									.map((js) => '{' + js)
									.splice(1);

								const last_entry = progress[progress.length - 1];
								if (last_entry.includes('}')) {
									remaining_string = '';
								} else {
									remaining_string = last_entry;
									progress.pop();
								}
								progress.forEach((str) => {
									const result: {
										char_name: string;
										name?: string;
										class?: string;
										progress: number;
										total: number;
									} = JSON.parse(str);
									players.push(result);
									if (result.progress != null)
										if (
											result.progress > Math.floor((get(LoaderManager.store).progress ?? 0) / 100)
										)
											LoaderManager.set_status(
												`${result.progress}/${result.total} fetched`,
												(result.progress / result.total) * 100
											);
								});
							} catch (e) {
								console.log(new TextDecoder('utf-8').decode(value));
								console.error(e);
								LoaderManager.close();
								show_toast('Could not fetch characters', 'error');
							}
						}
					})(reader);
					LoaderManager.close();

					for (let player of players) {
						const local_player = (selected_guild?.local_players ?? war?.local_players ?? []).find(
							(p) => p.player.name === player.name
						);
						if (local_player) {
							local_player.character_class = player.class ?? undefined;
							local_player.character_name = player.char_name ?? undefined;
							const player_index = rows.findIndex((r) => r.columns[1] === player.name);
							if (player_index !== -1) {
								rows[player_index].columns[0] = bind(Class, {
									bdo_class: player.class ?? ''
								});
							}
						}
					}
					has_classes = true;
					add_class_column();
					$Manager.save_callback?.();
				})
				.catch((e) => {
					console.error(e);
					LoaderManager.close();
					show_toast('Could not fetch characters', 'error');
				});
		}
	}

	let selected_option: Option | undefined;
	$: options = war?.local_guilds.map((g) => ({
		title: g.guild.name,
		values: [
			`${g.local_players.length} Members`,
			`${g.kills} Kills`,
			`${g.deaths} Deaths`,
			`${format(g.duration)} min`
		]
	})) as Option[];

	$: selected_guild = selected_option
		? war?.local_guilds.find((g) => g.guild.name === selected_option?.title)
		: undefined;
</script>

<div class={is_puppeteer ? 'p-4' : ''}>
	<DashboardLayout
		loading={!war}
		bind:selected={selected_option}
		{options}
		stats={[
			`${war?.local_guilds.length} Guilds`,
			`${war?.local_players.length} Players`,
			`${war?.duration} minutes`
		]}
	>
		<div slot="title" class="flex min-w-0">
			<Icon
				size="lg"
				icon={war?.won ? GiCrownedSkull : GiSkullCrack}
				class="{war?.won ? 'text-submarine-500' : 'text-red-500'} mr-2 self-center shrink-0"
			/>
			<div class="flex flex-col gap-1 min-w-0">
				<div class="text-xl font-medium text-foreground truncate">{war?.name}</div>
				<div class="text-base text-gold-muted">{war?.date}</div>
			</div>
		</div>

		<svelte:fragment slot="actions">
			{#if !is_public}
				{#if $User.wars?.find((w) => w.unique_id == war?.unique_id && war.unique_id !== '')}
					<Button on:click={() => open_share()}>Shared</Button>
				{:else}
					<button on:click={() => open_share()} title="Share"><Icon icon={IoIosShareAlt} /></button>
				{/if}
				{#if !is_puppeteer}
					<button on:click={download_logs}>
						<Icon icon={MdFileDownload} />
					</button>
				{/if}
				<button on:click={() => ModalManager.open(WarForm, { war: war })} title="Edit"
					><Icon icon={MdSettings} /></button
				>
			{:else if war?.unique_id && $Manager.get_war_by_id(war?.unique_id)}
				<Button on:click={() => goto(`/wars/${war?.id}`)}>View in Dashboard</Button>
			{:else if !is_puppeteer}
				<Button on:click={add_war}>Add to Dashboard</Button>
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="content">
			<div class="flex flex-col xl:flex-row gap-2">
				<div class={selected_player ? 'min-w-0 w-full' : 'w-full'}>
					<Table
						id="war-players-{war?.id}"
						height={420}
						{header}
						{rows}
						searchable
						title={(selected_guild?.guild.name ?? 'All') + ' Players'}
					/>
				</div>
				{#if selected_player}
					<div
						class="relative flex flex-col min-h-0 gap-2 p-2 border-t xl:border-t-0 xl:border-l h-[420px] pt-2 pl-4 w-[600px] max-w-full min-w-0"
					>
						<h5 class="text-foreground font-medium inline-flex items-center">
							{#if selected_player?.character_class}
								<div>
									<Class bdo_class={selected_player.character_class} />
								</div>
							{/if}
							{selected_player?.player.name}
							{#if selected_player?.character_name}
								({selected_player?.character_name})
							{/if}
						</h5>

						<div class="absolute top-4 right-4">
							<button on:click={() => (selected_player = undefined)}>
								<Icon icon={MdClose} />
							</button>
						</div>

						<span class="text-sm">
							{selected_player?.kills} Kill{selected_player.kills !== 1 ? 's' : ''} | {selected_player?.deaths}
							Death{selected_player?.deaths !== 1 ? 's': ''} | {table_format(selected_player.performance)
								.label} Perf. | {table_format(selected_player.duration_percentage * 100, 0).label}%
							Present
						</span>
						<span class="text-sm">Logs ({selected_player?.local_events.length})</span>
						<div
							class="border border-dashed border-foreground rounded-md p-2 h-[200px] overflow-auto"
						>
							<VirtualList items={selected_player?.local_events ?? []} let:item={log}>
								<div class="flex gap-2 items-baseline group">
									<p class="text-sm text-gray-400">{log.time_string}:</p>
									<p>{log.player_one.name}</p>
									<div class="flex justify-center items-center">
										{#if log.kill}
											<Icon icon={GiBroadsword} class="self-center text-submarine-500" />
										{:else}
											<Icon icon={GiSkullCrack} class="self-center text-red-500" />
										{/if}
									</div>

									<p>{log.player_two.name}</p>
									{#if log.local_player_two?.character_class}
										<p class="self-center">
											<Class bdo_class={log.local_player_two.character_class} show_text={false} />
										</p>
									{/if}
									<p class="text-navy-400">[{log.guild}]</p>
								</div>
							</VirtualList>
						</div>
						<div class="h-2/3 w-full min-h-0 flex [&>div]:min-h-0 [&>div]:!h-full [&>div]:!w-full">
							<Table
								id="enemy-players-{selected_player?.player.name}"
								header={[
									{ label: 'Class', sortable: true },
									{ label: 'Name', sortable: true },
									{ label: 'Kills', sortable: true, sort_dir: 'des' },
									{ label: 'Deaths', sortable: true },
									{ label: 'Guild', sortable: true }
								]}
								rows={selected_player_enemy_columns}
								searchable
								title="Stats"
							/>
						</div>
					</div>
				{/if}
			</div>
		</svelte:fragment>

		<svelte:fragment slot="fields">
			<Field title="Guild member distribution">
				<Chart data={member_chart_data} labels={member_chart_labels} type="donut" height="100%" />
			</Field>
			{#if has_classes}
				<Field title="Class distribution{selected_guild ? ` of ${selected_guild.guild.name}` : ''}">
					<Chart
						colors={class_colors}
						data={class_chart_data}
						labels={class_chart_labels}
						type="donut"
						legend_width="125"
					/>
				</Field>
				<Field title="Class statistics">
					<Table
						id="war-classes-{war?.id}"
						height={275}
						header={class_table_header}
						rows={class_table_rows}
						searchable
						title={(selected_guild?.guild.name ?? 'All') + ' Players'}
					/>
				</Field>
			{:else}
				<Field title="Class statistics" class="sm:col-span-2">
					<div
						class="text-center text-foreground-secondary flex items-center justify-center h-full"
					>
						No class data available
					</div>
				</Field>
			{/if}
			<Field
				title="Kill/Death Overview of {selected_guild
					? ` of ${selected_guild.guild.name}`
					: 'All Players'}"
				class="sm:col-span-3 h-[315px]"
			>
				<Chart
					colors={['#1c9177', '#f05252']}
					tooltip_minutes
					height={'100%'}
					data={[
						{ name: 'Kills', data: kills_chart_data },
						{ name: 'Deaths', data: deaths_chart_data }
					]}
					labels={kill_chart_labels}
					dates
					type="area"
					legend_width="125"
				/>
			</Field>
		</svelte:fragment>
	</DashboardLayout>
</div>
