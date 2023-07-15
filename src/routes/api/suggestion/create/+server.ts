import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../../logic/prisma';

export type SuggestionCreateBody = {
	title: string;
	content: string;
};

export const POST: RequestHandler = async (event) => {
	const user = event.locals.user;
	const suggestion = (await event.request.json()) as SuggestionCreateBody;
	if (!suggestion || !suggestion.title || !suggestion.content) {
		return new Response('Invalid body', { status: 500 });
	}
	if (!user?.discord_data) {
		return new Response('Not logged in', { status: 500 });
	}

	const new_suggestion = await prisma.suggestion
		.create({
			data: {
				title: suggestion.title,
				content: suggestion.content,
				user: {
					connect: {
						id: user.discord_data.id
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
