<script lang="ts">
	import { Button } from 'flowbite-svelte';
	interface $$Props {
		class?: string;
		id?: string;
		color?: 'primary' | 'secondary';
	}
</script>

<Button
	on:click
	id={$$props.id}
	btnClass="
	{$$props.color === 'primary' || (!$$props.color && 'bg-gold-300 focus:ring-gold-400 text-black')}
	{$$props.color === 'secondary' && 'bg-black  focus:ring-gray-400 border border-gold'}
	text-center font-medium focus:ring-4 focus:outline-none flex items-center justify-center px-5 py-2.5 text-sm rounded-lg {$$props.class} h-10"
>
	<slot />
</Button>
