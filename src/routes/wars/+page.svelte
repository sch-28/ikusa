<script lang="ts">
	import Icon from '../../components/elements/icon.svelte';
	import GiSkullCrack from 'svelte-icons/gi/GiSkullCrack.svelte';
	import GiCrownedSkull from 'svelte-icons/gi/GiCrownedSkull.svelte';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
	import { ModalManager } from '../../components/modal/modal-store';
	import WarForm from '../../components/modal/modals/war-form.svelte';
	import { Manager } from '../../logic/stores';
</script>

<div class="flex justify-between mb-4">
	<p>All Wars</p>
	<p>20/30</p>
</div>

<div class="flex flex-col">
	{#each $Manager.wars as war}
		<a class="flex gap-2 hover:bg-gray-700 rounded-lg p-2 cursor-pointer" href="/wars/{war.id}">
			<!-- <div class="w-5 h-5">
<Checkbox />
</div> -->
			<Icon
				icon={war.won ? GiCrownedSkull : GiSkullCrack}
				class="{war.won ? 'text-submarine-500' : 'text-red-500'} self-center"
			/>
			<div class="flex flex-col gap-1">
				<div class="text-sm font-medium">{war.name}</div>
				<div class="text-xs text-gray-500">{war.date}</div>
			</div>

			<button on:click={() => ModalManager.open(WarForm, { war: war })} class="ml-auto"
				><Icon icon={MdSettings} class="self-center " /></button
			>
		</a>
	{/each}
</div>
