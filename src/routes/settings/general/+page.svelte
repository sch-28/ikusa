<script lang="ts">
	import { Label, Toggle } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import AutoComplete from '../../../components/elements/auto-complete.svelte';
	import { Manager } from '../../../logic/stores';
	import { User } from '../../../logic/user';
	import Select from '../../../components/elements/select.svelte';

	let form_error = '';
	let form_success = false;

	let family_name = $User.name ?? '';
	let guild_name = $User.guild ?? '';

	onMount(() => {
		family_name = $User.name ?? '';
		guild_name = $User.guild ?? '';
	});

	function save() {
		form_error = '';
		form_success = false;

		if (family_name.length === 0) {
			form_error = 'Family name is required';
			return;
		}
		if (guild_name.length === 0) {
			form_error = 'Guild name is required';
			return;
		}

		if (!$Manager.players.find((p) => p.name === family_name)) {
			form_error = 'Family name is not valid, it could not be found in your uploaded logs';
			return;
		}

		if (!$Manager.guilds.find((g) => g.name === guild_name)) {
			form_error = 'Guild name is not valid, it could not be found in your uploaded logs';
			return;
		}

		$User.name = family_name;
		$User.guild = guild_name;
		form_success = true;
	}

	let selected_region = $User.region === 'EU' ? 0 : $User.region === 'NA' ? 1 : 2;
	$: {
		if (selected_region === 0) {
			$User.region = 'EU';
		} else if (selected_region === 1) {
			$User.region = 'NA';
		} else if (selected_region === 2) {
			$User.region = 'SA';
		}
	}
</script>

<div class="flex flex-col gap-2">
	<div class="gap-2 flex flex-col">
		<p class="capitalize font-semibold text-lg text-gold">General</p>
		<div class="flex gap-2 items-center">
			<Toggle bind:checked={$User.bdo_sync} id="bdo-sync" />
			<Label class="!text-gray-400" for="bdo-sync">BDO Sync</Label>
		</div>
		<div class="flex flex-col gap-2">
			<Select
				bind:selected_value={selected_region}
				options={[
					{ name: 'EU', value: 'EU' },
					{ name: 'NA', value: 'NA' },
					{ name: 'SA', value: 'SA' }
				]}
			/>
		</div>
	</div>
	<div>
		<p class="capitalize font-semibold text-lg text-gold">User Settings</p>
		<div class="text-foreground-secondary mb-2">
			Setting your family name and guild here will allow you to get a overview of your current
			performance in the <a href="/dashboard" class="underline">Dashboard</a>.
		</div>
		<div class="flex gap-2 mb-2">
			<div>
				<Label class="mb-2 !text-gray-400" for="fam-name">Family Name</Label>
				<AutoComplete
					id="fam-name"
					items={$Manager.players.map((p) => p.name)}
					bind:value={family_name}
				/>
			</div>

			<div>
				<Label class="mb-2 !text-gray-400" for="guild-name">Guild</Label>
				<AutoComplete
					id="guild-name"
					items={$Manager.guilds.map((g) => g.name)}
					bind:value={guild_name}
				/>
			</div>
		</div>
		<div class="flex items-center gap-3">
			<button
				on:click={save}
				class="px-4 py-2 bg-gold text-black text-sm font-semibold rounded-lg hover:bg-gold/80 transition-colors"
			>
				Save
			</button>
			{#if form_error}
				<p class="text-red-500">{form_error}</p>
			{:else if form_success}
				<p class="text-green-500">Settings saved</p>
			{/if}
		</div>
	</div>
</div>
