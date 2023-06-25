<script lang="ts">
	import { page } from '$app/stores';
	import type { War } from '../../../logic/data';
	import { Manager } from '../../../logic/stores';
	import { User } from '../../../logic/user';
	import { show_toast, redirect_and_toast, copy_to_clipboard } from '../../../logic/util';
	import Icon from '../../elements/icon.svelte';
	import Input from '../../elements/input.svelte';
	import LoadingCircle from '../../elements/loading-circle.svelte';
	import { ModalManager } from '../modal-store';
	import type { War as PrismaWar } from '@prisma/client';
	import LZString from 'lz-string';
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	import MdContentCopy from 'svelte-icons/md/MdContentCopy.svelte';
	import { stringify } from 'flatted';

	export let war: War;

	$: {
		if (war.unique_id === '') {
			share_war();
		} else {
			loading = false;
		}
	}

	$: copy_url = `${$page.url.origin}/wars/${war?.unique_id}`;

	let loading = false;

	function close() {
		ModalManager.close();
	}

	async function share_war() {
		if (!$User.discord_data) {
			show_toast('You need to login via discord to share a war', 'error');
			close();
			return;
		}
		loading = true;
		const data = LZString.compressToEncodedURIComponent(stringify(war));
		const prisma_war: Omit<PrismaWar, 'userId'> = {
			date: war.date,
			guild_name: war.guild_name,
			name: war.name,
			data: data,
			guilds: [...war.enemy_guilds]
				.sort((a, b) => b.kill_difference - a.kill_difference)
				.map((g) => g.guild.name)
				.join(', '),
			id: war.unique_id,
			won: war.won
		};
		const result = await fetch('/api/share', {
			method: 'POST',
			body: JSON.stringify(prisma_war)
		});
		if (result.status == 200) {
			const id = await result.text();
			war.unique_id = id;
			$User.wars?.push(war.to_json());
			$Manager.update_war_info(war.id, { unique_id: id });
			loading = false;
		} else {
			show_toast('Something went wrong while sharing the war', 'error');
			close();
		}
	}

	async function delete_war() {
		if (war) {
			$User.wars = $User.wars?.filter((w) => w.unique_id != war?.unique_id);
			$Manager.delete_public_war(war);
			close();
		}
	}

	async function copy() {
		copy_to_clipboard(copy_url);
	}
</script>

<div class="flex flex-col w-80">
	<div class="flex justify-between items-center text-center mb-4">
		Share: {war.name}

		{#if !loading}
			<button on:click={delete_war}>
				<Icon icon={MdDelete} class="self-center text-red-500" />
			</button>
		{/if}
	</div>
	{#if loading}
		<div
			class="w-12 h-12 [&_svg]:!fill-gold [&_svg]:!text-gold-800 [&_svg]:dark:!text-dark-muted flex items-center justify-center self-center"
		>
			<LoadingCircle />
		</div>
	{:else}
		<div class="relative w-full flex flex-col">
			<Input value={copy_url} class="pr-9 truncate" />
			<button on:click={copy} class="absolute right-2 top-1/2 -translate-y-1/2">
				<Icon icon={MdContentCopy} size="md" />
			</button>
		</div>
	{/if}
</div>
