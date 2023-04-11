<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import LoadingCircle from '../../../components/elements/loading-circle.svelte';

	let config = '';

	fetch('https://raw.githubusercontent.com/sch-28/combat_logger/main/config.ini')
		.then((response) => response.text())
		.then((text) => (config = text));
</script>

<div>
	<p class="text-xl font-bold text-gold">Configuration</p>
	<p>Due to the weekly game patches, a new logger config is required each week.</p>
	<p>
		Before trying to use the logger, make sure you have the latest config. You can download the
		latest config <a
			href="https://raw.githubusercontent.com/sch-28/combat_logger/main/config.ini"
			class="underline">here</a
		>
	</p>

	<div class="mt-4">
		<p>Latest Config:</p>
		{#if !config}
			<div
				class="w-8 h-8 [&_svg]:!fill-gold [&_svg]:!text-gold-800 [&_svg]:dark:!text-dark-muted mt-4"
			>
				<LoadingCircle />
			</div>
		{:else}
			<pre class="text-white p-4 rounded-lg">{config}</pre>
		{/if}
	</div>

	<p class="text-xl font-bold text-gold mt-4">Outdated Config Issue</p>
	<p>
		Bdo changes its network structure after each weekly patch. Consequently, the config needs to be
		adjusted accordingly. If the config is not updated yet, but you still need to log a fight, then
		you can record it with Wireshark. After the config has been updated, you can run the logger on
		the *.pcap file. Running the executable with an old config will not yield any results.
	</p>
	<p>
		You can also help by contributing an updated config, more information can be found <a
			href="docs/contributing"
			class="underline">here</a
		>.
	</p>

	<div class="mt-8">
		Next: <a href="/docs/configuration" class="underline">Usage</a>
	</div>
</div>
