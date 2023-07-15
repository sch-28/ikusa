<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import LoadingCircle from './loading-circle.svelte';
	import LoadingIndicator from './loading-indicator.svelte';
	interface $$Props {
		class?: string;
		id?: string;
		color?: 'primary' | 'secondary';
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		loading?: boolean;
	}
</script>

<Button
	on:click
	href={$$props.href}
	disabled={$$props.disabled || $$props.loading || false}
	id={$$props.id}
	btnClass="
	{($$props.color === 'primary' || !$$props.color) &&
		`bg-gold-300 focus:ring-gold-400 text-black ${
			$$props.disabled ? '!bg-gray-700 text-gray-400 cursor-not-allowed' : 'border-gold'
		}`}
	{$$props.color === 'secondary' &&
		'bg-background  focus:ring-gray-400 border border-foreground-secondary'}
	text-center font-medium focus:ring-4 focus:outline-none flex items-center justify-center rounded-lg {$$props.class}
	{($$props.size === 'md' || !$$props.size) && 'h-10 px-5 text-sm'}
	{$$props.size === 'sm' && 'h-8 px-4 text-xs'}
	{$$props.size === 'lg' && 'h-12 px-6 text-md'}
	{$$props.loading && 'cursor-not-allowed !bg-gray-700 text-gray-400'}
	"
>
	{#if $$props.loading}
		<div class="h-full w-8 flex items-center [&_svg]:!fill-gray-400 [&_svg]:!text-gray-800">
			<LoadingIndicator size="sm" />
		</div>
	{:else}
		<slot />
	{/if}
</Button>
