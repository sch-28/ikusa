<script lang="ts">
	import { Label } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import AutoComplete from '../../../components/elements/auto-complete.svelte';
	import { Manager } from '../../../logic/stores';
	import { User } from '../../../logic/user';

	let form_error = '';

	let family_name = $User.name ?? '';
	let guild_name = $User.guild ?? '';

	onMount(() => {
		family_name = $User.name ?? '';
		guild_name = $User.guild ?? '';
	});

	$: {
		family_name;
		guild_name;
		validate();
	}

	function validate() {
		if (family_name === $User.name && guild_name === $User.guild) {
			return;
		}

		if (family_name.length === 0) {
			form_error = 'Family name is required';
		}
		if (guild_name.length === 0) {
			form_error = 'Guild name is required';
		}

		if (!$Manager.players.find((p) => p.name === family_name)) {
			form_error = 'Family name is not valid, it could not be found in your uploaded logs';
		}

		if (!$Manager.guilds.find((g) => g.name === guild_name)) {
			form_error = 'Guild name is not valid, it could not be found in your uploaded logs';
		}

		$User.name = family_name;
		$User.guild = guild_name;
	}
</script>

<div>
	<p class="capitalize font-semibold text-lg text-gold">User Settings</p>
	<div class="text-foreground-secondary mb-2">
		Setting your family name and guild here will allow you to get a overview of your current
		performance in the <a href="/dashboard" class="underline">Dashboard</a>.
	</div>
	<div class="flex gap-2 mb-2">
		<div>
			<Label for="fam-name">Family Name</Label>
			<AutoComplete
				id="fam-name"
				items={$Manager.players.map((p) => p.name)}
				bind:value={family_name}
			/>
		</div>

		<div>
			<Label for="fam-name">Guild</Label>
			<AutoComplete
				id="fam-name"
				items={$Manager.guilds.map((g) => g.name)}
				bind:value={guild_name}
			/>
		</div>
	</div>
	<p class="text-red-500">{form_error}</p>
</div>
