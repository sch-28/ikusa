import { parse, stringify } from 'flatted';
import { LoaderManager } from '../components/loader/loader-store';
import {
	Log,
	War,
	Player,
	Guild,
	Local_Guild,
	Local_Guild_Player,
	Event,
	type WarType
} from './data';
import type { ManagerUpdated, UpdateManager, UpdateProgress } from './worker/manager-worker';
import LZString from 'lz-string';
import type { ManagerCompressed } from './worker/compress-worker';
import dayjs from 'dayjs';

function get_default_war() {
	return new War('Default', 'Default', 'Default', false, []);
}
function get_default_local_guild() {
	return new Local_Guild(get_default_war(), get_default_guild());
}
function get_default_local_player() {
	return new Local_Guild_Player(get_default_local_guild(), get_default_player());
}

function get_default_guild() {
	return new Guild('Default');
}

function get_default_player() {
	return new Player('Default', get_default_guild());
}
function get_default_event() {
	return new Event(get_default_player(), get_default_player(), false, '');
}

export class ManagerClass {
	wars: War[];
	players: Player[];
	guilds: Guild[];
	save_callback: (() => void) | undefined;
	manager_worker: Worker | undefined;
	compress_worker: Worker | undefined;

	constructor() {
		this.wars = [];
		this.players = [];
		this.guilds = [];
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

	get_war_by_id(id: string) {
		return this.wars.find((war) => war.unique_id == id);
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

	find_or_create_guild(name: string) {
		let guild = this.guilds.find((g) => g.name == name);

		if (!guild) {
			guild = new Guild(name);
			this.guilds.push(guild);
		}

		return guild;
	}

	find_or_create_player(name: string, guild: Guild) {
		let player = this.players.find((p) => p.name == name);

		if (!player) {
			player = new Player(name, guild);
			this.players.push(player);
			guild.players.push(player);
		} else {
			if (!player.guilds.includes(guild)) {
				player.guilds.push(guild);
				guild.players.push(player);
			}
		}

		return player;
	}

	static wars_from_json(wars: WarType[]) {
		const manager = new ManagerClass();
		if (wars.length == 0 || !wars.length) return manager;

		for (const [index, war] of wars.entries()) {
			war.logs = war.logs.map(
				(l) =>
					new Log(
						l.player_one as string,
						l.player_two as string,
						l.kill,
						l.guild,
						l.time as string,
						l.character_names
					)
			);
			manager.add_war({
				guild_name: war.guild_name,
				name: war.name,
				date: war.date,
				won: war.won,
				logs: war.logs,
				unique_id: war.unique_id
			});
			const message: UpdateProgress = {
				msg: 'update_progress',
				data: { progress: Math.floor(((index + 1) / wars.length) * 100) }
			};
			postMessage(message);
		}

		return manager;
	}

	static from_json(data: string | ManagerClass, decompress = true) {
		const manager_data = decompress
			? (parse(LZString.decompress(data as string) ?? '') as ManagerClass)
			: (data as ManagerClass);

		const manager = new ManagerClass();

		manager.wars = manager_data.wars.map((war) => {
			const new_war = Object.assign(get_default_war(), war);
			new_war.logs = war.logs.map((log) => Object.assign(get_default_event(), log));
			return new_war;
		});
		manager.players = manager_data.players.map((player) => {
			const new_player = Object.assign(get_default_player(), player);
			player.locals.map((local) => Object.assign(get_default_local_player(), local));

			return new_player;
		});
		manager.guilds = manager_data.guilds.map((guild) => {
			const new_guild = Object.assign(get_default_guild(), guild);
			guild.locals.map((local) => Object.assign(get_default_local_guild(), local));

			return new_guild;
		});

		manager.wars.forEach((war) =>
			war.logs.forEach((log) => {
				log.time = dayjs(log.time);
			})
		);

		manager.guilds.forEach((guild) => {
			guild.locals.forEach((local) => {
				local.local_events.forEach((event) => {
					event.time = dayjs(event.time);
				});
			});
		});

		return manager;
	}

	async get_json() {
		if (!this.compress_worker) return '';

		let resolve!: (compressed_string: string) => void;
		const promise = new Promise<string>((res) => (resolve = res));

		this.compress_worker.onmessage = ({ data }: MessageEvent<ManagerCompressed>) => {
			if (data.msg === 'manager_compressed') {
				resolve(data.data);
			}
		};

		this.compress_worker.postMessage({ msg: 'compress_manager', data: stringify(this) });
		return promise;
	}

	add_war({
		guild_name,
		name,
		date,
		won,
		logs,
		save = true,
		unique_id
	}: {
		guild_name: string;
		name: string;
		date: string;
		won: boolean;
		logs: Log[];
		save?: boolean;
		unique_id?: string;
	}) {
		if (this.wars.find((war) => war.id == date + name)) {
			return undefined;
		}

		const events: Event[] = [];
		const guilds = new Set<Guild>();
		const players: { player: Player; guild: Guild }[] = [];

		for (const log of logs) {
			const guild_one = this.find_or_create_guild(guild_name);
			const guild_two = this.find_or_create_guild(log.guild);

			guilds.add(guild_one).add(guild_two);

			const player_one = this.find_or_create_player(log.player_one, guild_one);
			const player_two = this.find_or_create_player(log.player_two, guild_two);

			if (!players.find((p) => p.player == player_one && p.guild == guild_one)) {
				players.push({ player: player_one, guild: guild_one });
			}
			if (!players.find((p) => p.player == player_two && p.guild == guild_two)) {
				players.push({ player: player_two, guild: guild_two });
			}

			const event = new Event(player_one, player_two, log.kill, log.time, log.character_names);
			player_one.events.push(event);
			player_two.events.push(event);

			events.push(event);
		}

		const war = new War(guild_name, name, date, won, events, unique_id);
		this.wars.push(war);

		for (const guild of guilds) {
			// create local guild that only contains information of the current war
			const local_guild = new Local_Guild(war, guild);
			guild.locals.push(local_guild);
			war.local_guilds.push(local_guild);

			// get all joined players and add them to the local guild
			for (const player_set of players) {
				const { player, guild: player_guild } = player_set;
				if (player_guild.name === guild.name) {
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
							if (event.player_one == player) {
								event.local_player_one = local_player;
							} else {
								event.local_player_two = local_player;
								event.guild = local_player.local_guild.guild.name;
							}
							event.message = event.get_message();
						}
					}
				}
			}

			local_guild.local_events.sort((a, b) => (a.time <= b.time ? -1 : 1));
		}

		// Prevents empty guilds (happens if guild name changes mid fight)
		war.local_guilds = war.local_guilds.filter((g) => g.local_players.length > 0);
		war.update();
		save && this.save_callback?.();
		return war;
	}

