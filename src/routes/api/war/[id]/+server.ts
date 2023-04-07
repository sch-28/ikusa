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
		const guilds: string[] = [];
		/* for (let log of war.data) {
			if (!guilds.includes(log.guild) && log.guild != '' && log.guild != '-1') {
				guilds.push(log.guild);
			}
		} */
		/* return {
			war: war,
			description: `War against: ${guilds.join(', ')}`,
			title: `${war.name}`
		}; */
		return new Response(
			JSON.stringify(
				/* {
				war: war,
				description: `War against: ${guilds.join(', ')}`,
				title: `${war.name}`
			} */ war
			),
			{ status: 200 }
		);
	}

	return new Response('Not found', { status: 404 });
};
