<script lang="ts">
	import { Input } from 'flowbite-svelte';

	export let suggestions: string[] = [];
	export let value = '';
</script>

<Input bind:value on:change  />
<div>
	{#each suggestions as suggestion}
		<div>{suggestion}</div>
	{/each}
</div>
