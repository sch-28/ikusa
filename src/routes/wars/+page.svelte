<script>
	import Checkbox from '../../components/elements/checkbox.svelte';
	import { Manager } from '../../logic/manager';
</script>

{#each $Manager.wars as war}
	<div class="flex flex-col gap-2">
		<div class="flex gap-2">
			<div class="w-5 h-5">
				<Checkbox />
			</div>
			<div class="flex flex-col gap-1">
				<div class="text-sm font-medium">{war.name}</div>
				<div class="text-xs text-gray-500">{war.date}</div>
			</div>
		</div>
	</div>
{/each}
