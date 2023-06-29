import { generate_id } from '../../../logic/util';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../logic/prisma';
import { Log } from '../../../logic/data';
import { stringify } from 'flatted';

export const POST: RequestHandler = async (event) => {
	const logs_string = await event.request.text();

	const results = [...logs_string.matchAll(Log.regex_glob)];
	if (results.length > 0) {
		let logs = [];
		try {
			logs = results.map((log) => Log.parse_log(log[0]));
		} catch (e) {
			return new Response(
				JSON.stringify({
					error: 'Invalid logs' + (e as Error).message ? ': ' + (e as Error).message : ''
				})
			);
		}

		const uniqueIdentifier = generate_id();
		await prisma.uploadStorage.create({
			data: {
				id: uniqueIdentifier,
				logs: stringify(logs),
				time: new Date()
			}
		});
		return new Response(JSON.stringify({ id: uniqueIdentifier }), {
			status: 200
		});
	} else {
		return new Response(JSON.stringify({ error: 'Invalid logs' }));
	}
};

export const GET: RequestHandler = async (event) => {
	const id = event.url.searchParams.get('id');
	if (!id) {
		return new Response(JSON.stringify({ error: 'No id provided' }));
	}
	const storage = await prisma.uploadStorage.findUnique({
		where: {
			id
		}
	});
	if (!storage) {
		return new Response(JSON.stringify({ error: 'Invalid id' }));
	}

	await prisma.uploadStorage.delete({
		where: {
			id
		}
	});

	return new Response(JSON.stringify({ logs: storage.logs }));
};
