import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../logic/prisma';
import type { WarJSON } from '../../../logic/data';

export const POST: RequestHandler = async (event) => {
	const user = event.locals.user;
	const war = (await event.request.json()) as WarJSON;
	if (!war || !war.date || !war.logs || !war.name) {
		return new Response('Invalid body', { status: 500 });
	}
	if (!user?.discord_data) {
		return new Response('Not logged in', { status: 500 });
	}
	try {
		const prisma_war = await prisma.user.update({
			where: {
				id: user.discord_data.id
			},
			data: {
				wars: {
					create: {
						date: war.date,
						guild_name: war.guild_name,
						name: war.name,
						data: war.logs.map((l) => l.player_one).join('\n'),
						guilds: war.guild_name,
						id: war.unique_id,
						won: war.won
					}
				}
			}
		});

		return new Response(null, { status: 200 });
	} catch (e) {
		return new Response(JSON.stringify(e), { status: 500 });
	}
};
