import {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_REDIRECT_URI
} from '$env/static/private';

export const refresh_discord_token = async (refresh_token: string) => {
	const dataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'refresh_token',
		redirect_uri: DISCORD_REDIRECT_URI,
		refresh_token: refresh_token,
		scope: 'identify'
	};

	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});

	const response = await request.json();

	if (response.error) {
		return { error: response.error };
	}

	const access_token_expires_in = new Date(Date.now() + response.expires_in * 1000); // 7 days
	const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

	const client_response = new Response(JSON.stringify({ access_token: response.access_token }), {
		status: 200
	});
	client_response.headers.append(
		'Set-Cookie',
		`access_token=${response.access_token}; Path=/; HttpOnly; SameSite=Strict; Expires=${access_token_expires_in}}`
	);
	client_response.headers.append(
		'Set-Cookie',
		`refresh_token=${response.refresh_token}; Path=/; HttpOnly; SameSite=Strict; Expires=${refresh_token_expires_in}`
	);
	client_response.headers.append('Location', '/');

	return client_response;
};
