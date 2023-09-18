<script lang="ts">
	import AutoComplete from '../../components/elements/auto-complete.svelte';

	const items = ['test'];

	function on_create(value: string) {
		/* values.push(value); */
	}
</script>

<AutoComplete is_creatable {items} {on_create} />
