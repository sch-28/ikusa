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
	<p>{$Manager.wars.length} Wars</p>
</div>

<div class="flex flex-col">
	{#each $Manager.wars as war}
		<a
			class="flex gap-2 hover:text-black text-gold rounded-lg p-2 cursor-pointer hover:bg-gold group"
			href="/wars/{war.id}"
		>
			<Icon
				icon={war.won ? GiCrownedSkull : GiSkullCrack}
				class="{war.won
					? 'text-submarine-500 group-hover:text-submarine-700'
					: 'text-red-500 group-hover:text-red-800'} self-center"
			/>
			<div class="flex flex-col gap-1">
				<div class="text-sm font-medium">{war.name}</div>
				<div class="text-xs text-gray-500 group-hover:text-gray-900">{war.date}</div>
			</div>

			<button
				on:click={(e) => {
					e.stopPropagation();
					e.preventDefault();
					ModalManager.open(WarForm, { war: war });
				}}
				class="ml-auto"><Icon icon={MdSettings} class="self-center " /></button
			>
		</a>
	{/each}
</div>
