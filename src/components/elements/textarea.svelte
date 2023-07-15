<script lang="ts">
	interface $$Props {
		class?: string;
		id?: string;
		required?: boolean;
		value?: string | number;
		placeholder?: string;
		input?: HTMLTextAreaElement;
		size?: 'sm' | 'md' | 'lg';
		rows?: number;
	}
	export let value: string | number = '';
	export let input: HTMLTextAreaElement | undefined = undefined;
	export let rows = 3;

	const handleInput = (e: any) => {
		value = e.target.value;
	};
</script>

<textarea
	bind:this={input}
	{value}
	placeholder={$$props.placeholder || ''}
	required={$$props.required || false}
	id={$$props.id}
	{rows}
	on:input={handleInput}
	on:focus
	class="{$$props.size === 'sm'
		? 'py-1.5 px-2 text-xs'
		: $$props.size === 'lg'
		? 'py-3 px-4'
		: 'p-2.5'}
	outline-none block disabled:cursor-not-allowed disabled:opacity-50 border focus:!border-foreground-secondary focus:!ring-foreborder-foreground-secondary bg-background text-white placeholder-gray-400 border-foreground-secondary text-sm rounded-lg {$$props.class}"
/>
