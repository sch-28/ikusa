import { DISCORD_API_URL } from '$env/static/private';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { prisma } from './logic/prisma';
import type { User } from './logic/user';
import { refresh_discord_token } from './logic/refresh';

type DiscordUser = {
	username: string;
	discriminator: string;
	avatar: string;
	id: string;
};

async function set_session(
	request: {
		event: RequestEvent<Partial<Record<string, string>>>;
	},
	user: DiscordUser
): Promise<User | undefined> {
	const prisma_user = await prisma.user.upsert({
		where: { id: user.id },
		update: {},
		create: {
			id: user.id,
			discriminator: user.discriminator,
			username: user.username,
			name: '',
			guild: ''
		},
		include: {
			wars: {}
		}
	});

	return {
		discord_data: {
			discriminator: prisma_user.discriminator,
			id: prisma_user.id,
			username: prisma_user.username
		},
		name: prisma_user.name,
		guild: prisma_user.guild,
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
	console.error('TEST', request.event);

	// Apply CORS header for API routes
	if (request.event.url.pathname.startsWith('/api/create')) {
		// Required for CORS to work
		if (request.event.request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*'
				}
			});
		}
	}
	if (request.event.url.pathname.startsWith('/api/create')) {
		response.headers.append('Access-Control-Allow-Origin', `*`);
	}

	return response;
};
