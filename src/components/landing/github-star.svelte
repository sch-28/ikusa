<script lang="ts">
	import TiStarOutline from 'svelte-icons/ti/TiStarOutline.svelte';
	import Icon from '../elements/icon.svelte';
</script>

<a
	class="flex items-center justify-center border border-foreground-secondary rounded-lg px-2 py-1 text-xs font-medium h-8 hover:bg-foreground hover:text-black"
	href="https://github.com/sch-28/ikusa"
	data-color-scheme="no-preference: light; light: dark; dark: dark;"
	data-icon="octicon-star"
	data-show-count="true"
	aria-label="Star sch-28/ikusa on GitHub"
>
	<Icon icon={TiStarOutline} class="w-5 h-5 sm:mr-1" />
	<span class="sm:block hidden">Star</span>
</a>
