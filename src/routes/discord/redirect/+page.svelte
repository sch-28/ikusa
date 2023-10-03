<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '../../../components/elements/button.svelte';
</script>

<svelte:head>
	<meta http-equiv="refresh" content="0; url='/'" />
</svelte:head>

<div
	class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pb-20 text-center flex flex-col items-center"
>
	<h1 class="font-bold text-3xl mb-4">Redirecting...</h1>
	<Button size="sm" on:click={() => goto('/')}>Take me back</Button>
</div>
