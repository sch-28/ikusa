import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../logic/prisma';
import type { War } from '@prisma/client';
export const POST: RequestHandler = async (event) => {
	const user = event.locals.user;
	const war = (await event.request.json()) as Omit<War, 'userId'>;
	if (!war || !war.date || !war.data || !war.name) {
		return new Response('Invalid body', { status: 500 });
	}
	if (!user?.discord_data) {
		return new Response('Not logged in', { status: 500 });
	}
	try {
		await prisma.user.update({
			where: {
				id: user.discord_data.id
			},
			data: {
				wars: {
					create: {
						date: war.date,
						guild_name: war.guild_name,
						name: war.name,
						data: war.data,
						guilds: war.guilds,
						id: war.id,
						won: war.won
					}
				}
			}
		});

		const origin = event.url.origin;
		fetch(`${origin}/api/thumbnail`, {
			method: 'POST',
			body: JSON.stringify({
				url: `${origin}/wars/${war.id}`,
				id: war.id
			})
		});

		return new Response(null, { status: 200 });
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify(e), { status: 500 });
	}
};
