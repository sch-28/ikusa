<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { click_outside } from '../../logic/util';
	import Input from './input.svelte';

	interface $$Props {
		input_class?: string;
		items?: string[];
		value?: string;
		placeholder?: string;
		required?: boolean;
		id?: string;
		is_creatable?: boolean;
		on_create?: (value: string) => void;
		on_select?: (value: string) => void;
	}

	export let items: string[] = [];
	export let value = '';
	export let placeholder = '';
	export let required = false;
	export let is_creatable = false;
	export let on_create = (value: string) => {};
	export let on_select = (value: string) => {};

	let selected_suggestion = -1;
	let suggestions: { name: string; button?: HTMLButtonElement }[] = [];
	let show_suggestions: boolean = false;

	let input: HTMLInputElement;
	let input_width: string = 'auto';
	$: {
		if (input) {
			input_width = input.clientWidth.toString() + 'px';
		}
	}

	$: items && value && filter_suggestions();

	function filter_suggestions() {
		suggestions = items
			.filter(
				(item) =>
					item.toLowerCase().includes(value.toLowerCase()) && value.length > 0 && item !== value
			)
			.splice(0, 3)
			.map((item) => ({ name: item, button: undefined }));

		selected_suggestion = -1;
	}

	function handle_keydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			suggestions = [];
		} else if (event.key === 'ArrowDown') {
			if (suggestions.length > 0) {
				select_suggestion(1);
			}
		} else if (event.key === 'ArrowUp') {
			if (suggestions.length > 0) {
				select_suggestion(-1);
			}
		}
	}

	function select_suggestion(dir: -1 | 1) {
		if (suggestions.length > 0) {
			if (selected_suggestion + dir >= -2) {
				selected_suggestion += dir;
			}

			if (selected_suggestion >= suggestions.length) {
				selected_suggestion = -1;
			} else if (selected_suggestion === -2) {
				selected_suggestion = suggestions.length - 1;
			}

			if (selected_suggestion === -1) {
				input.focus();
				setTimeout(() => {
					input.setSelectionRange(value.length, value.length);
				}, 0);
			} else {
				suggestions[selected_suggestion].button?.focus();
			}
		}
	}

	$: show_dropdown =
		(suggestions.length > 0 || (value.length > 0 && is_creatable && !items.includes(value))) &&
		show_suggestions;

	onMount(() => {
		document.addEventListener('keydown', handle_keydown);
	});
	onDestroy(() => {
		document.removeEventListener('keydown', handle_keydown);
	});
</script>

<div use:click_outside on:click_outside={() => (show_suggestions = false)}>
	<Input
		id={$$props.id}
		class={$$props.input_class}
		bind:value
		on:change
		{required}
		{placeholder}
		bind:input
		on:focus={() => (show_suggestions = true)}
	/>
	<div
		class="border border-gray-600 mt-1 absolute bg-background z-50 rounded-lg overflow-hidden {!show_dropdown
			? 'hidden'
			: ''}"
		style="width: {input_width};"
	>
		{#each suggestions as suggestion}
			<button
				class="p-2 w-full text-left text-gold-muted hover:text-gold outline-none focus:bg-gold focus:text-black"
				bind:this={suggestion.button}
				on:click={() => {
					value = suggestion.name;
					show_suggestions = false;
					on_select(suggestion.name);
				}}>{suggestion.name}</button
			>
		{/each}
		{#if is_creatable && value.length > 0 && !items.includes(value)}
			<button
				class="p-2 w-full text-left text-gold-muted hover:text-gold outline-none focus:bg-gold focus:text-black"
				on:click={() => {
					on_create(value);
					show_suggestions = false;
					value = '';
				}}
			>
				Create "{value}"
			</button>
		{/if}
	</div>
</div>
