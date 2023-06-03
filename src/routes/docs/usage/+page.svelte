<script lang="ts">
	import { page } from '$app/stores';
</script>

<div>
	<p class="text-xl font-bold text-gold">Usage</p>
	<p>
		If you have <b>Npcap</b> installed, you can simply start the combat logger by clicking the executable.
	</p>
	<p>
		However, it is recommended to use the Command Prompt to start the combat logger, as it allows
		you to pass arguments to the program.
	</p>
	<div class="mt-4">
		<p>Following arguments are available:</p>
		<pre class="text-foreground p-4 rounded-lg">
-h, --help                    show this help message and exit
-f FILE, --file FILE          instead of sniffing for bdo packages, it will use the given *.pcap file
-o OUTPUT, --output OUTPUT    custom output file    
-r, --record, --no-record     Record all of BDO's traffic and save it to a pcap file
    </pre>
	</div>

	<div class="mt-8">
		Next: <a href="/docs/contributing" class="underline">Contributing</a>
	</div>
</div>
