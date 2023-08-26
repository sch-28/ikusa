<script lang="ts">
	import Icon from '../elements/icon.svelte';
	import Button from '../elements/button.svelte';
	import MdFileDownload from 'svelte-icons/md/MdFileDownload.svelte';

	interface $$Props {
		class?: string;
		is_button?: boolean;
	}

	export let is_button = true;

	const href =
		'https://github.com/sch-28/ikusa_logger/releases/download/1.6.1/ikusa-logger-installer.exe';
</script>

{#if is_button}
	<Button
		class="flex gap-2 items-center justify-center leading-none {$$props.class}"
		size="lg"
		{href}
	>
		<Icon icon={MdFileDownload} size="lg" />
		Ikusa Logger
	</Button>
{:else}
	<a {href} class="underline {$$props.class}">Download Ikusa Logger</a>
{/if}
