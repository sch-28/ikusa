<script lang="ts">
	import DownloadLogger from '../../../components/landing/download-logger.svelte';
</script>

<div>
	<p class="text-xl font-bold text-gold">Prerequisites</p>
	<p>You will need to download and install Npcap. It is used to sniff the game's packages.</p>
	<p>
		<a href="https://npcap.com/#download" class="underline">Download Npcap</a>
	</p>
	<p>
		Alternatively, you can use Wireshark to sniff the packages, and just use the combat logger to
		analyze the recording. You can download Wireshark <a
			href="https://www.wireshark.org/download.html"
			class="underline">here</a
		>.
	</p>

	<p class="text-xl font-bold text-gold mt-4">Installation</p>
	<p class="mb-2">Download the installer</p>
	<DownloadLogger class="w-fit" />

	<div class="mt-8">
		Next: <a href="/docs/usage" class="underline">Usage</a>
	</div>
</div>
