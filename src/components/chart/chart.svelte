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

	let render = false;

	$: options = {
		chart: {
			type: type,
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
		series: data,
		xaxis: {
			categories: labels
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
		toolbar: {
			show: false
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
				if (type === 'area') return value
				else if (type === 'donut')
					return `${labels[opt.seriesIndex]}: ${data[opt.seriesIndex]}`;
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

{#if render}
	<div use:chart={options} class="flex-grow" />
{/if}
