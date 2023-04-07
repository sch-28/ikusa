<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from './elements/icon.svelte';
	import IoMdHelp from 'svelte-icons/io/IoMdHelp.svelte';
	import { User } from '../logic/user';

	$: is_selected = (url: string) => {
		return $page.route.id?.includes(url);
	};
</script>

<header class="flex items-center justify-between py-4 ">
	<div class="flex gap-2 items-end">
		<a class="text-3xl font-bold mr-2" href="/">Ikusa</a>
		<a href="/wars" class={is_selected('wars') ? 'text-gold' : 'text-gold-muted hover:text-gold'}
			>Wars</a
		>
		<a
			href="/players"
			class={is_selected('players') ? 'text-gold' : 'text-gold-muted hover:text-gold'}>Players</a
		>
		<a
			href="/guilds"
			class={is_selected('guilds') ? 'text-gold' : 'text-gold-muted hover:text-gold'}>Guilds</a
		>
	</div>
	<div class="flex gap-3 items-end h-[2.25rem]">
		<a
			href="/docs"
			class="{is_selected('docs')
				? 'text-gold'
				: 'text-gold-muted hover:text-gold'} self-center mt-2"><Icon icon={IoMdHelp} /></a
		>
		<a
			href={$User.discord_data ? '/dashboard' : '/discord/auth'}
			class="bg-gold text-black rounded-lg px-2 py-1 font-bold"
			>{$User.discord_data ? $User.discord_data.username : 'Log in'}</a
		>
	</div>
</header>
