import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../logic/prisma';
import type { War } from '@prisma/client';
import { generate_id } from '../../../logic/util';
import { PUBLIC_IKUSA_API } from '$env/static/public';

export const POST: RequestHandler = async (event) => {
	const user = event.locals.user;
	const war = (await event.request.json()) as Omit<War, 'userId'>;
	if (!war || !war.date || !war.data || !war.name) {
		return new Response('Invalid body', { status: 500 });
	}
	if (!user?.discord_data) {
		return new Response('Not logged in', { status: 500 });
	}
	const id = generate_id();
	try {
		await prisma.user.update({
			where: {
				id: user.discord_data.id
			},
			data: {
				wars: {
					create: {
						date: war.date,
						guild_name: war.guild_name,
						name: war.name,
						data: war.data,
						guilds: war.guilds,
						id: id,
						won: war.won
					}
				}
			}
		});

		try {
			const thumbnail_timeout = new Promise((resolve, reject) => {
				setTimeout(() => resolve('Fetch request timed out'), 100);
			});
			const fetch_promise = fetch(`${PUBLIC_IKUSA_API}/api/thumbnail`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: id
				})
			});

			await Promise.race([thumbnail_timeout, fetch_promise]);
		} catch (e) {
			console.error('Unable to create thumbnail', e);
		}

		return new Response(id, { status: 200 });
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify(e), { status: 500 });
	}
};
