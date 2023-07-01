<script lang="ts">
	import { classes } from '../../logic/bdo-api/classes';

	export let bdo_class: (typeof classes)[number] | undefined;
	export let width: number;

	$: icon_offset = [
		-1.98 + 'rem',
		-((5.5 / 3) * (bdo_class ? classes.indexOf(bdo_class) : 0) + 0.3) + 'rem'
	].join(' ');

	let container: HTMLDivElement;
</script>

{#if bdo_class}
	<div
		bind:this={container}
		title={bdo_class}
		class="character-name flex w-full items-center {width <= 50 && 'justify-center'} h-[17.5px]"
		style="--offset: {icon_offset};"
	>
		<span class="min-w-0 truncate {width <= 50 && 'hidden'}">{bdo_class}</span>
	</div>
{/if}

<style>
	.character-name::before {
		background-image: url(https://s1.pearlcdn.com/NAEU/contents/img/common/character/icn_class_symbol_spr.svg);
		background-repeat: no-repeat;
		background-position: var(--offset);
		background-size: 5.5rem auto;
		content: '';
		height: 1.5rem;
		margin-right: 0.25rem;
		opacity: 0.8;
		width: 1.5rem;
		display: block;
		flex-shrink: 0;
	}
</style>
