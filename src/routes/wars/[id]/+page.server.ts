import type { PageServerLoad } from './$types';
import { prisma } from '../../../logic/prisma';
import { supabase } from '../../../logic/supabase';
import LZString from 'lz-string';
import type { SharedWar } from '../../../components/modal/modals/share-war-type';
import { parse, stringify } from 'flatted';
import type { Log } from '../../../logic/data';
import { ManagerClass } from '../../../logic/manager';

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
		let result: string = prisma_war.data;
		const { data: supabase_data } = supabase.storage
			.from('war-thumbnails')
			.getPublicUrl(`${prisma_war.id}.png`);

		if (prisma_war.is_new_share) {
			const data = parse(LZString.decompressFromEncodedURIComponent(prisma_war.data)) as SharedWar;
			const manager = new ManagerClass();
			const war = manager.add_war({
				guild_name: prisma_war.guild_name,
				date: prisma_war.date,
				logs: data.logs as Log[],
				name: prisma_war.name,
				unique_id: prisma_war.id,
				won: prisma_war.won
			});

			war?.local_players.forEach((p) => {
				const mapping = data.class_mapping.find((m) => m.name === p.player.name);
				p.character_class = mapping?.class_name;
				p.character_name = mapping?.char_name;
			});

			result = stringify(war);
		}

		return {
			war: result,
			subtitle: prisma_war.date,
			title: prisma_war.name,
			description: `A war recorded by ${prisma_war.guild_name}.`,
			image: supabase_data.publicUrl,
			is_public: true,
			is_own: prisma_war.userId === event.locals.user?.discord_data?.id,
			is_new_share: prisma_war.is_new_share
		};
	}

	return {
		war: war_id,
		is_public: false,
		is_own: true
	};
};
