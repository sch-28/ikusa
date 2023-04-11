<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	export let title: string | undefined = undefined;
	export let type: 'area' | 'donut' = 'area';
	export let labels: string[] = [];
	export let data: { name: string; data: number[] }[] | number[] = [];
	export let min: number = 0;
	export let max: number | undefined = undefined;
	export let annotations: { height: number; label: string }[] = [];

	let render = false;

	$: options = {
		chart: {
			type: type,
			animations: {
				enabled: false,
				easing: 'easeout',
				speed: 500
			},
			fontFamily: 'inherit',
			foreColor: '#f5cd40'
		},
		series: data,
		xaxis: {
			categories: labels
		},
		yaxis: {
			min:
				min || typeof data[0] === 'number'
					? (data as number[]).reduce((a, b) => Math.min(a, b), 0)
					: (data as { name: string; data: number[] }[]).reduce(
							(a, b) =>
								Math.min(
									a,
									b.data.reduce((a, b) => Math.min(a, b), 0)
								),
							0
					  ),
			max: max,
			forceNiceScale: true
		},
		annotations: {
			yaxis: annotations.map((annotation) => {
				return {
					y: annotation.height,
					borderColor: 'red',
					strokeDashArray: 0,
					label: {
						text: annotation.label,
						borderColor: 'red',
						style: {
							color: '#fff',
							background: 'red'
						}
					}
				};
			})
		},
		labels: labels,
		fill: {
			colors: type === 'area' ? ['#bd8e28'] : undefined
		},
		colors: type === 'area' ? ['#f5cd40'] : undefined,
		tooltip: {
			enabled: true,
			theme: 'dark',
			x: {
				show: true,
				format: 'yyyy'
			}
		},

		dataLabels: {
			enabled: true,
			style: {
				colors: type === 'area' ? ['#333'] : ['#fff'],
				fontSize: type === 'area' ? '10px' : '16px',
				fontFamily: 'inherit',
				fontWeight: 'normal'
			},
			formatter: (value: number, opt: { seriesIndex: number }) => {
				if (type === 'area') return value;
				else if (type === 'donut') return `${labels[opt.seriesIndex]}: ${data[opt.seriesIndex]}`;
			}
		},
		subtitle: {
			text: title,
			align: 'center',
			style: {
				fontSize: '16px',
				fontFamily: 'inherit',
				fontWeight: 'bold'
			}
		}
	};

	let ApexCharts: {
		new (arg0: any, arg1: any): any;
		new (el: any, options: any): ApexCharts;
		prototype?: any;
		exec?: (chartID: string, fn: string, ...args: any[]) => any;
		getChartByID?: (chartID: string /*Ωignore_startΩ*/) => ApexCharts | undefined;
		initOnLoad?: () => void;
	};
	let loaded = false;

	const chart = (
		node: HTMLDivElement,
		options: {
			chart: {
				type: 'area' | 'donut';
				animations: { enabled: boolean; easing: string; speed: number };
				fontFamily: string;
				foreColor: string;
			};
			series: { name: string; data: number[] }[] | number[];
			xaxis: { categories: string[] };
			yaxis: { min: number; max: number | undefined; forceNiceScale: boolean };
			annotations: {
				yaxis: {
					y: number /*Ωignore_endΩ*/;
					borderColor: string;
					strokeDashArray: number /*Ωignore_startΩ*/;
					label: {
						text: string;
						borderColor: string;
						style: { color: string; background: string };
					};
				}[];
			};
			labels: string[];
			fill: { colors: string[] | undefined };
			colors: string[] | undefined;
			tooltip: { enabled: boolean; theme: string; x: { show: boolean; format: string } };
			dataLabels: {
				enabled: boolean;
				style: { colors: string[]; fontSize: string; fontFamily: string; fontWeight: string };
				formatter: (value: number, opt: { seriesIndex: number }) => string | number | undefined;
			};
			subtitle: {
				text: string | /*Ωignore_endΩ*/ undefined;
				align: string;
				style: { fontSize: string; fontFamily: string; fontWeight: string };
			};
		}
	) => {
		if (!loaded) return;

		let myChart = new ApexCharts(node, options);
		myChart.render();

		return {
			update(options: any) {
				myChart.updateOptions(options);
			},
			destroy() {
				myChart.destroy();
			}
		};
	};

	onMount(async () => {
		const module = await import('apexcharts');
		ApexCharts = module.default;
		(window as any).ApexCharts = ApexCharts;
		loaded = true;
	});
</script>

{#if loaded}
	{#key loaded || data || labels || options}
		<div use:chart={options} class="flex-grow" />
	{/key}
{/if}
