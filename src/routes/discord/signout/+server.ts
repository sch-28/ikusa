import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	return new Response(null, {
		headers: {
			'set-cookie': `access_token=deleted; Path=/; Max-Age=-1,refresh_token=deleted; Path=/; Max-Age=-1`,
			Location: '/'
		},
		status: 302
	});
};
