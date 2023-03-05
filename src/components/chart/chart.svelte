<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { chart } from 'svelte-apexcharts';
	import MdAdd from 'svelte-icons/md/MdAdd.svelte';
	import Button from '../../components/elements/button.svelte';
	import Icon from '../../components/elements/icon.svelte';
	import { ModalManager } from '../../components/modal/modal-store';
	import Upload from '../../components/modal/modals/war-form.svelte';

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
			min: min,
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

	onMount(() => {
		if (browser) {
			render = true;
		}
	});
</script>

{#key render || data || labels || options}
	<div use:chart={options} class="flex-grow" />
{/key}
