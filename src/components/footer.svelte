<script>
	import Icon from './elements/icon.svelte';
	import GoMarkGithub from 'svelte-icons/go/GoMarkGithub.svelte';
	import FaDiscord from 'svelte-icons/fa/FaDiscord.svelte';
	import { discord_invite } from './landing/discord-invite';
</script>

<div class="w-full flex justify-between mt-auto mb-4">
	<p class="hidden sm:block">Made by <b>ORACLE#7672</b></p>
	<a href="/privacy" class="absolute left-1/2 -translate-x-1/2">Privacy Policy</a>
	<div class="flex gap-2">
		<a href={discord_invite} title="Join the Discord!"><Icon icon={FaDiscord} /></a>
		<a href="https://github.com/sch-28/ikusa" title="GitHub Repository for the website"
			><Icon icon={GoMarkGithub} /></a
		>
	</div>
</div>
