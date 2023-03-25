<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '../components/elements/button.svelte';
</script>

<div
	class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center flex-col"
>
	<h1 class="text-5xl font-bold">Ikusa</h1>
	<p class="text-center text-lg max-w-lg mt-2">
		Ikusa is a powerful tool that allows you to analyze your game logs and gain valuable insights
		into your combat performance.
	</p>
	<div class="mt-4 flex gap-2">
		<Button on:click={() => goto('/dashboard')}>Dashboard</Button>
		<Button color="secondary" on:click={() => goto('/dashboard')}>Get Started</Button>
	</div>
</div>
