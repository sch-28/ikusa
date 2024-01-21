<script lang="ts">
	import Icon from '../elements/icon.svelte';
	import Button from '../elements/button.svelte';
	import MdFileDownload from 'svelte-icons/md/MdFileDownload.svelte';

	interface $$Props {
		class?: string;
		is_button?: boolean;
	}

	export let is_button = true;
</script>

<span class="text-red-500">
	Due to certain circumstances, the combat logger is not available for download anymore. I am sorry
	for the inconvenience.
</span>
