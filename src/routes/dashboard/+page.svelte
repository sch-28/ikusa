<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { A } from 'flowbite-svelte';
	import { chart } from 'svelte-apexcharts';
	import MdAdd from 'svelte-icons/md/MdAdd.svelte';
	import Chart from '../../components/chart/chart.svelte';
	import Button from '../../components/elements/button.svelte';
	import Icon from '../../components/elements/icon.svelte';
	import { ModalManager } from '../../components/modal/modal-store';
	import Upload from '../../components/modal/modals/war-form.svelte';
	import { Player } from '../../logic/data';
	import { Manager } from '../../logic/stores';
	import { User } from '../../logic/user';

	const data = [
		{
			name: 'sales',
			data: [1.2, 2.1, 0.8, 1.5, 1.7, 1.6, 1.5, 2, 1.9]
		}
	];

	const labels = ['19.02', '21.02', '25.02', '26.02', '28.02', '03.03', '04.03', '07.03', '10.03'];

	function signout() {
		$User.discord_data = undefined;
		goto('/discord/signout');
	}

	$: player = $User.name ? $Manager.players.find((p) => p.name === $User.name) : undefined;
	$: guild = $User.guild ? $Manager.guilds.find((g) => g.name === $User.guild) : undefined;
</script>

<div class="flex justify-between mb-4">
	<p>Welcome back, {$User.discord_data?.username || $User.name || 'Person'}!</p>
</div>
<div class="sm:flex gap-2 items-center">
	<!-- <div use:chart={options} class="flex-grow" /> -->
	<Chart type="area" {data} {labels} title="Performance" />
	<div class="grid grid-cols-2 gap-2 mx-auto h-fit w-fit">
		<div class="border border-gold p-2 rounded-lg hover:scale-[1.025] transition-all w-40 h-40">
			<p class="font-bold text-lg">General Stats</p>
			<div class="font-light text-sm">{$Manager.players.length} Players</div>
			<div class="font-light text-sm">{$Manager.guilds.length} Guilds</div>
			<div class="font-light text-sm">{$Manager.wars.length} Wars</div>
			<div class="font-light text-sm">
				{$Manager.wars.reduce((sum, war) => sum + war.logs.length, 0)} Logs
			</div>
		</div>
		<div class="border border-gold p-2 rounded-lg hover:scale-[1.025] transition-all w-40 h-40">
			<p class="font-bold text-lg">Your Stats</p>
			{#if player}
				<div class="font-light text-sm">{player.kills} Kills</div>
				<div class="font-light text-sm">{player.deaths} Deaths</div>
				<div class="font-light text-sm">{player.locals.length} Wars</div>
				<div class="font-light text-sm">
					{player.locals.reduce((sum, local) => sum + local.duration, 0)} Minutes
				</div>
			{:else}
				<div class="font-light text-sm">No data, set your family name in the settings.</div>
			{/if}
		</div>
		<div class="border border-gold p-2 rounded-lg hover:scale-[1.025] transition-all w-40 h-40">
			{#if guild}
				<p class="font-bold text-lg">{guild.name} Stats</p>
				<div class="font-light text-sm">{guild.wins} Wins</div>
				<div class="font-light text-sm">{guild.losses} Losses</div>
				<div class="font-light text-sm">{guild.players.length} Members</div>
				<div class="font-light text-sm">{guild.average_kill_difference} Avg. Kill Diff.</div>
			{:else}
				<p class="font-bold text-lg">Guild Stats</p>
				<p class="font-light text-sm">No data, set your guild in the settings.</p>
			{/if}
		</div>
		<div class="border border-gold p-2 rounded-lg hover:scale-[1.025] transition-all w-40 h-40">
			<p class="font-bold text-lg">Recent Wars</p>
			<div class="flex flex-col">
				{#each $Manager.wars.slice($Manager.wars.length - 5, $Manager.wars.length) as war}
					<a class="font-light text-sm" href="/wars/{war.id}">{war.name}</a>
				{/each}
			</div>
		</div>
		<div class="border border-gold p-2 rounded-lg hover:scale-[1.025] transition-all w-40 h-40">
			<p class="font-bold text-lg">Top Players</p>
			<div class="flex flex-col">
				{#each $Manager.sorted_players.slice(0, 5) as player}
					<a class="font-light text-sm" href="/players/{player.name}">{player.name}</a>
				{/each}
			</div>
		</div>
		<div class="border border-gold p-2 rounded-lg hover:scale-[1.025] transition-all w-40 h-40">
			<p class="font-bold text-lg">Top Guilds</p>
			<div class="flex flex-col">
				{#each $Manager.sorted_guilds.slice(0, 5) as guild}
					<a class="font-light text-sm" href="/guilds/{guild.name}">{guild.name}</a>
				{/each}
			</div>
		</div>
	</div>
</div>

<Button class="mx-auto" on:click={() => ModalManager.open(Upload, { war: undefined })}>
	<Icon icon={MdAdd} />
	Add War
</Button>
