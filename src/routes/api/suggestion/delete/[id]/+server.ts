import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../../../logic/prisma';

export const DELETE: RequestHandler = async (event) => {
	const id = event.params.id;
	if (!id) {
		return new Response('Invalid body', { status: 500 });
	}
	if (!event.locals.user?.discord_data) {
		return new Response('Not logged in', { status: 500 });
	}

	const prisma_suggestion = await prisma.suggestion.findUnique({
		where: {
			id: id
		}
	});

	if (!prisma_suggestion || prisma_suggestion.userId !== event.locals.user.discord_data.id) {
		return new Response('Invalid suggestion', { status: 500 });
	}

	const new_suggestion = await prisma.suggestion
		.delete({
			where: {
				id: id
			}
		})

		.catch((e) => {
			console.error(e);
			return new Response(JSON.stringify(e), { status: 500 });
		});

	return new Response(JSON.stringify(new_suggestion), { status: 200 });
};
