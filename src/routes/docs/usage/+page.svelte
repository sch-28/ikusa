<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '../../../components/elements/icon.svelte';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
</script>

<div>
	<p class="text-xl font-bold text-gold">Usage</p>
	<p>
		If you have <a href="https://npcap.com/#download" class="underline">Npcap</a> installed, you can
		log the combat live by clicking the
		<span class="text-gold">Record</span> option.
	</p>
	<p>
		If you have recordings of previous combats you can analyze them by clicking the <span
			class="text-gold">Open</span
		>
		option. Recordings can be made with
		<a href="https://www.wireshark.org/" class="underline">Wireshark</a>.
	</p>
	<div class="mt-4">
		The logger tries to automatically find the optimal configuration for the logs. <br>
		You are required to adjust the order of the names. The logger cannot differentiate the names of the
		players & guilds. If you notice that the names are not complete or incorrect, you can adjust the
		configuration by clicking the Gear <Icon class="inline-block" icon={MdSettings} /> button.
	</div>

	<div class="mt-8">
		Next: <a href="/docs/adding-a-new-war" class="underline">Adding a war</a>
	</div>
</div>
