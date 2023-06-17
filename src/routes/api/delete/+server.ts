import { error, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../logic/prisma';
import { supabase } from '../../../logic/supabase';

export const DELETE: RequestHandler = async (event) => {
	const user = event.locals.user;
	const request: { id: string } = await event.request.json();
	if (!request || !request.id) {
		throw error(400, 'Bad request');
	}
	if (!user?.discord_data) {
		throw error(401, 'Not authorized');
	}

	const war = await prisma.war.findUnique({
		where: {
			id: request.id
		}
	});

	if (!war) {
		throw error(404, 'Not found');
	}

	if (war.userId !== user.discord_data.id) {
		throw error(401, 'Not authorized');
	}

	const result = await prisma.war.delete({
		where: {
			id: request.id
		}
	});

	const { data, error: supa_error } = await supabase.storage
		.from('war-thumbnails')
		.remove([`${request.id}.png`]);
	if (supa_error) {
		console.error(error);
	}

	if (result) {
		return new Response(null);
	}

	console.error('Could not delete: ', result);
	throw error(500, 'Something went wrong');
};
