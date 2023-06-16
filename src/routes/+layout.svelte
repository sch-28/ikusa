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
	import { page } from '$app/stores';

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
	const origin = $page.url.origin;
	const default_title = 'Ikusa | BDO Combat Analyzer';
	const default_description =
		'Ikusa is a powerful tool that allows you to analyze your Black Desert Online logs and gain valuable insights into your combat performance.';
	const default_image = origin + '/meta/thumbnail-4.png';

	const title = $page.data.title ?? default_title;
	const description = $page.data.description ?? default_description;
	const url = $page.url.href;
	const image = $page.data.image ?? default_image;
</script>

<svelte:head>
	<title>{title}</title>
	<meta content={title} property="og:title" />
	<meta name="title" content={title} />
	<meta name="description" content={description} />

	<meta content={description} property="og:description" />
	<meta property="twitter:description" content={description} />
	<meta content={url} property="og:url" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:domain" content="Ikusa" />
	<meta name="twitter:image:src" content={image} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />
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
