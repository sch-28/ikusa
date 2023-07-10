import posthog from 'posthog-js';
import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_KEY, PUBLIC_POSTHOG_URL } from '$env/static/public';
import { dev } from '$app/environment';

export const load = async () => {
	if (browser && !dev) {
		posthog.init(PUBLIC_POSTHOG_KEY, { api_host: PUBLIC_POSTHOG_URL });
	}
	return;
};
