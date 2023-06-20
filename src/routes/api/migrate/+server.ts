import { generate_id } from '../../../logic/util';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../logic/prisma';
import { Log } from '../../../logic/data';
import { stringify } from 'flatted';

type MigratedWarRaw = {
	name: string;
	date: string;
	guild: string;
	logs: string[];
};
export type MigratedWar = {
	name: string;
	date: string;
	guild: string;
	logs: Log[];
};

export const POST: RequestHandler = async (event) => {
	try {
		const data: MigratedWarRaw[] = await event.request.json();
		const required_properties = ['name', 'date', 'guild', 'logs'];
		const valid = data.every((war) => required_properties.every((prop) => prop in war));

		if (!valid) {
			return new Response(JSON.stringify({ error: 'Invalid wars' }));
		}
		const wars = [];
		const request_id = generate_id();
		for (const war of data) {
			const logs_string = war.logs.join('\n');
			const results = [
				...logs_string.matchAll(/\[.*\] (\w*) (died to|has killed) (\w*) from (\w*)/g)
			];

			if (results.length > 0) {
				const logs = results.map((log) => Log.parse_log(log[0]));
				const uniqueIdentifier = generate_id();
				wars.push({
					id: uniqueIdentifier,
					request_id,
					logs: stringify(logs),
					time: new Date(),
					name: war.name,
					date: war.date,
					guild: war.guild
				});
			} else {
				return new Response(JSON.stringify({ error: 'Invalid logs found' }));
			}
		}

		await prisma.migrateStorage.createMany({
			data: wars
		});

		return new Response(request_id, {
			status: 200
		});
	} catch (e) {
		return new Response(JSON.stringify({ error: 'Invalid wars' }));
	}
};

export const GET: RequestHandler = async (event) => {
	const id = event.url.searchParams.get('id');
	if (!id) {
		return new Response(JSON.stringify({ error: 'No id provided' }));
	}
	const storage = await prisma.migrateStorage.findMany({
		where: {
			request_id: id
		}
	});
	if (!storage) {
		return new Response(JSON.stringify({ error: 'Invalid id' }));
	}

	await prisma.migrateStorage.deleteMany({
		where: {
			request_id: id
		}
	});

	return new Response(JSON.stringify(storage));
};
