<script lang="ts">
	import { Dropzone, Label, Toggle } from 'flowbite-svelte';
	import { generate_id, show_toast } from '../../../logic/util';
	import Button from '../../elements/button.svelte';
	import Input from '../../elements/input.svelte';
	import Icon from '../../elements/icon.svelte';
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	import MdArrowBack from 'svelte-icons/md/MdArrowBack.svelte';
	import GiBroadsword from 'svelte-icons/gi/GiBroadsword.svelte';
	import GiSkullCrack from 'svelte-icons/gi/GiSkullCrack.svelte';
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import Autocomplete from '../../elements/auto-complete.svelte';
	import { ModalManager } from '../modal-store';
	import { afterUpdate, onMount } from 'svelte';
	import { Manager } from '../../../logic/stores';
	import WarList from '../../war-list.svelte';
	import { Log, type WarJSON, type WarType } from '../../../logic/data';

	let war_name: string = '';
	let war_date: string = '';
	let war_logs: Log[] = [];
	let war_won: boolean = false;

	let wars: WarJSON[] = [];
	let wars_guild_name: string = $Manager.user.guild ?? '';
	let setted_wars_guild_name: boolean = false;

	let states = ['upload', 'edit', 'logs', 'multi'] as const;
	let state: (typeof states)[number] = 'edit';
	export let war: WarType | undefined = undefined;

	$: {
		war;
		set_state();
	}

	$: setted_wars_guild_name && set_wars_guild_name();

	onMount(() => {
		wars_guild_name = $Manager.user.guild ?? '';
		if (war_guild_name.length == 0) war_guild_name = $Manager.user.guild ?? '';
	});

	function set_wars_guild_name() {
		if (wars_guild_name) {
			wars.map((w) => (w.guild_name = wars_guild_name));
		}
	}

	function set_state() {
		if (war) {
			state = 'edit';
			war_date = war.date;
			war_name = war.name;
			war_won = war.won;
			war_guild_name = war.guild_name;
			if (war.id) {
				war_logs = Log.parse_logs(war.logs);
			} else {
				war_logs = war.logs as Log[];
			}
		} else if (wars && wars.length > 0) {
			state = 'multi';
		} else {
			state = 'upload';
		}
	}

	let files: FileList | undefined = undefined;

	$: files && check_files();

	let war_guild_name: string = $Manager.user.guild ?? '';
	let war_guild_name_suggestions: string[] = [];
	$: war_guild_name_suggestions = $Manager.guilds
		.map((guild) => {
			return guild.name;
		})
		.filter((name) => name.toLowerCase().includes(war_guild_name?.toLowerCase()));

	let form_validity: boolean = false;
	let form: HTMLFormElement;
	let form_error: string = '';

	async function check_files() {
		if (files && files.length > 0) {
			const results = await Promise.all(Array.from(files).map((f) => load_data(f))).catch((e) =>
				show_toast(e.message, 'error')
			);

			if (results && results.length > 1) {
				state = 'multi';

				wars = results.map((logs, index) => {
					return {
						guild_name: wars_guild_name,
						name: files?.[index].name.split('.')[0] ?? '',
						date: new Date().toISOString().split('T')[0],
						won: false,
						logs: logs,
						unique_id: generate_id(),
					};
				});
			} else if (results && results.length === 1) {
				state = 'edit';
				war_logs = results[0];
				war_name = files[0].name.split('.')[0];
				war_date = new Date().toISOString().split('T')[0];
			}
		}
	}

	function handle_drop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		files = event.dataTransfer?.files;
	}

	$: multi_error = wars.some((war) => {
		return $Manager.wars.find((w) => w.id === war.date + war.name);
	});

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
		if (state === 'edit' && war === undefined) {
			reset();
		} else if (state === 'edit' && wars.length > 0) {
			state = 'multi';
			war = undefined;
		} else if (state === 'multi') {
			if (setted_wars_guild_name) {
				setted_wars_guild_name = false;
			} else {
				reset();
			}
		} else if (state === 'logs') {
			state = 'edit';
		}
	}

	function reset() {
		war_name = '';
		war_date = '';
		war_logs = [];
		war_won = false;
		war_guild_name = '';
		setted_wars_guild_name = false;
		wars = [];
		war = undefined;
		files = undefined;
		state = 'upload';
	}

	function remove_log(log: Log) {
		const index = war_logs.indexOf(log);
		war_logs.splice(index, 1);
		war_logs = war_logs;
	}

	async function save_wars() {
		if (wars.length > 0) {
			close();
			await $Manager.add_wars(wars);
		}
	}

	async function save_war() {
		let result: WarType | undefined = undefined;

		if (war) {
			if (war.id) {
				result = await $Manager.update_war(war, {
					guild_name: war_guild_name,
					name: war_name,
					date: war_date,
					won: war_won,
					logs: war_logs
				});
			} else if (!war.id) {
				wars = wars.map((w) => {
					if (w === war) {
						return {
							...w,
							guild_name: war_guild_name,
							name: war_name,
							date: war_date,
							won: war_won,
							logs: war_logs
						};
					}
					return w;
				});
				war = undefined;
				return;
			}

			if (result) show_toast('War updated successfully', 'success');
		} else {
			result = await $Manager.add_war({
				guild_name: war_guild_name,
				name: war_name,
				date: war_date,
				won: war_won,
				logs: war_logs
			});

			if (result) show_toast('War added successfully', 'success');
		}

		if (result) {
			state = 'upload';
			files = undefined;
			war_name = '';
			war_date = '';
			war_logs = [];
			war_won = false;
		} else {
			show_toast(form_error, 'error');
		}

		close();
	}

	function delete_war() {
		if (war) {
			if (war.id) {
				$Manager.delete_war(war);
				close();
			} else {
				wars = wars.filter((w) => w !== war);
				if (wars.length === 0) return reset();
				war = undefined;
				state = 'multi';
			}
		}
	}

	function close() {
		war_guild_name_suggestions = [];
		ModalManager.close();
	}

	afterUpdate(() => {
		const valid_war =
			$Manager.is_valid_war(war_date, war_name) ||
			(war !== undefined && war.name === war_name && wars.length === 0);
		form_validity = valid_war && form && form.checkValidity();

		if (!valid_war) {
			form_error = 'War already exists';
		} else if (valid_war && !form_validity) {
			form_error = 'Fill out all inputs';
		} else {
			form_error = '';
		}
	});
