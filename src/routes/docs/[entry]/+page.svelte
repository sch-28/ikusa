<script lang="ts">
	import { page } from '$app/stores';

	$: entry = $page.params.entry;
</script>

<p class="capitalize">{entry}</p>
