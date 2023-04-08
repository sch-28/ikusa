<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { chart } from 'svelte-apexcharts';
	import MdAdd from 'svelte-icons/md/MdAdd.svelte';
	import Chart from '../../components/chart/chart.svelte';
	import Button from '../../components/elements/button.svelte';
	import Icon from '../../components/elements/icon.svelte';
	import { ModalManager } from '../../components/modal/modal-store';
	import Upload from '../../components/modal/modals/war-form.svelte';
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
			<div class="font-light text-sm">54 kills</div>
			<div class="font-light text-sm">20 deaths</div>
			<div class="font-light text-sm">6 Wars</div>
			<div class="font-light text-sm">124min playtime</div>
		</div>
		<div class="border border-gold p-2 rounded-lg hover:scale-[1.025] transition-all w-40 h-40">
			<p class="font-bold text-lg">ORY Stats</p>
			<div class="font-light text-sm">4 Wins</div>
			<div class="font-light text-sm">3 Losses</div>
			<div class="font-light text-sm">23 Members</div>
			<div class="font-light text-sm">2.3 Performance</div>
		</div>
		<div class="border border-gold p-2 rounded-lg hover:scale-[1.025] transition-all w-40 h-40">
			<p class="font-bold text-lg">Recent Wars</p>
			<div class="font-light text-sm">Guild War vs Ecchi</div>
			<div class="font-light text-sm">21.02.2023</div>
			<div class="font-light text-sm">Yolo Nodewar</div>
			<div class="font-light text-sm">Epic fight</div>
			<div class="font-light text-sm">18.02.2023</div>
		</div>
		<div class="border border-gold p-2 rounded-lg hover:scale-[1.025] transition-all w-40 h-40">
			<p class="font-bold text-lg">Top Players</p>
			<div class="font-light text-sm">Basedman</div>
			<div class="font-light text-sm">Cake</div>
			<div class="font-light text-sm">Eflcaller</div>
			<div class="font-light text-sm">Hoizemann</div>
			<div class="font-light text-sm">Baba</div>
		</div>
		<div class="border border-gold p-2 rounded-lg hover:scale-[1.025] transition-all w-40 h-40">
			<p class="font-bold text-lg">Top Guilds</p>
			<div class="font-light text-sm">ORY</div>
			<div class="font-light text-sm">Athanasy</div>
			<div class="font-light text-sm">Ecchi</div>
			<div class="font-light text-sm">Mythic</div>
		</div>
	</div>
</div>

<Button class="mx-auto" on:click={() => ModalManager.open(Upload, { war: undefined })}>
	<Icon icon={MdAdd} />
	Add War
</Button>
<Button on:click={signout}>Signout</Button>
