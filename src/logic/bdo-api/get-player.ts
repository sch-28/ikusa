import { PUBLIC_IKUSA_API } from '$env/static/public';

export type PrismaPlayer = {
	family_name: string;
	id: string;
	region: 'EU' | 'NA' | 'SA';
	characters: {
		name: string;
		class: string;
		main: boolean;
		level: number | null;
	}[];
	guild: string | null;
};

export async function get_player(name: string, region: string): Promise<PrismaPlayer | undefined> {
	try {
		const result = await fetch(PUBLIC_IKUSA_API + `/api/player?name=${name}&region=${region}`);

		if (result.status !== 200) throw new Error('Player not found');

		return await result.json();
	} catch (e) {
		console.warn(`Could not fetch player ${name} from ${region}`);
		return undefined;
	}
}
