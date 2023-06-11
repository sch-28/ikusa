<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Table from '../table/table.svelte';
	import type { HeaderColumn, Row } from '../table/table';

	interface Log {
		player_one: string;
		player_two: string;
		guild: string;
		has_killed: boolean;
		time: string;
	}

	let raw_logs = [
		'[08:07:46] Distarfas has killed VictorMedC from Athanasy',
		'[08:07:45] Distarfas has killed Pingwel from Athanasy',
		'[08:07:48] OracIe has killed Sarser from Athanasy',
		'[08:07:50] FantomSVK has killed NoRagrets from Athanasy',
		'[08:08:04] Snowmanz has killed FG_TwinStar from Athanasy',
		'[08:08:06] REJECT has killed Elemental_Pain from Athanasy',
		'[08:08:06] LordAizen has killed Computer from Athanasy',
		'[08:08:07] REJECT has killed Luxifor from Athanasy',
		'[08:08:08] Distarfas has killed ShiNoLilith from Athanasy',
		'[08:08:11] Meatballer has killed PoloHolo from Athanasy',
		'[08:08:13] Distarfas has killed Uhukleber from Athanasy',
		'[08:08:19] OracIe has killed Vi_Darquise from Athanasy',
		'[08:08:25] Pawn has killed Iakij from Athanasy',
		'[08:08:29] Akmuo has killed IApo from Athanasy',
		'[08:09:00] Akmuo died to NoRagrets from Athanasy',
		'[08:09:06] Pawn has killed Znmop from Athanasy',
		'[08:10:15] Overlord69 died to Kayre from Athanasy',
		'[08:10:16] Distarfas has killed FG_TwinStar from Athanasy',
		'[08:10:17] REJECT has killed Elemental_Pain from Athanasy',
		'[08:10:20] OracIe has killed PoloHolo from Athanasy',
		'[08:10:21] Pawn has killed Luxifor from Athanasy',
		'[08:10:22] Rhand has killed Computer from Athanasy',
		'[08:10:24] OracIe has killed Sarser from Athanasy',
		'[08:10:25] Klauss has killed ShiNoLilith from Athanasy',
		'[08:10:32] ThreeD died to YberDC from Athanasy',
		'[08:10:34] Akmuo has killed VictorMedC from Athanasy',
		'[08:10:39] REJECT has killed Znmop from Athanasy',
		'[08:10:43] Pawn has killed Vi_Darquise from Athanasy',
		'[08:10:45] Rhand has killed Pingwel from Athanasy',
		'[08:10:49] REJECT has killed Iakij from Athanasy',
		'[08:10:57] Pawn has killed Uhukleber from Athanasy',
		'[08:11:09] REJECT died to IApo from Athanasy',
		'[08:11:13] Klauss has killed VictorMedC from Athanasy',
		'[08:11:13] Rhand has killed Sarser from Athanasy',
		'[08:11:23] Distarfas has killed PoloHolo from Athanasy',
		'[08:11:26] Distarfas has killed FG_TwinStar from Athanasy',
		'[08:11:29] Distarfas died to Computer from Athanasy',
		'[08:11:33] LordAizen died to Computer from Athanasy',
		'[08:11:34] Meatballer died to Uhukleber from Athanasy',
		'[08:11:56] Vagabond died to Computer from Athanasy',
		'[08:11:56] Klauss died to PoloHolo from Athanasy',
		'[08:11:59] OracIe died to FG_TwinStar from Athanasy',
		'[08:12:00] Akmuo died to IApo from Athanasy',
		'[08:12:00] Snowmanz died to IApo from Athanasy',
		'[08:12:01] Dezary died to IApo from Athanasy',
		'[08:12:08] Distarfas died to NoRagrets from Athanasy',
		'[08:12:20] Pawn died to IApo from Athanasy',
		'[08:12:20] Meatballer died to NoRagrets from Athanasy',
		'[08:12:24] ThreeD died to IApo from Athanasy',
		'[08:12:34] FantomSVK died to IApo from Athanasy',
		'[08:12:37] Rhand has killed Vi_Darquise from Athanasy',
		'[08:13:15] LordAizen has killed Pingwel from Athanasy',
		'[08:13:16] Meatballer has killed VictorMedC from Athanasy',
		'[08:13:21] Rhand has killed Computer from Athanasy',
		'[08:13:23] Mint has killed ShiNoLilith from Athanasy',
		'[08:13:27] KAPITALISM died to Kayre from Athanasy',
		'[08:13:27] Rhand has killed NoRagrets from Athanasy',
		'[08:13:28] Akmuo died to Vi_Darquise from Athanasy',
		'[08:13:29] Mint has killed PoloHolo from Athanasy',
		'[08:13:33] Dezary has killed Znmop from Athanasy',
		'[08:13:34] LordAizen died to Vi_Darquise from Athanasy',
		'[08:13:35] Mint has killed Vi_Darquise from Athanasy',
		'[08:13:35] Snowmanz has killed Uhukleber from Athanasy',
		'[08:13:39] OracIe has killed Luxifor from Athanasy',
		'[08:13:43] REJECT has killed FG_TwinStar from Athanasy',
		'[08:14:13] Vagabond died to Iakij from Athanasy',
		'[08:14:16] Rhand has killed Sarser from Athanasy',
		'[08:14:18] Distarfas has killed Vi_Darquise from Athanasy',
		'[08:14:21] REJECT has killed Iakij from Athanasy',
		'[08:14:28] ThreeD has killed Znmop from Athanasy',
		'[08:14:31] REJECT has killed NoRagrets from Athanasy',
		'[08:14:32] Pawn died to Xile from Athanasy',
		'[08:14:35] Meatballer has killed Pingwel from Athanasy',
		'[08:14:37] LordAizen died to FG_TwinStar from Athanasy',
		'[08:14:42] Meatballer died to PoloHolo from Athanasy',
		'[08:14:49] Snowmanz has killed PoloHolo from Athanasy',
		'[08:14:53] Klauss died to FG_TwinStar from Athanasy',
		'[08:14:55] Akmuo died to Hygaa from Athanasy',
		'[08:14:56] Snowmanz died to Vi_Darquise from Athanasy',
		'[08:15:00] ThreeD has killed Uhukleber from Athanasy',
		'[08:15:09] ThreeD died to Znmop from Athanasy',
		'[08:15:25] Vagabond died to Znmop from Athanasy',
		'[08:15:28] LordAizen died to NoRagrets from Athanasy',
		'[08:15:30] Pawn died to PoloHolo from Athanasy',
		'[08:15:33] Meatballer died to Sarser from Athanasy',
		'[08:15:33] Dezary died to Vi_Darquise from Athanasy',
		'[08:15:33] OracIe has killed VictorMedC from Athanasy',
		'[08:16:14] Rhand died to PoloHolo from Athanasy',
		'[08:16:29] ThreeD has killed FG_TwinStar from Athanasy',
		'[08:16:31] LordAizen has killed Luxifor from Athanasy',
		'[08:16:32] Meatballer has killed NoRagrets from Athanasy',
		'[08:16:33] ThreeD has killed PoloHolo from Athanasy',
		'[08:16:34] Klauss died to Elemental_Pain from Athanasy',
		'[08:16:37] Pawn has killed VictorMedC from Athanasy',
		'[08:16:40] Overlord69 died to Uhukleber from Athanasy',
		'[08:16:41] REJECT has killed Elemental_Pain from Athanasy',
		'[08:16:41] Mint has killed Pingwel from Athanasy',
		'[08:16:43] Dezary died to Znmop from Athanasy',
		'[08:16:43] ThreeD has killed Znmop from Athanasy',
		'[08:16:44] LordAizen has killed Computer from Athanasy',
		'[08:16:44] Akmuo has killed ShiNoLilith from Athanasy',
		'[08:16:52] Distarfas has killed Sarser from Athanasy',
		'[08:17:10] Mint died to PoloHolo from Athanasy',
		'[08:17:28] Rhand died to IApo from Athanasy',
		'[08:17:38] Klauss died to IApo from Athanasy',
		'[08:18:15] Pawn died to Kayre from Athanasy',
		'[08:18:19] ThreeD died to Kayre from Athanasy',
		'[08:18:29] Overlord69 died to Meijer from Athanasy',
		'[08:18:31] Klauss died to ShiNoLilith from Athanasy',
		'[08:18:34] Vagabond has killed Sarser from Athanasy',
		'[08:18:35] Snowmanz died to Ibeitis from Athanasy',
		'[08:18:37] Vagabond has killed VictorMedC from Athanasy',
		'[08:18:46] OracIe died to PoloHolo from Athanasy',
		'[08:18:47] Pawn has killed Swiper from Athanasy',
		'[08:18:48] Vagabond died to Xile from Athanasy',
		'[08:18:50] Rhand died to Computer from Athanasy',
		'[08:18:50] Meatballer died to ShiNoLilith from Athanasy',
		'[08:18:51] FantomSVK died to ShiNoLilith from Athanasy',
		'[08:18:59] ThreeD died to Dark_Wind from Athanasy',
		'[08:19:00] Klauss died to Vi_Darquise from Athanasy',
		'[08:19:03] Dezary died to PoloHolo from Athanasy',
		'[08:19:03] REJECT died to IApo from Athanasy',
		'[08:19:03] Pawn died to FG_TwinStar from Athanasy',
		'[08:19:09] Distarfas died to Iakij from Athanasy',
		'[08:19:13] Rhand has killed FG_TwinStar from Athanasy',
		'[08:19:29] Pawn died to VictorMedC from Athanasy',
		'[08:20:35] ThreeD died to Iakij from Athanasy',
		'[08:20:43] Snowmanz has killed Ibeitis from Athanasy',
		'[08:20:51] LordAizen has killed PoloHolo from Athanasy',
		'[08:20:57] KAPITALISM has killed Swiper from Athanasy',
		'[08:20:58] Vagabond died to ShiNoLilith from Athanasy',
		'[08:20:58] OracIe died to NoRagrets from Athanasy',
		'[08:21:01] Dezary has killed Vi_Darquise from Athanasy',
		'[08:21:04] Dezary died to Luxifor from Athanasy',
		'[08:21:05] Rhand died to Vi_Darquise from Athanasy',
		'[08:21:11] REJECT died to Uhukleber from Athanasy',
		'[08:21:12] LordAizen died to Luxifor from Athanasy',
		'[08:21:13] Snowmanz died to Dark_Wind from Athanasy',
		'[08:21:14] Pawn has killed Ibeitis from Athanasy',
		'[08:21:16] FantomSVK has killed ShiNoLilith from Athanasy',
		'[08:21:18] Mint has killed NoRagrets from Athanasy',
		'[08:21:18] KAPITALISM died to Luxifor from Athanasy',
		'[08:21:19] Overlord69 died to Uhukleber from Athanasy',
		'[08:21:22] FantomSVK has killed Pingwel from Athanasy',
		'[08:21:24] Akmuo died to Znmop from Athanasy',
		'[08:21:27] Mint has killed Znmop from Athanasy',
		'[08:21:37] ThreeD died to Ibeitis from Athanasy',
		'[08:21:43] Pawn died to Ibeitis from Athanasy',
		'[08:21:44] Distarfas has killed PoloHolo from Athanasy',
		'[08:21:50] INET has killed VictorMedC from Athanasy',
		'[08:21:53] Mint has killed Boomshakalakaa from Athanasy',
		'[08:21:53] Meatballer has killed Swiper from Athanasy',
		'[08:22:00] INET died to Hygaa from Athanasy',
		'[08:22:04] Mint has killed Hygaa from Athanasy',
		'[08:22:04] Mint has killed Iakij from Athanasy',
		'[08:22:04] KAPITALISM died to Elemental_Pain from Athanasy',
		'[08:22:31] LordAizen died to Lyerella from Athanasy',
		'[08:22:34] Pawn died to VictorMedC from Athanasy',
		'[08:22:45] ThreeD died to Hygaa from Athanasy',
		'[08:22:55] Snowmanz has killed Iakij from Athanasy',
		'[08:23:09] Meatballer died to PoloHolo from Athanasy',
		'[08:23:11] LordAizen died to Luxifor from Athanasy'
	];
	const regex = /\[(.*)\] (\w*) (died to|has killed) (\w*) from (\w*)/;
	let logs: Log[] = [];

	let last_log = 20;

	$: {
		logs = [];
		for (let log of raw_logs.slice(1, last_log)) {
			const results = log.match(regex)!;
			const kill = results[3] == 'has killed';
			logs.push({
				player_one: results[2],
				player_two: results[4],
				has_killed: kill,
				guild: results[5],
				time: results[1].split(':').slice(1).join(':')
			} as Log);
		}
	}

	let scroll_container: HTMLDivElement;
	let interval: NodeJS.Timeout;
	function add_log() {
		last_log++;
		if (last_log == raw_logs.length) last_log = 1;
		interval = setTimeout(add_log, Math.random() * 5000);
		setTimeout(() => {
			if (scroll_container) scroll_container.scrollTop = scroll_container.scrollHeight;
		});
	}
	onMount(() => {
		setTimeout(() => (scroll_container.scrollTop = scroll_container.scrollHeight));
		interval = setTimeout(() => {
			add_log();
		}, 2000);
	});

	onDestroy(() => {
		clearTimeout(interval);
	});

	const header: HeaderColumn<string>[] = [
		{ label: 'Name', width: 3, sortable: true },
		{ label: 'Kills', width: 1, sortable: true },
		{ label: 'Deaths', width: 1, sortable: true },
		{
			label: 'Performance',
			title: 'Average Performance (Kills Compared to Guild Average Kills)',
			width: 1,
			sortable: true
		}
	];
	let rows: Row[] = [];
