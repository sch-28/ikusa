<script lang="ts">
	import { Label } from 'flowbite-svelte';
	import AutoComplete from '../../../components/elements/auto-complete.svelte';
	import { Manager } from '../../../logic/stores';
	import { User } from '../../../logic/user';
</script>

<div>
	<p class="capitalize font-semibold text-lg text-gold">Shared Wars</p>
	<ul class="list-disc list-inside">
		{#each $User.wars ?? [] as war}
			<li><a class="underline" href={`/wars/${war.unique_id}`}>{war.date}: {war.name}</a></li>
		{/each}
	</ul>
</div>
