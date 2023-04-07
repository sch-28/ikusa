import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = (event) => {
	return event.locals.user;
};
