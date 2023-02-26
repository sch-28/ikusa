<script lang="ts">
	import { Dropzone, Input, Label, Select, Toggle } from 'flowbite-svelte';
	import { Log } from '../../../logic/data';
	import { show_toast } from '../../../logic/util';
	import Button from '../../elements/button.svelte';
	import Icon from '../../elements/icon.svelte';
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	import MdArrowBack from 'svelte-icons/md/MdArrowBack.svelte';
	import GiBroadsword from 'svelte-icons/gi/GiBroadsword.svelte';
	import GiSkullCrack from 'svelte-icons/gi/GiSkullCrack.svelte';
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import Autocomplete from '../../elements/auto-complete.svelte';
	import { Manager } from '../../../logic/manager';
	import { ModalManager } from '../modal-store';

	let states = ['upload', 'edit', 'logs'] as const;
	let state: (typeof states)[number] = 'upload';
	let files: FileList | undefined = undefined;

	$: files && check_files();

	let war_guild_name: string = '';
	let war_name: string = '';
	let war_date: string = '';
	let war_logs: Log[] = [];
	let war_won: boolean = false;

	async function check_files() {
		console.log(files);
		if (files && files.length > 0) {
			if (files.length > 1) {
				console.log('Multiple files not supported yet');
				return;
			}

			const results = await load_data(files[0]).catch((e) => show_toast(e.message, 'error'));

			if (results) {
				state = 'edit';
				war_logs = results;
				war_name = files[0].name;
				war_date = new Date().toISOString().split('T')[0];
			}
		}
	}

	function handle_drop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		files = event.dataTransfer?.files;
	}

	async function load_data(file: File) {
		return new Promise<Log[]>((resolve, reject) => {
			let reader = new FileReader();
			reader.onload = function (e: ProgressEvent<FileReader>) {
				const content = this.result as string;
				const results = [
					...content.matchAll(/\[.*\] (\w*) (died to|has killed) (\w*) from (\w*)/g)
				];
				if (results.length > 0) {
					const logs = results.map((log) => Log.parse_log(log[0]));
					resolve(logs);
				} else {
					return reject(new Error('Invalid File'));
				}
			};
			reader.onerror = reject;
			reader.readAsText(file);
		});
	}

	function go_back() {
		if (state === 'edit') {
			state = 'upload';
			files = undefined;
			war_name = '';
			war_date = '';
			war_logs = [];
			war_won = false;
		} else if (state === 'logs') {
			state = 'edit';
		}
	}

	function remove_log(log: Log) {
		const index = war_logs.indexOf(log);
		war_logs.splice(index, 1);
		war_logs = war_logs;
	}

	function save_war() {
		const result = $Manager.add_war({
			guild_name: war_guild_name,
			name: war_name,
			date: war_date,
			won: war_won,
			logs: war_logs
		});

		if (result) {
			show_toast('War added successfully', 'success');
			state = 'upload';
			files = undefined;
			war_name = '';
			war_date = '';
			war_logs = [];
			war_won = false;
			close();
		} else {
			show_toast('War already exists', 'error');
		}
	}

	function close() {
		ModalManager.close();
	}
</script>

<div class="flex flex-col sm:w-[475px] w-80">
	<div class="flex justify-between items-center text-center mb-4">
		<button
			class="text-lg font-bold flex items-baseline gap-1 {state !== 'upload'
				? 'cursor-pointer'
				: 'cursor-default'}"
			on:click={go_back}
		>
			{#if state !== 'upload'}
				<Icon icon={MdArrowBack} class="self-center" />
			{/if}
			Add War /<span class="text-sm"> {state}</span>
		</button>
	</div>
	{#if state === 'upload'}
		<Dropzone
			bind:files
			on:drop={handle_drop}
			on:dragover={(event) => event.preventDefault()}
			id="dropzone"
			defaultClass="h-[264px] flex flex-col justify-center items-center w-full bg-black rounded-lg border-2 border-gold border-dashed cursor-pointer"
		>
			<svg
				aria-hidden="true"
				class="mb-3 w-10 h-10 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
				/></svg
			>
			<p class="mb-2 text-sm text-gray-500 400">
				<span class="font-semibold">Click to upload</span> or drag and drop
			</p>
			<p class="text-xs text-gray-500 400">LOG files</p>
		</Dropzone>
	{:else if state === 'edit'}
		<div class="h-[264px] w-full">
			<div class="grid grid-cols-2 gap-2">
				<div>
					<Label class="mb-2" for="name">Name</Label>
					<Input
						class="input is-dark"
						type="text"
						placeholder="Enter war name"
						id="name"
						required
						bind:value={war_name}
					/>
				</div>
				<div>
					<Label class="mb-2" for="date">Date</Label>
					<Input class="input is-dark " type="date" id="date" required bind:value={war_date} />
				</div>
				<div>
					<Label class="mb-2" for="guild">Guild</Label>
					<!-- <Select value={undefined} id="guild" items={[]} /> -->
					<Autocomplete bind:value={war_guild_name} />
				</div>
				<div>
					<Label class="mb-2" for="logs">Logs</Label>
					<Button class="w-full" id="logs" on:click={() => (state = 'logs')}>View Logs</Button>
				</div>
				<div class="flex flex-col">
					<Label class="mb-2" for="won">Won</Label>
					<div class="my-auto block">
						<Toggle id="won" bind:checked={war_won} />
					</div>
				</div>
			</div>
			<div class="flex gap-2 mt-4">
				<Button on:click={save_war}>Add</Button>
				<Button color="secondary" on:click={close}>Cancel</Button>
			</div>
		</div>
	{:else if state === 'logs'}
		<div class="h-[264px] w-full overflow-auto">
			<VirtualList items={war_logs} let:item={log}>
				<div class="flex gap-2 items-baseline group">
					<p class="text-sm text-gray-400">{log.time}:</p>
					<p>{log.player_one}</p>
					<div class="flex justify-center items-center">
						{#if log.is_kill}
							<Icon icon={GiBroadsword} class="self-center text-submarine-500" />
						{:else}
							<Icon icon={GiSkullCrack} class="self-center text-red-500" />
						{/if}
					</div>
					<p>{log.player_two}</p>
					<p class="text-navy-400">[{log.guild}]</p>
					<div class="ml-auto hidden group-hover:block">
						<button on:click={() => remove_log(log)}>
							<Icon icon={MdDelete} class="self-center text-red-500" />
						</button>
					</div>
				</div>
			</VirtualList>
		</div>
	{/if}
</div>
