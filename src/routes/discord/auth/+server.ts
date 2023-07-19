import { DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

const DISCORD_ENDPOINT = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
	DISCORD_REDIRECT_URI
)}&response_type=code&scope=identify`;

export const GET: RequestHandler = async (event) => {
	const url = event.url.searchParams.get('url');

	const response = new Response(null, { status: 302, headers: { Location: DISCORD_ENDPOINT } });
	url &&
		response.headers.set(
			'Set-Cookie',
			`login_redirect=${url}; Path=/; HttpOnly; SameSite=Lax; Expires=${new Date(
				Date.now() + 60 * 1000 // 1 minute
			)}
		`
		);

	return response;
};
