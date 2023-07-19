import {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_REDIRECT_URI
} from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const returnCode = event.url.searchParams.get('code');
	if (!returnCode) {
		return new Response(null, { headers: { Location: '/' }, status: 302 });
	}

	const dataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'authorization_code',
		redirect_uri: DISCORD_REDIRECT_URI,
		code: returnCode,
		scope: 'identify'
	};

	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});

	const response = await request.json();

	if (response.error) {
		console.log('redirect to / due error, return code: ', returnCode);
		return new Response(null, { headers: { Location: '/' }, status: 302 });
	}

	const access_token_expires_in = new Date(Date.now() + response.expires_in * 1000); // 7 days
	const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

	const client_response = new Response(null, { status: 302 });
	client_response.headers.append(
		'Set-Cookie',
		`access_token=${response.access_token}; Path=/; HttpOnly; SameSite=Lax; Expires=${access_token_expires_in}}`
	);
	client_response.headers.append(
		'Set-Cookie',
		`refresh_token=${response.refresh_token}; Path=/; HttpOnly; SameSite=Lax; Expires=${refresh_token_expires_in}`
	);

	const redirect_url = event.cookies.get('login_redirect');
	client_response.headers.append('Location', redirect_url ?? '/');

	return client_response;
};
