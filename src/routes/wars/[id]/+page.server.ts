import type { PageServerLoad } from './$types';
import { prisma } from '../../../logic/prisma';
import { supabase } from '../../../logic/supabase';

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
		const { data: supabase_data } = supabase.storage
			.from('war-thumbnails')
			.getPublicUrl(`${prisma_war.id}.png`);

		return {
			war: prisma_war.data,
			subtitle: prisma_war.date,
			title: prisma_war.name,
			description: `A war between ${prisma_war.guild_name} and ${prisma_war.guilds} on ${prisma_war.date}.`,
			/* \n
				Top guild: ${top_guild?.guild.name ?? 'None'}
				Top player: ${top_player?.player.name ?? 'None'}
				Duration: ${war?.duration ?? '0'} minutes
				Won: ${war?.won ?? 'Unknown'} */

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