</script>

<div class="flex flex-col sm:w-[475px] w-80">
	<div class="flex justify-between items-center text-center mb-4">
		<button
			class="text-lg font-bold flex items-baseline gap-1 {state !== 'upload'
				? 'cursor-pointer'
				: 'cursor-default'}"
			on:click={go_back}
		>
			{#if state !== 'upload' && (state !== 'edit' || war === undefined || wars.length > 0)}
				<Icon icon={MdArrowBack} class="self-center" />
			{/if}
			<span class="shrink-0">Add War /</span><span class="text-sm"> {state}</span>

			{#if war !== undefined}
				<span class="text-sm truncate mr-2">{war.name}</span>
			{/if}
		</button>
		{#if state === 'edit' && war !== undefined}
			<button on:click={delete_war} class="ml-auto">
				<Icon icon={MdDelete} class="self-center text-red-500" />
			</button>
		{/if}
	</div>
	{#if state === 'upload'}
		<Dropzone
			bind:files
			on:drop={handle_drop}
			on:dragover={(event) => event.preventDefault()}
			multiple
			id="dropzone"
			defaultClass="h-[264px] flex flex-col justify-center items-center w-full bg-black rounded-lg cursor-pointer"
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
		<form class="h-[264px] w-full" action="" bind:this={form}>
			<div class="grid grid-cols-2 gap-2">
				<div>
					<Label class="mb-2" for="name">Name</Label>
					<Input
						class="w-full"
						type="text"
						placeholder="Enter war name"
						id="name"
						required
						bind:value={war_name}
					/>
				</div>
				<div>
					<Label class="mb-2" for="date">Date</Label>
					<Input class="w-full" type="date" id="date" required bind:value={war_date} />
				</div>
				<div>
					<Label class="mb-2" for="guild">Guild</Label>
					<Autocomplete
						input_class="w-full"
						bind:value={war_guild_name}
						items={$Manager.guilds.map((g) => g.name)}
						required
					/>
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
			<div class="flex gap-2 mt-4 items-center">
				<Button on:click={save_war} disabled={!form_validity}>{war ? 'Update' : 'Add'}</Button>
				<Button color="secondary" on:click={close}>Cancel</Button>
				<p class="text-red-500">{form_error}</p>
			</div>
		</form>
	{:else if state === 'multi'}
		{#if setted_wars_guild_name && wars_guild_name.length > 0}
			<div class="h-[264px] w-full flex flex-col">
				<div class="h-full overflow-auto">
					<WarList
						{wars}
						on_click={(w) => {
							state = 'edit';
							war = w;
						}}
					/>
				</div>
				<div class="flex gap-2 mt-4 items-center">
					<Button on:click={save_wars} disabled={multi_error}>Add</Button>
					<Button color="secondary" on:click={close}>Cancel</Button>
					{#if multi_error}
						<p class="text-red-500">Wars with those name/date combinations already exist!</p>
					{/if}
				</div>
			</div>
		{:else}
			<div class="h-[264px] w-full flex flex-col justify-center items-center gap-2 pb-11">
				<div>
					<Label class="mb-2" for="guild">Guild Name</Label>
					<Autocomplete
						input_class="w-full"
						placeholder="Enter guild name.."
						bind:value={wars_guild_name}
						items={$Manager.guilds.map((g) => g.name)}
						required
					/>
				</div>
				<Button
					class="w-[146px]"
					on:click={() => (setted_wars_guild_name = true)}
					disabled={wars_guild_name.length === 0}>Continue</Button
				>
			</div>
		{/if}
	{:else if state === 'logs'}
		<div class="h-[264px] w-full overflow-auto">
			<VirtualList items={war_logs} let:item={log}>
				<div class="flex gap-2 items-baseline group">
					<p class="text-sm text-gray-400">{log.time}:</p>
					<p>{log.player_one}</p>
					<div class="flex justify-center items-center">
						{#if log.kill}
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
