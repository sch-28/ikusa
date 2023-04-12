<script lang="ts">
	import { page } from '$app/stores';
</script>

<div>
	<p class="text-xl font-bold text-gold">Contributing</p>
	<p>
		I am always looking for people who want to contribute to the combat logger. Analyzing the weekly
		new configuration takes some time, and I am not always able to do it. If you are interested in
		helping me out, please read the following instructions.
	</p>
	<p class="mt-2">
		After the weekly maintenance, the combat logger requires an updated config. The config describes
		the structure of the combat network packets. To create a new config, you need to record some
		combat packets with Wireshark. Afterwards, you have to count the byte offsets of the fields in
		the packet. The config is a simple text file, where each line describes one field.
	</p>
	<p>If you have an updated config, feel free to create a pull request in the GitHub repository.</p>
	<p class="mt-2">
		I am open to help anyone who wants to contribute. If you need help, feel free to contact me on
		Discord at ORACLE#7672.
	</p>

	<div class="mt-8">
		Next: <a href="/docs/adding-a-new-war" class="underline">Adding a new war</a>
	</div>
</div>
