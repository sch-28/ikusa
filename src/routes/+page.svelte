<script lang="ts">
	import { goto } from "$app/navigation";
	import Button from "../components/elements/button.svelte";

</script>
<div class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
	<h1 class="text-5xl font-bold">Ikusa</h1>
	<p>a BDO combat analyzer</p>
	<Button on:click={() => goto("/dashboard")}>Dashboard</Button>
</div>