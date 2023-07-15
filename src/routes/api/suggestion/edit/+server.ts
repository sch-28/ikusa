import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../../logic/prisma';

export type SuggestionEditBody = {
	title: string;
	content: string;
	id: string;
};

export const POST: RequestHandler = async (event) => {
	const user = event.locals.user;
	const suggestion = (await event.request.json()) as SuggestionEditBody;
	if (!suggestion || !suggestion.title || !suggestion.content || !suggestion.id) {
		return new Response('Invalid body', { status: 500 });
	}
	if (!user?.discord_data) {
		return new Response('Not logged in', { status: 500 });
	}

	const prisma_suggestion = await prisma.suggestion.findUnique({
		where: {
			id: suggestion.id
		}
	});

	if (!prisma_suggestion || prisma_suggestion.userId !== user.discord_data.id) {
		return new Response('Invalid suggestion', { status: 500 });
	}

	const new_suggestion = await prisma.suggestion
		.update({
			where: {
				id: suggestion.id
			},

			data: {
				title: suggestion.title,
				content: suggestion.content
			}
		})
		.catch((e) => {
			console.error(e);
			return new Response(JSON.stringify(e), { status: 500 });
		});

	return new Response(JSON.stringify(new_suggestion), { status: 200 });
};
