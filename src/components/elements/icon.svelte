<script lang="ts">
	import type { Component } from '../modal/modal-store';
	export let icon: Component;
	interface $$Props {
		class?: string;
		icon: Component;
		size?: 'sm' | 'md' | 'lg';
	}
</script>

{#if icon}
	<div
		class="{$$props.size === 'sm'
			? 'w-4 h-4'
			: $$props.size === 'lg'
			? 'w-8 h-8'
			: 'w-5 h-5'} {$$props.class}"
	>
		<svelte:component this={icon} />
	</div>
{/if}
