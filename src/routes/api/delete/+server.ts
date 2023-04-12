import { error, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../logic/prisma';

export const DELETE: RequestHandler = async (event) => {
	const user = event.locals.user;
	const request: { id: string } = await event.request.json();
	if (!request || !request.id) {
		throw error(400, 'Bad request');
	}
	if (!user?.discord_data) {
		throw error(401, 'Not authorized');
	}

	const result = await prisma.war.delete({
		where: {
			id: request.id
		}
	});

	if (result) {
		return new Response(null);
	}

	console.error('Could not delete: ', result);
	throw error(500, 'Something went wrong');
};
