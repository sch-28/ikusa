<script lang="ts">
	import type { Component } from '../modal/modal-store';
	export let element: Component;
	export let width: number;
	interface $$Props {
		element: Component;
		width: number;
	}
</script>

{#if element}
	<svelte:component this={element} {width} />
{/if}
