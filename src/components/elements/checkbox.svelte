<script lang="ts">
	interface $$Props {
		class?: string;
		id?: string;
		name?: string;
		checked: boolean;
	}
	export let checked: boolean;
</script>

<input
	bind:checked
	type="checkbox"
	name={$$props.name}
	id={$$props.id}
	class="text-gold focus:ring-gold w-4 h-4 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 focus:ring-2 mr-2 dark:bg-gray-700 dark:border-gray-600 rounded {$$props.class}"
/>
