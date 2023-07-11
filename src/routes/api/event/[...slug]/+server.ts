import { PUBLIC_ORIGINAL_POSTHOG_URL } from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	//rediret request from /api/event/* to https://eu.posthog.com/*
	const url = new URL(event.request.url);
	url.hostname = PUBLIC_ORIGINAL_POSTHOG_URL.split('//')[1];
	url.protocol = 'https';
	url.port = '';
	url.pathname = url.pathname.replace('/api/event', '');
	event.request.headers.set('host', 'eu.posthog.com');
	const response = await fetch(url.toString(), event.request);
	return response;
};
