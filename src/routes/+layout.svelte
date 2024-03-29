<script lang="ts">
	import '../app.css';
	import Header from '../components/header.svelte';
	import Modal from '../components/modal/modal.svelte';
	import { Toaster } from 'svelte-french-toast';
	import Loader from '../components/loader/loader.svelte';
	import { onMount } from 'svelte';
	import { Manager } from '../logic/stores';
	import { User } from '../logic/user';
	import { navigating, page } from '$app/stores';
	import LoadingCircle from '../components/elements/loading-circle.svelte';
	import { db } from '../logic/indexDB';

	let is_mounted = false;

	export let data: User | undefined;
	if (data && Object.keys(data).length > 0) {
		User.set(data);
	} else {
		User.set({ ...$User, discord_data: undefined });
	}

	onMount(async () => {
		const manager_worker = await import('../logic/worker/manager-worker?worker');
		const compress_worker = await import('../logic/worker/compress-worker?worker');

		const init_store_interval = setInterval(async () => {
			if ($Manager.save_callback) {
				$Manager.manager_worker = new manager_worker.default();
				$Manager.compress_worker = new compress_worker.default();
				is_mounted = true;
				clearInterval(init_store_interval);
				const result = await db.manager.where('id').equals(0).first();
				if (!result) {
					$Manager.save_callback();
				}
			}
		}, 4);
	});
	const origin = $page.url.origin;
	const default_title = 'Ikusa | BDO Combat Analyzer';
	const default_description =
		'Ikusa is a powerful tool that allows you to analyze your Black Desert Online logs and gain valuable insights into your combat performance.';
	const default_image = origin + '/meta/thumbnail-4.png';

	const title = $page.data.title ?? default_title;
	const subtitle = $page.data.subtitle ?? 'Ikusa';
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
	<meta property="og:site_name" content={subtitle} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:domain" content="Ikusa" />
	<meta name="twitter:image:src" content={image} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />

	<meta property="discord:color" content="#ff0000" />
	<meta property="discord:field1:name" content="Field 1 Name" />
	<meta property="discord:field1:value" content="Field 1 Value" />
	<meta property="discord:field2:name" content="Field 2 Name" />
	<meta property="discord:field2:value" content="Field 2 Value" />
</svelte:head>

{#if is_mounted}
	<div class="content">
		<div class="px-4 max-w-9xl mx-auto">
			<Header />
			<div class="mt-16">
				{#if $navigating}
					<div
						class="w-12 h-12 [&_svg]:!fill-gold [&_svg]:!text-gold-800 [&_svg]:dark:!text-dark-muted absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
					>
						<LoadingCircle />
					</div>
				{:else}
					<slot />
				{/if}
			</div>
		</div>
		<Modal />
		<Toaster />
		<Loader />
	</div>
{:else}
	<div
		class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2"
	>
		<div class="w-12 h-12 [&_svg]:!fill-gold [&_svg]:!text-gold-800 [&_svg]:dark:!text-dark-muted">
			<LoadingCircle />
		</div>
		<div class="text-xl font-bold text-light">Loading Data...</div>
	</div>
{/if}

<style>
	@media screen and (min-width: 84rem) {
		.content {
			padding-left: calc(100vw - 100%);
		}
	}
</style>
