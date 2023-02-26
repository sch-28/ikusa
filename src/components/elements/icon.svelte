<script lang="ts">
	import type { Component } from '../modal/modal-store';
	export let icon: Component;
	interface $$Props {
		class?: string;
		icon: Component;
	}
</script>

{#if icon}
	<div class="w-5 h-5 {$$props.class}">
		<svelte:component this={icon} />
	</div>
{/if}
