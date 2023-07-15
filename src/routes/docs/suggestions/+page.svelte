<script lang="ts">
	import type { Prisma } from '@prisma/client';
	import LoadingCircle from '../../../components/elements/loading-circle.svelte';
	import { debounce, get_remaining_height, show_toast } from '../../../logic/util';
	import Button from '../../../components/elements/button.svelte';
	import { ModalManager } from '../../../components/modal/modal-store';
	import SuggestionForm from './suggestion-form.svelte';
	import Input from '../../../components/elements/input.svelte';
	import Select from '../../../components/elements/select.svelte';
	import Icon from '../../../components/elements/icon.svelte';
	import MdEdit from 'svelte-icons/md/MdEdit.svelte';
	import { User } from '../../../logic/user';
	import { invalidate } from '$app/navigation';
	import type { Suggestion } from './+page.server';
	import SuggestionView from './suggestion-view.svelte';
	export let data: { suggestions: Suggestion[] };
	$: ({ suggestions } = data);
	let search_string = '';
	let sorted_suggestions = suggestions;
	let selected_sort: number = 0;
	$: {
		sorted_suggestions = suggestions
			.sort((a, b) => {
				if (selected_sort === 0) {
					return b.likes - a.likes;
				} else {
					return b.time > a.time ? -1 : 1;
				}
			})
			.filter(
				(s) =>
					s.title.toLowerCase().includes(search_string.toLowerCase()) ||
					s.content.toLowerCase().includes(search_string.toLowerCase())
			);
	}

	const debounced_invalidate = debounce(() => invalidate('suggestions'), 1000);

	function add_suggestion() {
		ModalManager.open(SuggestionForm);
	}

	function edit_suggestion(suggestion: Suggestion) {
		ModalManager.open(SuggestionForm, {
			id: suggestion.id,
			title: suggestion.title,
			content: suggestion.content
		});
	}

	function like_suggestion(id: string) {
		const suggestion = suggestions.find((s) => s.id === id);
		if (!suggestion) return;

		const is_liked = $User.liked_suggestions?.includes(id);
		fetch('/api/suggestion/like', {
			method: 'POST',
			body: JSON.stringify({ liked: is_liked, id })
		}).then((res) => {
			if (res.status !== 200) {
				show_toast('Something went wrong, please try again later', 'error');
			}
			debounced_invalidate();
		});
		if (is_liked) {
			$User.liked_suggestions = $User.liked_suggestions?.filter((s) => s !== id);
			suggestion.likes -= 1;
			if (suggestion.likes < 0) suggestion.likes = 0;
		} else {
			$User.liked_suggestions = [...($User.liked_suggestions ?? []), id];
			suggestion.likes += 1;
		}
		suggestions = suggestions;
	}

	function open_suggestion(suggestion: Suggestion) {
		ModalManager.open(SuggestionView, { suggestion });
	}
</script>

<div class="flex justify-between mb-4">
	<div class="flex gap-2">
		<Select
			bind:selected_value={selected_sort}
			options={[
				{ name: 'Top Rated', value: 'top_rated' },
				{ name: 'Newest', value: 'newest' }
			]}
		/>
		<Input
			class="sm:max-w-[12rem] max-w-[8rem] self-start"
			placeholder="Search..."
			bind:value={search_string}
		/>
	</div>
	<Button on:click={add_suggestion}>Add Suggestion</Button>
</div>
<div class="flex flex-col gap-2">
	{#each sorted_suggestions as suggestion}
		<button class="flex gap-2 group" on:click={() => open_suggestion(suggestion)}>
			<div>
				<button
					class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0
					{$User.liked_suggestions?.includes(suggestion.id) ? 'bg-blue-900' : 'bg-gray-800'}
						"
					on:click={(e) => {
						e.stopPropagation();
						like_suggestion(suggestion.id);
					}}
				>
					{suggestion.likes}
				</button>
			</div>
			<div class="flex flex-col text-left">
				<span class="font-bold text-foreground"
					>{suggestion.title}
					<span class="text-gold">{suggestion.status}</span>
				</span>
				<span class="line-clamp-2 whitespace-pre">{suggestion.content}</span>
			</div>
			{#if suggestion.userId === $User.discord_data?.id}
				<button
					class="ml-auto group-hover:opacity-100 opacity-0 my-auto"
					on:click={(e) => {
						e.stopPropagation();
						edit_suggestion(suggestion);
					}}
				>
					<Icon icon={MdEdit} />
				</button>
			{/if}
		</button>
	{/each}
</div>
