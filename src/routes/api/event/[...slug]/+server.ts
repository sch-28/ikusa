import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	return handle(event);
};

export const GET: RequestHandler = async (event) => {
	return handle(event);
};

async function handle(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
	const { pathname } = event.url;

	// Determine target hostname based on static or dynamic ingestion
	const hostname = pathname.startsWith('/api/event/static/')
		? 'eu-assets.i.posthog.com'
		: 'eu.i.posthog.com';

	// Build external URL
	const url = new URL(event.request.url);
	url.protocol = 'https:';
	url.hostname = hostname;
	url.port = '443';
	url.pathname = pathname.replace('/api/event/', '');

	// Clone and adjust headers
	const headers = new Headers(event.request.headers);
	headers.set('Accept-Encoding', '');
	headers.set('host', hostname);

	// Proxy the request to the external host
	const response = await fetch(url.toString(), {
		method: event.request.method,
		headers,
		body: event.request.body,
		duplex: 'half'
	});

	return response;
}
