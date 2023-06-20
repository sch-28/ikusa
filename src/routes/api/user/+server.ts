import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../logic/prisma';
import type { User } from '../../../logic/user';

export const POST: RequestHandler = async (event) => {
	const user = event.locals.user;
	const new_user = (await event.request.json()) as User;
	if (!new_user?.discord_data || !user?.discord_data) {
		return new Response('Not logged in', { status: 500 });
	}
	if (
		!new_user ||
		!new_user.guild ||
		!new_user.name ||
		user.discord_data.id !== new_user.discord_data.id
	) {
		return new Response('Invalid body', { status: 500 });
	}
	try {
		await prisma.user.update({
			where: {
				id: new_user.discord_data.id
			},
			data: {
				name: new_user.name,
				guild: new_user.guild
			}
		});

		return new Response(null, { status: 200 });
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify(e), { status: 500 });
	}
};
