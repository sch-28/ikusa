<script lang="ts">
	import LoadingCircle from './loading-circle.svelte';

	export let size: 'sm' | 'md' | 'lg' = 'md';
</script>

<div
	class="[&_svg]:!fill-gold [&_svg]:!text-gold-800 [&_svg]:dark:!text-dark-muted
    {size === 'sm' && 'w-6 h-6'} 
    {size === 'lg' && 'w-12 h-12'}
    {size === 'md' && 'w-8 h-8'}"
>
	<LoadingCircle />
</div>
