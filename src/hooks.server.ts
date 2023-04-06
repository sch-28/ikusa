import { DISCORD_API_URL } from '$env/static/private';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { prisma } from './logic/prisma';
import type { User } from './logic/user';
import { refresh_discord_token } from './logic/refresh';

async function set_session(
	request: {
		event: RequestEvent<Partial<Record<string, string>>>;
	},
	user: User
): Promise<User | undefined> {
	if (!user.discord_data) return;
	const prisma_user = await prisma.user.upsert({
		where: { id: user.discord_data.id },
		update: {},
		create: {
			id: user.discord_data.id,
			discriminator: user.discord_data.discriminator,
			username: user.discord_data.username,
			name: user.name ?? ''
		},
		include: {
			wars: {}
		}
	});

	return {
		discord_data: {
			discriminator: user.discord_data.discriminator,
			id: user.discord_data.id,
			username: user.discord_data.username
		},
		name: user.name,
		wars: prisma_user.wars.map((war) => {
			return {
				won: war.won,
				name: war.name,
				date: war.date,
				logs: [],
				guild_name: war.guild_name,
				unique_id: war.id
			};
		})
	};
}

export const handle: Handle = async (request) => {
	const cookies = request.event.cookies;

	const refresh_token = cookies.get('refresh_token');
	const access_token = cookies.get('access_token');

	let new_cookies = '';

	if (refresh_token && !access_token) {
		//const refresh_request =await fetch(`${HOST_ADDRESS}/discord/refresh?code=${refresh_token}`);
		const refresh_request = await refresh_discord_token(refresh_token);
		if ('error' in refresh_request) {
			const response = await request.resolve(request.event);
			return response;
		}

		const discord_response = await refresh_request.json();

		if (discord_response.access_token) {
			const discord_request = await fetch(`${DISCORD_API_URL}/users/@me`, {
				headers: { Authorization: `Bearer ${discord_response.access_token}` }
			});
			new_cookies = refresh_request.headers.get('Set-Cookie') ?? '';

			// returns a discord user if JWT was valid
			const response = await discord_request.json();

			if (response.id) {
				request.event.locals.user = await set_session(request, response);
			}
		}
	} else if (access_token) {
		const discord_request = await fetch(`${DISCORD_API_URL}/users/@me`, {
			headers: { Authorization: `Bearer ${access_token}` }
		});

		const response = await discord_request.json();
		if (response.id) {
			request.event.locals.user = await set_session(request, response);
		}
	}

	const response = await request.resolve(request.event);

	if (new_cookies.length > 0) {
		response.headers.set('Set-Cookie', new_cookies);
		response.headers.set('etag', '');
	}

	return response;
};
