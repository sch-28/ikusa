<script lang="ts">
	import { page } from '$app/stores';
	import type { HeaderColumn, Row } from '../../../components/table/table';
	import Table from '../../../components/table/table.svelte';
	import type { War } from '../../../logic/data';
	import { Manager } from '../../../logic/stores';
	import { format } from '../../../logic/util';

	const header: HeaderColumn<string>[] = [
		{ label: 'Name', width: 3, sortable: true },
		{ label: 'Kills', width: 1, sortable: true },
		{ label: 'Deaths', width: 1, sortable: true },
		{ label: 'Performance', width: 1, sortable: true },
		{ label: 'Joined', width: 1, sortable: true }
	];
	const rows: Row[] = [];

	let war: War | undefined;
	$: {
		const id = $page.params.id;
		if (id) {
			war = $Manager.get_war(id);

			if (war) {
				rows.splice(0, rows.length);
				for (const local_player of war.local_players) {
					rows.push({
						columns: [
							local_player.player.name,
							local_player.kills,
							local_player.deaths,
							format(local_player.performance),
							format(local_player.duration_percentage * 100)
						]
					});
				}
			}
		}
	}
</script>

{#if war}
	<div class="h-80">
		<Table {header} {rows} searchable />
	</div>
{/if}
