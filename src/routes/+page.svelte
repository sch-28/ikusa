<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '../components/elements/button.svelte';
	import Footer from '../components/footer.svelte';
	import Guilds from '../components/landing/guilds.svelte';
	import Logger from '../components/landing/logger.svelte';
	import Logs from '../components/landing/logs.svelte';
	import { User } from '../logic/user';
	import { get_remaining_height } from '../logic/util';

	let hero_divider: HTMLElement;
</script>

<svelte:head>
	<title>Ikusa | BDO Combat Analyzer</title>
	<meta name="description" content="Ikusa - BDO Combat Analyzer" />
</svelte:head>

<div
	class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center flex-col"
>
	<h1 class="text-5xl font-bold text-gold">Ikusa</h1>
	<p class="text-center text-lg max-w-lg mt-2">
		Ikusa is a powerful tool that allows you to analyze your game logs and gain valuable insights
		into your combat performance.
	</p>
	<div class="mt-4 flex gap-2">
		{#if $User.discord_data}
			<Button on:click={() => goto('/dashboard')}>Dashboard</Button>
			<Button color="secondary" on:click={() => goto('/docs/introduction')}>Get Started</Button>
		{:else}
			<Button color="primary" on:click={() => goto('/docs/introduction')}>Get Started</Button>
		{/if}
	</div>
</div>

<div class="flex flex-col w-full justify-center gap-64 pb-20">
	<section style="padding-top: 95vh;">
		<Logs />
	</section>
	<section>
		<Guilds />
	</section>
	<section>
		<Logger />
	</section>
	<section class="max-w-8xl flex flex-col items-center">
		<h1 class="font-bold text-gold text-2xl mb-4">You already have logs?</h1>
		<Button on:click={() => goto('/dashboard')}>Start Analyzing</Button>
	</section>
</div>

<div bind:this={hero_divider} class="flex justify-end flex-col">
	<Footer />
</div>
