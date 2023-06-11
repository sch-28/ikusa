<script lang="ts">
	import '../app.css';
	import Header from '../components/header.svelte';
	import Modal from '../components/modal/modal.svelte';
	import { Toaster } from 'svelte-french-toast';
	import Loader from '../components/loader/loader.svelte';
	import { onMount } from 'svelte';
	import { Manager } from '../logic/stores';
	import { User } from '../logic/user';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });

	let is_mounted = false;

	export let data: User | undefined;

	if (data && Object.keys(data).length > 0) {
		User.set(data);
	}

	onMount(async () => {
		const worker = await import('../logic/manager-worker?worker');
		$Manager.worker = new worker.default();
		/* load_store(Manager, 'manager'); */
		is_mounted = true;
	});
</script>

<svelte:head>
	<title>Ikusa</title>
	<meta name="description" content="Ikusa - BDO Combat Log Analyzer" />
</svelte:head>

{#if is_mounted}
	<div class="content">
		<div class="px-4 max-w-9xl mx-auto">
			<Header />
			<div class="mt-16">
				<slot />
			</div>
		</div>
		<Modal />
		<Toaster />
		<Loader />
	</div>
{/if}

<style>
	@media screen and (min-width: 84rem) {
		.content {
			padding-left: calc(100vw - 100%);
		}
	}
</style>
