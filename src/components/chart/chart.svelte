<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import LoadingIndicator from '../elements/loading-indicator.svelte';
	import dayjs from 'dayjs';
	import { Toggle } from 'flowbite-svelte';
	import { Event } from '../../logic/data';

	export let title: string | undefined = undefined;
	export let type: 'area' | 'donut' = 'area';
	export let labels: string[] | number[] = [];
	export let data: { name: string; data: number[] }[] | number[] = [];
	export let min: number = 0;
	export let max: number | undefined = undefined;
	export let annotations: { height: number; label: string }[] = [];
	export let data_labels: boolean = false;
	export let dates: boolean = false;
	export let date_switch: boolean = false;
	export let tooltip_minutes: boolean = false;
	export let height: string = 'auto';
	export let legend_width: string = 'auto';
	export let colors: string[] = [];
	export let event_data: Event[][] = [];

	function escape_html(s: string) {
		return s.replace(
			/[&<>"']/g,
			(m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])
		);
	}
	let formatted_labels: string[] | number[] = [];
	let options: any;
	let chart_container: HTMLDivElement;
	let current_chart: any;

	$: show_custom_tooltip = event_data && event_data.length > 0;
	$: console.log(show_custom_tooltip);

	let tooltip:ApexCharts.ApexOptions["tooltip"] = {
		enabled: true,
		theme: 'dark',
		x: {
			show: true,
			format: tooltip_minutes ? 'HH:mm:ss' : 'yyyy-MM-dd'
		}
	};
	$: {
		if (show_custom_tooltip) {
			tooltip = {
				enabled: true,
				fixed: {
					enabled: true,
					position: 'topRight',
					offsetY: -790
				},
				custom: function ({
					series,
					dataPointIndex
				}: {
					series: number[][];
					dataPointIndex: number;
				}) {
					const timeLabel = new Intl.DateTimeFormat(undefined, {
						hour: '2-digit',
						minute: '2-digit',
						hour12: false
					}).format(new Date(labels[dataPointIndex]));
					const kills = series[0]?.[dataPointIndex] ?? '';
					const deaths = series[1]?.[dataPointIndex] ?? '';

					const logs = event_data[dataPointIndex];
					const logsHtml = logs.length
						? `<div style="margin-top:6px;border-top:1px solid #e3e3e3;padding-top:6px;">
                                        <div style="font-weight:600;margin-bottom:4px;">logs:</div>
                                        ${logs
																					.map(
																						(l) =>
																							`<div>${escape_html(l.message.split('(')[0])}</div>`
																					)
																					.join('')}
                                        </div>`
						: '';

					return `
                                    <div style="padding:10px; width: 600px; font-family:inherit; font-size:12px;">
                                        <div style="font-weight:600;">${timeLabel}</div>
                                        <div>kills: ${kills}</div>
                                        <div>deaths: ${deaths}</div>
                                        ${logsHtml}
                                    </div>
                                    `;
				}
			};
		}
	}

	$: {
		formatted_labels = dates
			? labels
					.map((label) =>
						typeof label === 'string' ? dayjs(label, 'YYYY-MM-DD').toDate().getTime() : label
					)
					.sort((a, b) => a - b)
			: labels;
		options = {
			stroke: {
				curve: 'smooth'
			},
			legend: {
				width: legend_width,
				offsetY: 0,
				horizontalAlign: 'left'
			},
			plotOptions: {
				pie: {
					donut: {
						labels: {
							show: true,
							total: {
								show: true
								/* label: '', */
								/* formatter: () => 'hi' */
							}
						}
					}
				}
			},
			chart: {
				width: '100%',
				height: height,
				id: 'chart',
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
				categories: formatted_labels as string[],
				type: dates ? 'datetime' : 'category',
				labels: {
					datetimeUTC: false
				}
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
			labels: formatted_labels as string[],
			colors: type === 'area' && colors.length === 0 ? ['#f5cd40'] : colors,
			tooltip,
			dataLabels: {
				enabled: data_labels,
				distributed: true,
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
		rerender();
	}

	async function rerender() {
		if (!loaded) return;
		current_chart?.destroy();

		current_chart = new ApexCharts(chart_container, options);
		await current_chart.render();

		return {
			update(options: any) {
				current_chart.updateOptions(options);
			},
			destroy() {
				current_chart.destroy();
			}
		};
	}

	let ApexCharts: {
		new (arg0: any, arg1: any): any;
		new (el: any, options: any): ApexCharts;
		prototype?: any;
		exec?: (chartID: string, fn: string, ...args: any[]) => any;
		getChartByID?: (chartID: string /*Ωignore_startΩ*/) => ApexCharts | undefined;
		initOnLoad?: () => void;
	};
	let loaded = false;

	onMount(async () => {
		const module = await import('apexcharts');
		ApexCharts = module.default;
		(window as any).ApexCharts = ApexCharts;
		loaded = true;
		setTimeout(() => (options = options));
	});

	onDestroy(() => {
		current_chart?.destroy();
	});
</script>

{#if loaded}
	{#key loaded || data || labels || options || dates}
		<div class="flex-grow relative chart-container chart-{type}">
			<div class="flex-grow" bind:this={chart_container} />
			{#if date_switch}
				<div class="absolute z-10 top-0 right-40 [&_label]:leading-none">
					<Toggle bind:checked={dates}>Format Dates</Toggle>
				</div>
			{/if}
		</div>
	{/key}
{:else}
	<div class="flex-grow flex items-center justify-center aspect-[685/425]">
		<LoadingIndicator size="lg" />
	</div>
{/if}

<style>
	:global(.apexcharts-menu) {
		background-color: rgb(31 31 31 / var(--tw-bg-opacity)) !important;
	}

	:global(.apexcharts-menu-item:hover) {
		background-color: rgb(28 28 28 / var(--tw-bg-opacity)) !important;
	}

	:global(.apexcharts-tooltip) {
		background: rgb(28, 28, 28) !important;
	}
</style>
