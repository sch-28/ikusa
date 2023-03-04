<script lang="ts">
	import GiSkullCrack from 'svelte-icons/gi/GiSkullCrack.svelte';
	import GiCrownedSkull from 'svelte-icons/gi/GiCrownedSkull.svelte';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
	import Icon from './elements/icon.svelte';
	import { ModalManager } from './modal/modal-store';
	import WarForm from './modal/modals/war-form.svelte';
	import IoIosWarning from 'svelte-icons/io/IoIosWarning.svelte';
	import type { WarType } from '../logic/data';
	import { Manager } from '../logic/stores';
	export let wars: WarType[] = [];
	export let editable: boolean = false;
	export let on_click: (war: WarType) => void;

	$: check_error = (war: WarType) => {
		if (war.id === undefined) {
			return $Manager.wars.find((w) => w.id === war.date + war.name);
		}
	}
</script>

{#each wars as war}
	<button
		class="flex gap-2 hover:text-black text-gold rounded-lg p-2 cursor-pointer hover:bg-gold group w-full"
		on:click={() => on_click(war)}
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

		{#if editable}
			<button
				on:click={(e) => {
					e.stopPropagation();
					e.preventDefault();
					ModalManager.open(WarForm, { war: war });
				}}
				class="ml-auto self-center"
			>
				<Icon icon={MdSettings} class="self-center" />
			</button>
		{:else if check_error(war)}
			<Icon icon={IoIosWarning} class="self-center text-red-500 ml-auto" />
		{/if}
	</button>
{/each}
