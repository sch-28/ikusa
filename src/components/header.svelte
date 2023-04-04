<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	$: is_selected = (url: string) => {
		return $page.route.id?.includes(url);
	};
</script>

<header class="flex items-center justify-between py-4 ">
	<div class="flex gap-2 items-end">
		<a class="text-3xl font-bold mr-2" href="/">Ikusa</a>
		<a
			href="/wars"
			class={is_selected('wars') ? 'text-gold' : 'text-gold-muted hover:text-gold'}>Wars</a
		>
		<a
			href="/players"
			class={is_selected('players') ? 'text-gold' : 'text-gold-muted hover:text-gold'}
			>Players</a
		>
		<a
			href="/guilds"
			class={is_selected('guilds') ? 'text-gold' : 'text-gold-muted hover:text-gold'}
			>Guilds</a
		>
	</div>
	<div class="flex gap-4 items-end h-[2.25rem]">
		<a
			href="/docs"
			class={is_selected('documentation') ? 'text-gold' : 'text-gold-muted hover:text-gold'}
			>Documentation</a
		>
		<a href="/login" class="bg-gold text-black rounded-lg px-2 py-1 font-bold">Log in</a>
	</div>
</header>
