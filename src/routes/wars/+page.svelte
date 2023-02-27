<script>
	import Checkbox from '../../components/elements/checkbox.svelte';
	import Icon from '../../components/elements/icon.svelte';
	import { Manager } from '../../logic/manager';
	import GiSkullCrack from 'svelte-icons/gi/GiSkullCrack.svelte';
	import GiCrownedSkull from 'svelte-icons/gi/GiCrownedSkull.svelte';
</script>

<div class="flex justify-between mb-4">
	<p>All Wars</p>
	<p>20/30</p>
</div>

<div class="flex flex-col">
	{#each $Manager.wars as war}
		<div class="flex gap-2 hover:bg-gray-700 rounded-lg p-2 cursor-pointer">
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
		</div>
	{/each}
</div>
