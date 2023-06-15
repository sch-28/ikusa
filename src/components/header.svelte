<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from './elements/icon.svelte';
	import IoMdHelp from 'svelte-icons/io/IoMdHelp.svelte';
	import { User } from '../logic/user';
	import { Dropdown, DropdownDivider, DropdownItem } from 'flowbite-svelte';
	import Button from './elements/button.svelte';
	import IoIosMenu from 'svelte-icons/io/IoIosMenu.svelte';
	import { click_outside } from '../logic/util';
	$: is_selected = (url: string) => {
		return $page.route.id?.includes(url);
	};

	function signout() {
		$User.discord_data = undefined;
		goto('/discord/signout');
	}

	let show_sidebar = false;
</script>

<header class="flex items-center justify-between py-4">
	<div class="flex items-center gap-2">
		<button on:click={() => (show_sidebar = !show_sidebar)}>
			<Icon class="sm:hidden block" icon={IoIosMenu} size="lg" />
		</button>
		<a class="text-3xl font-bold mr-2 text-gold" href={$User.discord_data ? '/dashboard' : '/'}
			>Ikusa</a
		>
	</div>
	<div
		class="flex gap-2 items-baseline absolute sm:static flex-col sm:flex-row top-0 bottom-0 bg-background-secondary z-10 px-4 left-0 w-44 shadow-lg rounded-r-lg sm:rounded-lg sm:w-fit sm:py-2
		{show_sidebar
			? 'translate-x-0'
			: '-translate-x-full sm:translate-x-0'} transition-all sm:transition-none duration-200"
		use:click_outside
		on:click_outside={() => (show_sidebar = false)}
	>
		<div class="flex items-center gap-2 py-4 sm:hidden">
			<button on:click={() => (show_sidebar = !show_sidebar)}>
				<Icon class="sm:hidden block" icon={IoIosMenu} size="lg" />
			</button>
			<a
				on:click={() => (show_sidebar = !show_sidebar)}
				class="text-3xl font-bold mr-2 text-gold"
				href={$User.discord_data ? '/dashboard' : '/'}>Ikusa</a
			>
		</div>
		<a
			on:click={() => (show_sidebar = !show_sidebar)}
			href="/wars"
			class={is_selected('wars')
				? 'text-foreground'
				: 'text-foreground-secondary hover:text-foreground'}>Wars</a
		>
		<a
			on:click={() => (show_sidebar = !show_sidebar)}
			href="/players"
			class={is_selected('players')
				? 'text-foreground'
				: 'text-foreground-secondary hover:text-foreground'}>Players</a
		>
		<a
			on:click={() => (show_sidebar = !show_sidebar)}
			href="/guilds"
			class={is_selected('guilds')
				? 'text-foreground'
				: 'text-foreground-secondary hover:text-foreground'}>Guilds</a
		>
	</div>
	<div class="flex gap-3 items-center h-[2.25rem]">
		<a
			href="/docs"
			class="{is_selected('docs')
				? 'text-foreground'
				: 'text-foreground-secondary hover:text-foreground'} self-center"
			><Icon icon={IoMdHelp} /></a
		>
		{#if $User.discord_data}
			<Button size="sm">{$User.discord_data.username}</Button>
			<Dropdown frameClass="!bg-background border rounded-lg">
				<DropdownItem
					href="/dashboard"
					defaultClass="font-medium py-2 px-4 text-sm text-foreground-secondary hover:text-foreground w-full text-left"
					>Dashboard</DropdownItem
				>
				<DropdownItem
					href="/settings"
					defaultClass="font-medium py-2 px-4 text-sm text-foreground-secondary hover:text-foreground w-full text-left"
					>Settings</DropdownItem
				>
				<DropdownDivider />
				<DropdownItem
					on:click={signout}
					defaultClass="font-medium py-2 px-4 text-sm text-foreground-secondary hover:text-foreground w-full text-left"
					>Logout</DropdownItem
				>
			</Dropdown>
		{:else}
			<Button size="sm" color="secondary" on:click={() => goto('/discord/auth')}>Login</Button>
		{/if}
	</div>
</header>
