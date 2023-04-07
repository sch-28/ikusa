<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '../../../components/elements/icon.svelte';
	import { ModalManager } from '../../../components/modal/modal-store';
	import WarForm from '../../../components/modal/modals/war-form.svelte';
	import type { HeaderColumn, Row } from '../../../components/table/table';
	import Table from '../../../components/table/table.svelte';
	import { Log, type Local_Guild, type War } from '../../../logic/data';
	import { Manager } from '../../../logic/stores';
	import { format, show_toast } from '../../../logic/util';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
	import GiSkullCrack from 'svelte-icons/gi/GiSkullCrack.svelte';
	import GiCrownedSkull from 'svelte-icons/gi/GiCrownedSkull.svelte';
	import Button from '../../../components/elements/button.svelte';
	import IoIosShareAlt from 'svelte-icons/io/IoIosShareAlt.svelte';
	import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
	import { User } from '../../../logic/user';
	import { goto } from '$app/navigation';

	import type { War as PrismaWar } from '@prisma/client';
	import LZString from 'lz-string';
	import { ManagerClass } from '../../../logic/manager';

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
		get_war($page.params.id);
	}

	async function get_war(id?: string) {
		if (id) {
			war = $Manager.get_war(id);
			if (!war) {
				const result = (await fetch('/api/war/' + id).then((r) => r.json())) as PrismaWar;
				if (result) {
					const data = LZString.decompressFromEncodedURIComponent(result.data);
					if (!data) return;
					const results = [...data.matchAll(/\[.*\] (\w*) (died to|has killed) (\w*) from (\w*)/g)];
					if (results.length > 0) {
						const logs = results.map((log) => Log.parse_log(log[0]));
						const manager = new ManagerClass();
						war = manager.add_war({
							guild_name: result.guild_name,
							date: result.date,
							logs: logs,
							name: result.name,
							unique_id: result.id,
							won: result.won
						});
					}
				}
			}
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

	async function share_war() {
		if (!$User.discord_data) {
			show_toast('You need to login via discord to share a war', 'error');
			return;
		}
		
		if (war && !$User.wars?.find((w) => w.unique_id == war?.unique_id)) {
			const prisma_war: Omit<PrismaWar, 'userId'> = {
				date: war.date,
				guild_name: war.guild_name,
				name: war.name,
				data: LZString.compressToEncodedURIComponent(war.logs.map((l) => l.message).join('\n')),
				guilds: war.guild_name,
				id: war.unique_id,
				won: war.won
			};

			const result = await fetch('/api/share', {
				method: 'POST',
				body: JSON.stringify(prisma_war)
			});
			if (result.status == 200) {
				$User.wars?.push(war.to_json());
			}
		}
		goto(`/wars/${war?.unique_id}`);
	}
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
		<button on:click={share_war} title="Share" class="my-auto ml-auto"
			><Icon icon={IoIosShareAlt} class="self-center " /></button
		>
		<button
			on:click={() => ModalManager.open(WarForm, { war: war })}
			title="Edit"
			class="ml-2 my-auto"><Icon icon={MdSettings} class="self-center " /></button
		>
	</div>
	<div class="mb-4 divide-x-2 space-x-2 flex divide-gold-muted">
		<div>{war.local_guilds.length} Guilds</div>
		<div class="pl-2">{war.local_players.length} Players</div>
		<div class="pl-2">{war.duration} minutes</div>
	</div>
	<div class="flex gap-4 sm:flex-row flex-col border border-gold border-dashed p-2 rounded-lg">
		<div
			class="flex sm:flex-col gap-2 w-fit mx-auto sm:mx-0 shrink-0 overflow-y-auto pr-2 flex-wrap sm:flex-nowrap sm:h-[30rem] justify-center sm:justify-start"
		>
			{#each war.local_guilds as local_guild}
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
		</div>
		<div class="w-full">
			<Table
				id="war-players"
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
