import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '../../../logic/prisma';
import { supabase } from '../../../logic/supabase';
import LZString from 'lz-string';
import { Log } from '../../../logic/data';
import { ManagerClass } from '../../../logic/manager';
import { stringify } from 'flatted';

export const load: PageServerLoad = async (event) => {
	const war_id = event.params.id;

	if (war_id.includes('-')) {
		return {
			war: war_id,
			is_public: false,
			is_own: true
		};
	}

	const prisma_war = await prisma.war.findUnique({
		where: {
			id: war_id
		}
	});
	if (prisma_war) {
		const data = LZString.decompressFromEncodedURIComponent(prisma_war.data);
		if (!data) return;
		const results = [...data.matchAll(/\[.*\] (\w*) (died to|has killed) (\w*) from (\w*)/g)];
		if (results.length > 0) {
			const logs = results.map((log) => Log.parse_log(log[0]));
			const manager = new ManagerClass();
			const war = manager.add_war({
				guild_name: prisma_war.guild_name,
				date: prisma_war.date,
				logs: logs,
				name: prisma_war.name,
				unique_id: prisma_war.id,
				won: prisma_war.won
			});
			const { data: supabase_data } = supabase.storage
				.from('war-thumbnails')
				.getPublicUrl(`${prisma_war.id}.png`);

			const top_player = war?.local_guilds
				.flatMap((g) => g.sorted_local_players)
				.sort((a, b) => b.kills - a.kills)[0];

			const top_guild = war?.sorted_guilds[0];

			return {
				war: stringify(war),
				subtitle: war?.formatted_date ?? prisma_war.date,
				title: prisma_war.name,
				description: `A war between ${prisma_war.guild_name} and ${prisma_war.guilds} on ${
					prisma_war.date
				}.\n
				Top guild: ${top_guild?.guild.name ?? 'None'}
				Top player: ${top_player?.player.name ?? 'None'}
				Duration: ${war?.duration ?? '0'} minutes
				Won: ${war?.won ?? 'Unknown'}`,

				image: supabase_data.publicUrl,
				is_public: true,
				is_own: prisma_war.userId === event.locals.user?.discord_data?.id
			};
		}
	}

	return {
		war: war_id,
		is_public: false,
		is_own: true
	};
};
