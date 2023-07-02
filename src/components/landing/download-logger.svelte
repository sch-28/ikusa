<script lang="ts">
	import Icon from '../elements/icon.svelte';
	import Button from '../elements/button.svelte';
	import MdFileDownload from 'svelte-icons/md/MdFileDownload.svelte';

	interface $$Props {
		class?: string;
	}
</script>

<Button
	class="flex gap-2 items-center justify-center leading-none {$$props.class}"
	size="lg"
	href="https://github.com/sch-28/ikusa_logger/releases/download/1.2.3/ikusa-logger-installer.exe"
>
	<Icon icon={MdFileDownload} size="lg" />
	Ikusa Logger
</Button>
