import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '../../../logic/prisma';
import { supabase } from '../../../logic/supabase';
import LZString from 'lz-string';
import { Log, type War } from '../../../logic/data';
import { ManagerClass } from '../../../logic/manager';
import { parse, stringify } from 'flatted';

export const load: PageServerLoad = async (event) => {
	const war_id = decodeURIComponent(event.params.id);

	//check if id includes any symbols
	if (war_id.match(/[^a-zA-Z0-9]/g)) {
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
		const war_string = LZString.decompressFromEncodedURIComponent(prisma_war.data);
		if (!war_string) return;

		let war: War | undefined = undefined;
		let is_legacy = false;

		const legacy_data = [...war_string.matchAll(Log.regex_glob)];
		if (legacy_data.length > 0) {
			is_legacy = true;
			const logs = legacy_data.map((log) => Log.parse_log(log[0]));
			const manager = new ManagerClass();
			war = manager.add_war({
				guild_name: prisma_war.guild_name,
				date: prisma_war.date,
				logs: logs,
				name: prisma_war.name,
				unique_id: prisma_war.id,
				won: prisma_war.won
			});
		} else {
			war = parse(war_string) as War;
		}

		if (!war) return;

		const { data: supabase_data } = supabase.storage
			.from('war-thumbnails')
			.getPublicUrl(`${prisma_war.id}.png`);

		const top_player = war?.local_guilds
			.flatMap((g) => g.sorted_local_players)
			.sort((a, b) => b.kills - a.kills)[0];

		const top_guild = war?.sorted_guilds[0];

		return {
			war: is_legacy ? stringify(war) : war_string,
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

	return {
		war: war_id,
		is_public: false,
		is_own: true
	};
};
