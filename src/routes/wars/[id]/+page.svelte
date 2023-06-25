<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '../../../components/elements/icon.svelte';
	import { ModalManager } from '../../../components/modal/modal-store';
	import WarForm from '../../../components/modal/modals/war-form.svelte';
	import type { HeaderColumn, Row, RowElement } from '../../../components/table/table';
	import Table from '../../../components/table/table.svelte';
	import { Manager } from '../../../logic/stores';
	import { debounce, format, redirect_and_toast, show_toast } from '../../../logic/util';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
	import GiSkullCrack from 'svelte-icons/gi/GiSkullCrack.svelte';
	import GiCrownedSkull from 'svelte-icons/gi/GiCrownedSkull.svelte';
	import Button from '../../../components/elements/button.svelte';
	import IoIosShareAlt from 'svelte-icons/io/IoIosShareAlt.svelte';
	import { User } from '../../../logic/user';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import LoadingCircle from '../../../components/elements/loading-circle.svelte';
	import { Log, type Local_Guild, type War, Player } from '../../../logic/data';
	import { parse } from 'flatted';
	import Share from '../../../components/modal/modals/share.svelte';
	import MdFileDownload from 'svelte-icons/md/MdFileDownload.svelte';
	import { saveAs } from 'file-saver';
	import { PUBLIC_IKUSA_API } from '$env/static/public';
	import Class from '../../players/class.svelte';
	import { bind } from 'svelte-simple-modal';
	import { LoaderManager } from '../../../components/loader/loader-store';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	$: is_puppeteer = $page.url.searchParams.has('puppeteer');

	let selected_guild: Local_Guild | undefined;
	export let data: PageData;

	$: ({ war: war_raw, is_public, is_own } = data);
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
				war = parse(war_raw);
				console.log(war)
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

	function update_rows() {
		if (war) {
			rows.splice(0, rows.length);
			for (const local_player of selected_guild?.local_players ?? war.local_players) {
				rows.push({
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
								: [undefined]
							: []),
						local_player.player.name,
						local_player.kills,
						local_player.deaths,
						format(local_player.performance),
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

	$: chart_data = war?.local_guilds.map((local_guild) => local_guild.local_players.length) ?? [];
	$: chart_labels = war?.local_guilds.map((local_guild) => local_guild.guild.name) ?? [];

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
			goto(`/wars/${war.id}`, { invalidateAll: true });
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
			LoaderManager.open();
			const all_characters = war.logs.map((l) => l.character_names).flat();
			let character_names = [...new Set(all_characters)];

			fetch(`${PUBLIC_IKUSA_API}/api/characters`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ names: character_names, region: 'EU' })
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
					const players: {
						char_name: string;
						name?: string;
						class?: string;
						progress: number;
						total: number;
					}[] = [];

					await (async (reader) => {
						if (!reader) return;
						let done, value;
						while (!done) {
							({ value, done } = await reader.read());
							if (done) {
								return true;
							}
							try {
								const JSONStrings = new TextDecoder('utf-8')
									.decode(value)
									.split('{')
									.map((js) => '{' + js)
									.splice(1);
								JSONStrings.forEach((str) => {
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
								console.log(e);
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
</script>

{#if war && !loading}
	<div class="flex items-start mb-4">
		<Icon
			size="lg"
			icon={war.won ? GiCrownedSkull : GiSkullCrack}
			class="{war.won ? 'text-submarine-500' : 'text-red-500'} mr-2 self-center"
		/>
		<div class="flex flex-col gap-1">
			<div class="text-xl font-medium text-foreground">{war.name}</div>
			<div class="text-base text-gold-muted">{war.date}</div>
		</div>
		<div class="flex gap-2 ml-auto justify-center my-auto">
			{#if !is_public}
				{#if has_characters}
					<button
						on:click={sync_war}
						title="BDO Sync"
						class="h-10 w-10 flex items-center justify-center border-2 border-dashed border-gold rounded-full font-extrabold
					hover:bg-gold hover:text-black transition
					"
					>
						<span class="mt-[1px]">BDO</span>
					</button>
				{/if}
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
			{:else if $Manager.get_war_by_id(war.unique_id)}
				<Button on:click={() => goto(`/wars/${war?.id}`)}>View in Dashboard</Button>
			{:else if !is_puppeteer}
				<Button on:click={add_war}>Add to Dashboard</Button>
			{/if}
		</div>
	</div>
	<div class="mb-4 divide-x-2 space-x-2 flex divide-foreground-secondary">
		<div>{war.local_guilds.length} Guilds</div>
		<div class="pl-2">{war.local_players.length} Players</div>
		<div class="pl-2">{war.duration} minutes</div>
	</div>
	<div
		class="flex gap-4 sm:flex-row flex-col border border-foreground border-dashed p-2 rounded-lg"
	>
		<div
			class="flex sm:flex-col gap-2 w-fit mx-auto sm:mx-0 shrink-0 overflow-y-auto pr-2 flex-wrap sm:flex-nowrap sm:h-[420px] justify-center sm:justify-start"
		>
			{#each war.local_guilds as local_guild}
				<button
					class="flex flex-col p-2 border border-foreground rounded-lg min-w-0 h-[126px] aspect-square {selected_guild ===
					local_guild
						? 'bg-foreground text-black'
						: ''}"
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
		</div>
		<div class="w-full min-w-0">
			<Table
				id="war-players-{war.id}"
				height={420}
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
{:else}
	<div
		class="w-12 h-12 [&_svg]:!fill-gold [&_svg]:!text-gold-800 [&_svg]:dark:!text-dark-muted absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
	>
		<LoadingCircle />
	</div>
{/if}
