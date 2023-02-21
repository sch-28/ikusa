<script lang="ts">
	import '../app.css';
	import Header from '../components/header.svelte';
</script>

<div class="px-4 max-w-7xl mx-auto">
	<Header />
	<div class="mt-16">
		<slot />
	</div>
</div>
