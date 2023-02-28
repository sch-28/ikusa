<script lang="ts">
	interface $$Props {
		class?: string;
		id?: string;
		required?: boolean;
		type?: string;
		value?: string | number;
		placeholder?: string;
		input?: HTMLInputElement;
		size?: 'sm' | 'md' | 'lg';
	}
	export let value: string | number = '';
	export let type: string = 'text';
	export let input: HTMLInputElement | undefined = undefined;

	const handleInput = (e: any) => {
		value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
	};
</script>

<input
	bind:this={input}
	{value}
	{type}
	placeholder={$$props.placeholder || ''}
	required={$$props.required || false}
	id={$$props.id}
	on:input={handleInput}
	on:focus
	class="{$$props.size === 'sm' ? 'py-1.5 px-2 text-xs' : $$props.size === 'lg' ? 'py-3 px-4' : 'p-2.5'}
	outline-none block disabled:cursor-not-allowed disabled:opacity-50 border focus:!border-blue-500 focus:!ring-blue-500 bg-gray-700 text-white placeholder-gray-400 border-gray-600 text-sm rounded-lg {$$props.class}"
/>
