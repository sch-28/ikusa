<script lang="ts">
	import DownloadLogger from './download-logger.svelte';
</script>

<div class="flex flex-col sm:flex-row justify-center items-center gap-12">
	<div class="sm:w-5/12 flex flex-col text-center items-center justify-center">
		<span class="font-bold text-gold text-lg">Easy to Use</span>
		Download the Ikusa Logger and keep it running in the background while you play. The logger will automatically
		detect all kill logs. Then, directly upload your logs to Ikusa to analyze them.
		<DownloadLogger class="mt-10" />
	</div>
	<div class="relative items-center justify-center">
		<img
			src="logger.jpg"
			class="border-2 border-foreground-secondary/50 rounded-lg shadow-lg"
			alt="Ikusa Logger"
		/>
	</div>
</div>
