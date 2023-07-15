<script lang="ts">
	import { show_toast } from '../../../logic/util';
	import { afterUpdate } from 'svelte';
	import { invalidate } from '$app/navigation';
	import Icon from '../../../components/elements/icon.svelte';
	import { ModalManager } from '../../../components/modal/modal-store';
	import { Label } from 'flowbite-svelte';
	import Input from '../../../components/elements/input.svelte';
	import Button from '../../../components/elements/button.svelte';
	import Textarea from '../../../components/elements/textarea.svelte';
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';

	function close() {
		ModalManager.close();
	}

	let form: HTMLFormElement;
	let form_validity = false;

	export let title = '';
	export let content = '';
	export let id: string | undefined = undefined;

	let loading = false;

	afterUpdate(() => {
		form_validity = form?.checkValidity() ?? false;
	});

	function create_suggestion() {
		if (!form_validity || loading) return;
		loading = true;
		fetch('/api/suggestion/create', {
			method: 'POST',
			body: JSON.stringify({
				title,
				content
			})
		}).then(async (res) => {
			if (res.status !== 200) {
				show_toast('Something went wrong, please try again later', 'error');
			}
			await invalidate('suggestions');
			close();
		});
	}

	function edit_suggestion() {
		if (!form_validity || loading) return;
		loading = true;
		fetch('/api/suggestion/edit', {
			method: 'POST',
			body: JSON.stringify({
				title,
				content,
				id
			})
		}).then(async (res) => {
			if (res.status !== 200) {
				show_toast('Something went wrong, please try again later', 'error');
			}
			await invalidate('suggestions');
			close();
		});
	}

	async function delete_suggestion() {
		if (!id || loading) return;
		loading = true;
		await fetch(`/api/suggestion/delete/${id}`, {
			method: 'DELETE'
		}).catch(() => {
			show_toast('Something went wrong, please try again later', 'error');
		});
		await invalidate('suggestions');
		close();
	}
</script>

<div class="flex flex-col w-80">
	<div class="flex justify-between items-center text-center mb-4">
		<h1 class="text-lg font-bold flex items-baseline">
			{id ? 'Edit Suggestion' : 'Create Suggestion'}
		</h1>
		{#if id}
			<button on:click={delete_suggestion} class="ml-auto">
				<Icon icon={MdDelete} class="self-center text-red-500" />
			</button>
		{/if}
	</div>
	<form class="flex flex-col gap-4" action="" bind:this={form}>
		<div>
			<Label class="mb-2 !text-gray-400" for="title">Title</Label>
			<Input
				class="w-full"
				type="text"
				placeholder="Enter suggestion title"
				id="title"
				required
				bind:value={title}
			/>
		</div>
		<div>
			<Label class="mb-2 !text-gray-400" for="content">Content</Label>
			<Textarea
				class="w-full"
				placeholder="Enter suggestion"
				id="content"
				required
				rows={5}
				bind:value={content}
			/>
		</div>
		<Button
			disabled={!form_validity}
			on:click={() => (id ? edit_suggestion() : create_suggestion())}
			{loading}>Submit</Button
		>
	</form>
</div>
