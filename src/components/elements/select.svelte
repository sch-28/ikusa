<script lang="ts">
	export let selected_value: number = 0;
	export let options: { name: any; value: any }[] = [];
	export let on_change: (e: Event) => void = (e) => {};
</script>

<select
	bind:value={selected_value}
	class="!w-32 p-1 rounded-lg !ring-gold truncate"
	on:change={on_change}
>
	{#each options as option, i}
		<option value={i} class="rounded-lg text-gray-800 bg-gray-300">
			{option.name}
		</option>
	{/each}
</select>

<style>
	select {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-color: #1c1c1c !important;
		border-color: rgb(255, 255, 255, 0.65);
		border-width: 1px;
		padding-top: 0.5rem;
		padding-right: 0.75rem;
		padding-bottom: 0.5rem;
		padding-left: 0.75rem;
		font-size: 1rem;
		line-height: 1.5rem;
		--tw-shadow: 0 0 #0000;
	}
</style>
