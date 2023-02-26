import { browser } from '$app/environment';
import dayjs from 'dayjs';
import type { Writable } from 'svelte/store';

import { writable, get } from 'svelte/store';
import { Log, War, Player, Guild, Local_Guild, Local_Guild_Player, Event } from './data';
import type { User } from './user';

const storage = (key: string, initValue: ManagerClass): Writable<ManagerClass> => {
	const store = writable(initValue);

	if (!browser) return store;

	const storedValueStr = localStorage.getItem(key);

	if (storedValueStr != null) store.set(ManagerClass.from_json(JSON.parse(storedValueStr)));

	store.subscribe((val) => {
		if (val == null || val == undefined) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, val.get_json());
		}
	});

	window.addEventListener('storage', () => {
		const storedValueStr = localStorage.getItem(key);

		if (storedValueStr == null) return;

		const localValue = ManagerClass.from_json(JSON.parse(storedValueStr));

		// might need to implemenet compare function
		if (localValue !== get(store)) store.set(localValue);
	});

	return store;
};

export default storage;

export interface War_JSON {
	guild_name: string;
	name: string;
	date: string;
	won: boolean;
	logs: Log[];
}

export class ManagerClass {
	wars: War[];
	players: Player[];
	guilds: Guild[];
	user: User | null;

	constructor() {
		this.wars = [];
		this.players = [];
		this.guilds = [];
		this.user = null;
	}

	get sorted_players() {
		return [...this.players].sort((a, b) => b.average_performance - a.average_performance);
	}

	get sorted_guilds() {
		return [...this.guilds].sort((a, b) => b.average_kill_difference - a.average_kill_difference);
	}

	get_war(id: string) {
		return this.wars.find((war) => war.id == id);
	}

	get_player(player_name: string) {
		return this.players.find((p) => p.name === player_name);
	}

	get_guild(guild_name: string) {
		return this.guilds.find((g) => g.name === guild_name);
	}

	get_wars(sort_by: 'added' | 'date' = 'added') {
		if (sort_by == 'date') {
			return [...this.wars].sort((a, b) => (new Date(a.date) <= new Date(b.date) ? -1 : 1));
		} else {
			return this.wars;
		}
	}

	/* delete_war(id: number) {
		//TODO
		console.log(this.wars.length);
		this.wars = this.wars.filter((w) => w.id != id);
		console.log(this.wars.length);
	} */

	find_or_create_guild(name: string) {
		let guild = this.guilds.find((g) => g.name == name);

		if (!guild) {
			guild = new Guild(name);
			this.guilds.push(guild);
		}

		return guild;
	}

	find_or_create_player(name: string, guild: Guild) {
		let player = this.players.find((p) => p.name == name && p.guild == guild);

		if (!player) {
			player = new Player(name, guild);
			this.players.push(player);
			guild.players.push(player);
		}

		return player;
	}

	static from_json(json: { wars: War_JSON[] }) {
		const manager = new ManagerClass();
		for (const war of json.wars) {
			war.logs = war.logs.map(
				(l) => new Log(l.player_one, l.player_two, l.is_kill, l.guild, l.time)
			);
			manager.add_war({
				guild_name: war.guild_name,
				name: war.name,
				date: war.date,
				won: war.won,
				logs: war.logs
			});
		}
		return manager;
	}

	get_json() {
		const json_wars = [];
		for (const war of this.wars) {
			json_wars.push(war.to_json());
		}

		return JSON.stringify({ wars: json_wars });
	}

	add_war({
		guild_name,
		name,
		date,
		won,
		logs
	}: {
		guild_name: string;
		name: string;
		date: string;
		won: boolean;
		logs: Log[];
	}) {
		if (this.wars.find((war) => war.id == date + name)) {
			return null;
		}

		const events: Event[] = [];
		const guilds = new Set<Guild>();
		const players = new Set<Player>();

		for (const log of logs) {
			const guild_one = this.find_or_create_guild(guild_name);
			const guild_two = this.find_or_create_guild(log.guild);

			guilds.add(guild_one).add(guild_two);

			const player_one = this.find_or_create_player(log.player_one, guild_one);
			const player_two = this.find_or_create_player(log.player_two, guild_two);

			// players.push(player_one, player_two);
			players.add(player_one).add(player_two);
			const event = new Event(player_one, player_two, log.is_kill, dayjs(log.time, 'HH:mm:ss'));
			player_one.events.push(event);
			player_two.events.push(event);

			events.push(event);
		}

		const war = new War(guild_name, name, date, won, events);
		this.wars.push(war);

		for (const guild of guilds) {
			// create local guild that only contains information of the current war
			const local_guild = new Local_Guild(war, guild);
			guild.locals.push(local_guild);
			war.local_guilds.push(local_guild);

			// get all joined players and add them to the local guild
			for (const player of players) {
				if (player.guild == guild) {
					// create new local player
					const local_player = new Local_Guild_Player(local_guild, player);

					war.local_players.push(local_player);

					local_guild.local_players.push(local_player);
					player.locals.push(local_player);

					// extract all events that happened to the local player
					for (const event of events) {
						if (event.player_one == player || event.player_two == player) {
							local_player.local_events.push(event);
							local_guild.local_events.push(event);
						}
					}
				}
			}
		}

		// Prevents empty guilds (happens if guild name changes mid fight)
		war.local_guilds = war.local_guilds.filter((g) => g.local_players.length > 0);
		war.update();
		return war;
	}

	is_valid_war(date: string, name: string) {
		if (this.wars.find((war) => war.id == date + name)) {
			return false;
		}
		return true;
	}
}

export const Manager = storage('manager', new ManagerClass());
