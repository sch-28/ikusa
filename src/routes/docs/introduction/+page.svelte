<script lang="ts">
	import { page } from '$app/stores';
	import { discord_invite } from '../../../components/landing/discord-invite';
	import DownloadLogger from '../../../components/landing/download-logger.svelte';
</script>

<div>
	<p class="text-xl font-bold text-gold">Introduction</p>
	<p>Ikusa helps you extract more information out of your Guild- and Nodewars.</p>
	<p>
		It is a tool that allows you to analyze your game logs and gain valuable insights into your
		combat performance.
	</p>
	<p>
		Ikusa is still under development. If you encounter any issues, please report them in the <a
			href={discord_invite}
			class="underline">Discord</a
		>.
	</p>

	<p class="text-xl font-bold text-gold mt-4">How does it work?</p>
	<p>
		I developed a logger that runs in the background and collects all combat logs of Black Desert
		Online. Uploading these logs to Ikusa allows you to analyze them. Follow the steps below to get
		started.
	</p>
	<p class="text-xl font-bold text-gold mt-4">Quick start</p>
	<ol class="list-decimal list-inside">
		<li><DownloadLogger is_button={false} /></li>
		<li><a href="https://npcap.com/#download" class="underline">Download Npcap</a></li>
		<li>Record combat logs</li>
		<li>Upload logs to Ikusa</li>
		<li>Share your logs</li>
	</ol>

	<div class="mt-8">
		Next: <a href="/docs/examples" class="underline">Examples</a>
	</div>
</div>
