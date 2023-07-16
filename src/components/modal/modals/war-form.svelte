<script lang="ts">
	import { Dropzone, Label, Toggle } from 'flowbite-svelte';
	import { show_toast } from '../../../logic/util';
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
	import type { MigratedWar } from '../../../routes/api/migrate/+server';
	import { User } from '../../../logic/user';
	import { goto } from '$app/navigation';
	import { PUBLIC_POSTHOG_KEY, PUBLIC_POSTHOG_URL } from '$env/static/public';
	import posthog from 'posthog-js';
	import { dev } from '$app/environment';

	let war_name: string = '';
	let war_date: string = '';
	let war_logs: Log[] = [];
	let war_won: boolean = false;

	let wars: WarJSON[] = [];
	let wars_guild_name: string = $User.guild ?? '';
	let setted_wars_guild_name: boolean = false;

	let states = ['upload', 'edit', 'logs', 'multi'] as const;
	let state: (typeof states)[number] = 'edit';
	export let war: WarType | undefined = undefined;
	export let logs: Log[] = [];
	export let migrated_wars: MigratedWar[] = [];

	$: {
		if (war_guild_name.length > 0 && !$User.guild && war_guild_name !== $User.guild) {
			$User.guild = wars_guild_name;
		}
	}

	$: {
		war;
		set_state();
	}

	$: setted_wars_guild_name && set_wars_guild_name();

	onMount(() => {
		wars_guild_name = $User.guild ?? '';
		if (war_guild_name.length == 0) war_guild_name = $User.guild ?? '';

		if (logs.length > 0) {
			war_logs = logs;
			war_date = new Date().toISOString().split('T')[0];
			state = 'edit';
		}
		if (migrated_wars.length > 0) {
			wars = migrated_wars.map((war) => {
				return {
					guild_name: war.guild,
					name: war.name,
					date: war.date,
					won: true,
					logs: war.logs,
					unique_id: ''
				};
			});
			state = 'multi';
			setted_wars_guild_name = true;
		}
	});

	function set_wars_guild_name() {
		if (wars_guild_name && migrated_wars.length === 0) {
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

	let war_guild_name: string = $User.guild ?? '';
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
					const file_name = files?.[index].name;
					const name = file_name?.split('.').slice(0, -1).join('.') ?? '';
					let date = new Date().toISOString().split('T')[0];
					const datePattern = /^\d{4}-\d{2}-\d{2}$/;

					if (name.match(datePattern)) {
						date = name;
					}

					return {
						guild_name: wars_guild_name,
						name: name,
						date: date,
						won: false,
						logs: logs,
						unique_id: ''
					};
				});
			} else if (results && results.length === 1) {
				state = 'edit';
				war_logs = results[0];
				const file_name = files?.[0].name;
				war_name = file_name?.split('.').slice(0, -1).join('.') ?? '';
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
				try {
					const content = this.result as string;
					const results = [...content.matchAll(Log.regex_glob)];
					if (results.length > 0) {
						const logs = results.map((log) => Log.parse_log(log[0]));
						resolve(logs);
					} else {
						return reject(new Error('Invalid File'));
					}
				} catch (e) {
					return reject(
						new Error('Invalid File' + (e as Error).message ? ': ' + (e as Error).message : '')
					);
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
			send_event(wars);
			await $Manager.add_wars(wars);
		}
	}

	function send_event(new_wars: WarType[]) {
		if (dev) return;
		const events = new_wars.map((w) => ({
			event: 'war-added',
			properties: { logs: w.logs.length, distinct_id: posthog.get_distinct_id() }
		}));
		const body = {
			api_key: PUBLIC_POSTHOG_KEY,
			batch: events
		};
		fetch(`${PUBLIC_POSTHOG_URL}/batch`, {
			method: 'POST',
			body: JSON.stringify(body)
		})
			.then((r) => null)
			.catch((err) => console.error(err));
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
				result && goto(`/wars/${encodeURIComponent(result.id)}`);
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
			close();
			const war_data: WarType = {
				guild_name: war_guild_name,
				name: war_name,
				date: war_date,
				won: war_won,
				logs: war_logs,
				unique_id: ''
			};
			const new_wars = await $Manager.add_wars([war_data]);
			new_wars && send_event([war_data]);
			result = new_wars?.[0];
			result && show_toast('War added successfully', 'success');
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
				$Manager.delete_war(war).then(() => {
					show_toast('War deleted successfully', 'success');
				});
				close();
				goto('/wars', { replaceState: true });
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
			defaultClass="h-[264px] flex flex-col justify-center items-center w-full bg-background rounded-lg cursor-pointer"
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
					<Label class="mb-2 !text-gray-400" for="name">Name</Label>
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
					<Label class="mb-2 !text-gray-400" for="date">Date</Label>
					<Input class="w-full" type="date" id="date" required bind:value={war_date} />
				</div>
				<div>
					<Label class="mb-2 !text-gray-400" for="guild">Guild</Label>
					<Autocomplete
						id="guild"
						input_class="w-full"
						bind:value={war_guild_name}
						items={$Manager.guilds.map((g) => g.name)}
						required
					/>
				</div>
				<div>
					<Label class="mb-2 !text-gray-400" for="logs">Logs</Label>
					<Button class="w-full" id="logs" on:click={() => (state = 'logs')}>View Logs</Button>
				</div>
				<div class="flex flex-col">
					<Label class="mb-2 !text-gray-400" for="won">Won</Label>
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
					<Label class="mb-2 !text-gray-400" for="guild">Guild Name</Label>
					<Autocomplete
						id="guild"
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