	async add_wars(new_wars: WarType[]) {
		return await this.update_data([...this.wars, ...new_wars]);
	}

	reset() {
		this.wars = [];
		this.players = [];
		this.guilds = [];
	}

	async update_war(
		war: War,
		{
			name,
			date,
			logs,
			won,
			guild_name
		}: { name: string; date: string; logs: Log[]; won: boolean; guild_name: string }
	) {
		if (war.id != date + name) {
			if (!this.is_valid_war(date, name)) {
				return undefined;
			}
		}

		const wars = this.wars.filter((w) => w != war);

		await this.update_data([
			...wars,
			{ guild_name, name, date, won, logs, unique_id: war.unique_id }
		]);

		return this.wars.find((w) => w.id == date + name);
	}

	async update_war_info(
		id: string,
		{
			name,
			date,
			won,
			guild_name,
			unique_id
		}: { name?: string; date?: string; won?: boolean; guild_name?: string; unique_id?: string }
	) {
		const war = this.get_war(id);
		if (!war) return;

		war.name = name ?? war.name;
		war.date = date ?? war.date;
		war.won = won ?? war.won;
		war.guild_name = guild_name ?? war.guild_name;
		war.unique_id = unique_id ?? war.unique_id;

		this.save_callback?.();
	}

	async delete_war(war: War) {
		const wars = this.wars.filter((w) => w != war);
		await this.update_data(wars);
		await this.delete_public_war(war);
	}

	async delete_public_war(war: War) {
		const local_war = this.wars.find((w) => w.unique_id == war.unique_id);
		const result = await fetch('/api/delete', {
			method: 'DELETE',
			body: JSON.stringify({ id: war.unique_id })
		});
		if (local_war) {
			local_war.unique_id = '';
			this.update_war_info(local_war.id, { unique_id: '' });
		}
		return result;
	}

	async update_data(wars: WarType[]) {
		if (!this.manager_worker) return;
		this.reset();

		const war_class_mapping: {
			war_id: string;
			locals: { name: string; char_name?: string; class_name?: string }[];
		}[] = [];
		const wars_json = wars.map((w) => {
			if (typeof (w as War).to_json === 'function') {
				const war_object = w as War;
				const locals: { name: string; char_name?: string; class_name?: string }[] = [];

				war_object.local_players.forEach((local_player) => {
					locals.push({
						name: local_player.player.name,
						char_name: local_player.character_name,
						class_name: local_player.character_class
					});
				});

				war_class_mapping.push({ war_id: war_object.id, locals: locals });

				return war_object.to_json();
			} else {
				return w;
			}
		});

		LoaderManager.set_status('Updating data...', 0);
		LoaderManager.open();

		const message: UpdateManager = {
			msg: 'update_manager',
			data: {
				wars: wars_json
			}
		};
		let resolve!: (manager: ManagerClass | undefined) => void;
		const promise = new Promise<ManagerClass | undefined>((res) => (resolve = res));

		this.manager_worker.onmessage = ({ data }: MessageEvent<ManagerUpdated | UpdateProgress>) => {
			if (data.msg === 'manager_updated') {
				resolve(parse(data.data?.manager));
			} else if (data.msg === 'update_progress') {
				LoaderManager.set_status('Updating data...', data.data?.progress);
			}
		};

		this.manager_worker.postMessage(message);
		const new_manager = await promise;

		if (!new_manager) return;
		const parsed_new_manager = ManagerClass.from_json(new_manager, false);

		this.wars = parsed_new_manager.wars;
		this.players = parsed_new_manager.players;
		this.guilds = parsed_new_manager.guilds;

		this.wars.forEach((war) => {
			const war_class_mapping_object = war_class_mapping.find((w) => w.war_id == war.id);
			if (war_class_mapping_object) {
				war_class_mapping_object.locals.forEach((local) => {
					const local_player = war.local_players.find((p) => p.player.name == local.name);
					if (local_player) {
						local_player.character_name = local.char_name;
						local_player.character_class = local.class_name;
					}
				});
			}
		});
		this.save_callback?.();
		LoaderManager.close();
		return this.wars;
	}

	is_valid_war(date: string, name: string) {
		if (this.wars.find((war) => war.id == date + name)) {
			return false;
		}
		return true;
	}
}
