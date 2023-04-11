<script lang="ts">
	import { page } from '$app/stores';
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
	<p>
		To use the Combat Logger, you can either use the pre-compiled executable or clone the repository
		and build it yourself.
	</p>

	<ol class="mt-8 list-decimal list-inside">
		<li>
			Bundled executable <p>
				Download the latest executable from the repository's <a
					href="https://github.com/sch-28/combat_logger/releases"
					class="underline">releases</a
				>.
			</p>
		</li>
		<li>
			Building from source <p>
				Follow the instructions on the <a
					href="https://github.com/sch-28/combat_logger/#building-from-source"
					class="underline">repository</a
				>.
			</p>
		</li>
	</ol>

	<div class="mt-8">
		Next: <a href="/docs/configuration" class="underline">Configuration</a>
	</div>
</div>
