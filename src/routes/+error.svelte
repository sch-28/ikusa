<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '../components/elements/button.svelte';
	export let status = 200;
	export let message = 'ok';

	$: {
		if ($page.status != 200 && $page.error) {
			status = $page.status;
			message = $page.error?.message;
		}
	}
</script>

<div
	class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pb-20 text-center flex flex-col items-center"
>
	<h1>{status}: {message}</h1>

	{#if status == 404}
		<p>Sorry, we couldn't find that page.</p>
	{/if}

	<Button class="mt-2" on:click={() => history.back()}>Take me back</Button>
</div>
