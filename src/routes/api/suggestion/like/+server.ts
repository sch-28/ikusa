import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../../logic/prisma';

export const POST: RequestHandler = async (event) => {
	const { id, liked } = (await event.request.json()) as { id: string; liked: boolean };

	if (!id || liked === undefined) {
		return new Response('Invalid body', { status: 500 });
	}

	if (!event.locals.user?.discord_data) {
		return new Response('Not logged in', { status: 500 });
	}

	const new_suggestion = await prisma.suggestion
		.update({
			where: {
				id: id
			},
			data: {
				liked_by: {
					[liked ? 'disconnect' : 'connect']: {
						id: event.locals.user.discord_data.id
					}
				}
			}
		})
		.catch((e) => {
			console.error(e);
			return new Response(JSON.stringify(e), { status: 500 });
		});
	return new Response(JSON.stringify(new_suggestion), { status: 200 });
};