</script>

<div class="flex w-full">
	<div class="flex flex-col gap-4 items-center w-full">
		<div class="sm:w-5/12 flex flex-col text-center">
			<span class="font-bold text-gold text-lg">More than boring Logs</span>
			Find out more about each individual Member and see who performs best. Keep track of your enemies
			and their numbers to gain a competitive advantage.
		</div>
		<div class="sm:w-6/12 w-full z-10">
			<span class="tab">Combat</span>
			<div class="log_wrapper">
				<div
					class="flex flex-col h-full overflow-x-auto overflow-y-scroll pr-2"
					bind:this={scroll_container}
				>
					{#each logs as log}
						<span class="w-full truncate min-w-0 shrink-0">
							[{log.time}]
							<i class="player">{log.player_one}</i>
							{#if log.has_killed}
								<i class="killed">has killed</i>
							{:else}
								<i class="died">died to</i>
							{/if}
							<i class="player">{log.player_two}</i>
							of the
							<i class="guild">{log.guild}</i>
							alliance.
						</span>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<!-- <div class="">
		<Table id="landing-page" {header} {rows} />
	</div> -->
</div>

<style>
	i {
		font-style: normal;
	}

	.player {
		color: #ffd543;
	}

	.killed {
		color: #00a8bb;
	}

	.guild {
		color: #33d2d0;
	}

	.died {
		color: #ff7171;
	}

	.log_wrapper {
		width: 100%;
		position: relative;
		height: 200px;
		max-height: 200px;
		overflow: hidden;
		scroll-padding-top: 15px;
		padding: 5px;
		padding-left: 10px;
		box-sizing: border-box;
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-base);
		border-top-left-radius: 0;
		z-index: -1;
	}
	.log_wrapper::after {
		content: '';
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		position: absolute;
		border: 5px solid #353941;
		border-radius: calc(var(--radius-base) + 0.2rem);
		border-top-left-radius: 0;
		border-radius: 5px;
		box-sizing: border-box;
		pointer-events: none;
	}

	/* .logs > :nth-last-child(10) {
		margin-top: 50px;
	} */

	.tab {
		background-color: #353941;
		width: fit-content;
		border-radius: 10px;
		padding: 10px;
		padding-top: 5px;
		padding-bottom: 0px;
		z-index: 1;
		box-sizing: border-box;
		display: block;
		position: relative;
	}

	.tab::after {
		content: '';
		position: absolute;
		background-color: #353941;
		z-index: -1;
		width: 100%;
		height: 100%;
		bottom: -5px;
		left: 0;
	}
</style>
