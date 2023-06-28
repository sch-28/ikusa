<script lang="ts">
	interface $$Props {
		title?: string;
		class?: string;
	}
</script>

<div class="border border-dashed border-foreground rounded-lg p-2 flex flex-col {$$props.class}">
	<h2 class="font-bold text-lg">{$$props.title}</h2>

	<slot />
</div>
