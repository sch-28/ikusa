import { error, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$root/components/prisma';

export const DELETE: RequestHandler = async (event) => {
	const user = event.locals.user;
	const request: { date: string; name: string } = await event.request.json();
	if (!request || !request.date || !request.name) {
		throw error(400, 'Bad request');
	}
	if (!user) {
		throw error(401, 'Not authorized');
	}

	const result = await prisma.war.delete({
		where: {
			date_name_userId: {
				date: request.date,
				name: request.name,
				userId: user.id
			}
		}
	});

	if (result) {
		return new Response(null);
	}

	console.error("Could not delete: ", result);
	throw error(500, 'Something went wrong');
};
