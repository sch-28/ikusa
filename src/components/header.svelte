<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	$: is_selected = (url: string) => {
		return $page.route.id?.includes(url);
	};
</script>

<header class="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
	<h1 class="text-3xl font-bold">Ikusa</h1>
	<div class="flex gap-4">
		<button
			on:click={() => goto('/dashboard')}
			class={is_selected('dashboard') ? 'text-gold' : 'text-gold-muted'}>Dashboard</button
		>
		<button
			on:click={() => goto('/docs')}
			class={is_selected('documentation') ? 'text-gold' : 'text-gold-muted'}>Documentation</button
		>
		<button
			on:click={() => goto('/login')}
			class="bg-gold text-black rounded-lg px-2 py-1 font-bold">Log in</button
		>
	</div>
</header>
