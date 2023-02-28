<script lang="ts">
	import IoMdHelp from 'svelte-icons/io/IoMdHelp.svelte';
	import { Tooltip } from 'flowbite-svelte';

	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from './icon.svelte';
	interface $$Props extends HTMLAttributes<HTMLDivElement> {
		text: string;
	}

	export let text = 'Tooltip text';
</script>

<div {...$$restProps}>
	<Icon icon={IoMdHelp} />
	<Tooltip
		style="auto"
		defaultClass="rounded-lg shadow-lg !border dark:!border-dark-bg max-w-md py-2 px-3 text-sm font-medium"
		>{text}</Tooltip
	>
</div>
