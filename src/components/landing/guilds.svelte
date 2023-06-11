<script lang="ts">
	import Banner from './banner.svelte';
</script>

<div class="flex flex-col sm:flex-row justify-center items-center">
	<div class="relative items-center justify-center flex w-24 h-64 sm:mr-32">
		<Banner class="absolute top-1/4 left-3/4" />
		<Banner class="absolute top-1/4 right-3/4" />
		<Banner class="relative" image="ory2.png" name="ORY" />
	</div>
	<div class="sm:w-5/12 flex flex-col text-center items-center justify-center">
		<span class="font-bold text-gold text-lg">Track competing Guilds</span>
		Keep track of your and other guilds' performance and compare them to each other. See how you improve
		over time and analyze matchups. Ikusa provides you with all the tools you need to become the best.
	</div>
</div>
