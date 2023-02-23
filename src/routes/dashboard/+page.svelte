<script lang="ts">
	import { browser } from '$app/environment';
	import { chart } from 'svelte-apexcharts';

	let options = {
		chart: {
			type: 'area',
			animations: {
				enabled: false,
				easing: 'easeout',
				speed: 500
			},
			toolbar: {
				show: false
			},
			fontFamily: 'inherit',
			foreColor: '#f5cd40'
		},
		series: [
			{
				name: 'sales',
				data: [1.2, 2.1, 0.8, 1.5, 1.7, 1.6, 1.5, 2, 1.9]
			}
		],
		xaxis: {
			categories: ['19.02', '21.02', '25.02', '26.02', '28.02', '03.03', '04.03', '07.03', '10.03']
		},
		fill: {
			colors: ['#bd8e28']
		},
		colors: ['#f5cd40'],
		tooltip: {
			enabled: true,
			theme: 'dark',
			x: {
				show: true,
				format: 'yyyy'
			},
			y: {
				title: {
					formatter: function () {
						return 'Sales: ';
					}
				}
			}
		},
		toolbar: {
			show: false
		},
		dataLabels: {
			enabled: true,
			style: {
				colors: ['#333'],
				fontSize: '10px',
				fontFamily: 'inherit',
				fontWeight: 'normal'
			}
		},
		title: {
			text: 'War Performance',
			align: 'center',
			style: {
				fontSize: '16px',
				fontFamily: 'inherit',
				fontWeight: 'bold'
			}
		}
	};
</script>

<div class="flex justify-between mb-4">
	<p>Welcome back, ORACLE!</p>
	<p>Last login: 2 days ago</p>
</div>
<div class="sm:flex gap-2 items-center">
	<div use:chart={options} class="flex-grow" />
	<div class="grid grid-cols-2 gap-2 mx-auto h-fit w-fit">
		<div class="border border-gold p-2 rounded-lg hover:scale-[1.025] transition-all w-40 h-40">
			<p class="font-bold text-lg">General Stats</p>
			<div class="font-light text-sm">156 Players</div>
			<div class="font-light text-sm">23 Guilds</div>
			<div class="font-light text-sm">11 Wars</div>
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
