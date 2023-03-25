<script lang="ts">
	import '../app.css';
	import Header from '../components/header.svelte';
	import Modal from '../components/modal/modal.svelte';
	import { Toaster } from 'svelte-french-toast';
	import Loader from '../components/loader/loader.svelte';
	import { onMount } from 'svelte';
	import { Manager } from '../logic/stores';

	let is_mounted = false;

	onMount(async () => {
		const worker = await import('../logic/manager-worker?worker');
		$Manager.worker = new worker.default();
		/* load_store(Manager, 'manager'); */
		is_mounted = true;
	});
</script>

{#if is_mounted}
	<div class="content">
		<div class="px-4 max-w-7xl mx-auto">
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
