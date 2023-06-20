import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../../logic/prisma';

export const GET: RequestHandler = async (event) => {
	const war_id = event.params.id;

	const war = await prisma.war.findUnique({
		where: {
			id: war_id
		}
	});
	if (war) {
		return new Response(JSON.stringify(war), { status: 200 });
	}

	return new Response('Not found', { status: 404 });
};
