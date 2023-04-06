import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import generateUniqueId from 'generate-unique-id';
dayjs.extend(customParseFormat);

export class Guild {
	locals: Local_Guild[] = [];
	name: string;
	players: Player[] = [];
	current_players: Player[] = [];

	average_kill_difference = 0;
	kills = 0;
	deaths = 0;

	average_kills = 0;
	average_deaths = 0;
	average_members = 0;

	constructor(name: string) {
		this.name = name;
	}

	update() {
		this.kills = this.get_kills();
		this.deaths = this.get_deaths();
		this.average_kills = this.get_average_kills();
		this.average_deaths = this.get_average_deaths();
		this.average_kill_difference = this.get_average_kill_difference();
		this.average_members = this.get_average_members();

		this.current_players = this.players.filter(
			(player) => player.guilds[player.guilds.length - 1].name == this.name
		);
	}

	get_kills() {
		return this.locals.reduce((sum, g) => sum + g.kills, 0);
	}

	get_deaths() {
		return this.locals.reduce((sum, g) => sum + g.deaths, 0);
	}

	get_average_kill_difference() {
		return this.locals.reduce((sum, g) => sum + g.kill_difference, 0);
	}

	get_average_kills() {
		if (this.locals.length == 0) return 0;
		return this.locals.reduce((sum, g) => sum + g.average_kills, 0) / this.locals.length;
	}

	get_average_deaths() {
		if (this.locals.length == 0) return 0;
		return this.locals.reduce((sum, g) => sum + g.average_deaths, 0) / this.locals.length;
	}

	get_average_members() {
		if (this.locals.length == 0) return 0;
		return this.locals.reduce((sum, g) => sum + g.local_players.length, 0) / this.locals.length;
	}

	get sorted_player() {
		return [...this.players].sort((a, b) => b.average_performance - a.average_performance);
	}
}

interface IWar {
	local_guilds: Local_Guild[];
	local_players: Local_Guild_Player[];
	date: string;
	guild_name: string;
	name: string;
	logs: Event[];
	won: boolean;
	formatted_date: string;
	enemy_guilds: Local_Guild[];
	kill_events: Event[];
	death_events: Event[];
	sorted_guilds: Local_Guild[];
	id: string;
	duration: number;

	update(): void;
	get_duration(): number;
	to_json(): WarType;

	unique_id: string;
}

export class War implements IWar {
	local_guilds: Local_Guild[] = [];
	local_players: Local_Guild_Player[] = [];
	date: string;
	guild_name: string;
	name: string;
	logs: Event[];
	won: boolean;

	formatted_date: string;
	enemy_guilds: Local_Guild[] = [];
	kill_events: Event[] = [];
	death_events: Event[] = [];
	sorted_guilds: Local_Guild[] = [];
	id: string;
	duration = 0;

	unique_id: string;

	constructor(guild_name: string, name: string, date: string, won: boolean, logs: Event[]) {
		this.date = date;
		this.name = name;
		this.guild_name = guild_name;
		this.logs = logs;
		this.won = won;
		this.formatted_date = new Date(this.date).toLocaleDateString();
		this.id = this.date + this.name;

		this.unique_id = generateUniqueId();
	}

	update() {
		this.local_guilds.forEach((g) => g.update());
		this.local_players.forEach((p) => p.update());
		this.local_guilds.forEach((g) => g.update());

		this.formatted_date = new Date(this.date).toLocaleDateString();
		this.enemy_guilds = this.local_guilds.filter((g) => g.guild.name != this.guild_name);
		this.kill_events = this.logs.filter((l) => l.kill);
		this.death_events = this.logs.filter((l) => !l.kill);
		this.sorted_guilds = [...this.local_guilds].sort(
			(a, b) => b.kills - b.deaths - (a.kills - a.deaths)
		);
		this.id = this.date + this.name;
		this.duration = this.get_duration();
	}

	get_duration() {
		const logs = [...this.kill_events, ...this.death_events];
		if (logs.length < 2) return 0;

		logs.sort((a, b) => (b.time <= a.time ? 1 : -1));
		const start = logs[0].time;
		const end = logs[logs.length - 1].time;
		return end.diff(start, 'minutes');
	}

	to_json(): WarType {
		return {
			guild_name: this.guild_name,
			name: this.name,
			date: this.date,
			won: this.won,
			unique_id: this.unique_id,
			logs: this.logs.map(
				(e) =>
					new Log(
						e.player_one.name,
						e.player_two.name,
						e.kill,
						e.local_player_two.local_guild.guild.name,
						e.time_string
					)
			)
		};
	}
}

type WarObject = {
	id: string;
} & IWar;

export type WarJSON = {
	id?: never;
	date: string;
	guild_name: string;
	name: string;
	won: boolean;
	logs: Log[];
	unique_id: string;
};

export type WarType = WarObject | WarJSON;

export class Player {
	locals: Local_Guild_Player[] = [];
	name: string;
	guilds: Guild[] = [];
	events: Event[] = [];

	kills = 0;
	deaths = 0;

	average_kills = 0;
	average_deaths = 0;

	average_performance = 0;

	average_duration_percentage = 0;
	participation_percentage = 0;

	kill_events: Event[] = [];
	death_events: Event[] = [];

	constructor(name: string, guild: Guild) {
		this.guilds = [guild];
		this.name = name;
	}

	update() {
		this.kills = this.get_total_kills();
		this.deaths = this.get_total_deaths();

		this.average_kills = this.get_average_kills();
		this.average_deaths = this.get_average_deaths();

		this.average_performance = this.get_average_performance();

		this.average_duration_percentage = this.get_average_duration_percentage();
		this.participation_percentage = this.get_participation_percentage();
	}

	get_total_kills() {
		return this.locals.reduce((sum, local) => sum + local.kills, 0);
	}
	get_total_deaths() {
		return this.locals.reduce((sum, local) => sum + local.deaths, 0);
	}

	get_average_kills() {
		if (this.locals.length == 0) return 0;
		return this.get_total_kills() / this.locals.length;
	}
	get_average_deaths() {
		if (this.locals.length == 0) return 0;
		return this.get_total_deaths() / this.locals.length;
	}

	get_average_performance() {
		if (this.locals.length == 0) return 0;
		const total = this.locals.reduce((sum, local) => sum + local.performance, 0);

		return total / this.locals.length;
	}

	get_average_duration_percentage() {
		if (this.locals.length == 0) return 0;
		const total = this.locals.reduce((sum, local) => sum + local.duration_percentage, 0);

		return total / this.locals.length;
	}

	get_participation() {
		return this.locals.length;
	}

	get_participation_percentage() {
		const guild_total = this.guilds.reduce((sum, g) => sum + g.locals.length, 0);
		if (guild_total === 0) return 0;

		return this.get_participation() / guild_total;
	}
}

export class Local_Guild {
	guild: Guild;
	war: War;
	local_players: Local_Guild_Player[] = [];
	sorted_local_players: Local_Guild_Player[] = [];
	local_events: Event[] = [];

	kills = 0;
	deaths = 0;

	kill_difference = 0;

	average_kills = 0;
	average_deaths = 0;
	average_performance = 0;
	kd = 0;

	duration = 0;

	kill_events: Event[] = [];
	death_events: Event[] = [];

	constructor(war: War, guild: Guild) {
		this.war = war;
		this.guild = guild;
	}

	update() {
		this.kill_events = this.get_kill_events();
		this.death_events = this.get_death_events();

		this.kills = this.kill_events.length;
		this.deaths = this.death_events.length;

		this.kill_difference = this.kills - this.deaths;

		this.average_kills = this.get_average_kills();
		this.average_deaths = this.get_average_deaths();
		this.kd = this.get_kd();

		this.duration = this.get_duration();

		this.sorted_local_players = this.get_sorted_players();
		this.guild.update();
	}

	get_kill_events() {
		return this.local_events.filter((l) => l.normalized_kill(this.guild));
	}

	get_death_events() {
		return this.local_events.filter((l) => !l.normalized_kill(this.guild));
	}

	get_kd() {
		if (this.deaths == 0) {
			return this.kills;
		}

		return this.kills / this.deaths;
	}

	get_average_kills() {
		if (this.local_players.length == 0) return 0;
		return this.kills / this.local_players.length;
	}

	get_average_deaths() {
		if (this.local_players.length == 0) return 0;
		return this.deaths / this.local_players.length;
	}

	get_sorted_players() {
		return [...this.local_players].sort((a, b) => b.kills - a.kills);
	}

	get_duration() {
		const logs = [...this.kill_events, ...this.death_events];
		if (logs.length < 2) return 0;

		logs.sort((a, b) => (b.time <= a.time ? 1 : -1));

		const start = logs[0].time;
		const end = logs[logs.length - 1].time;
		return end.diff(start, 'minutes');
	}
}

export class Local_Guild_Player {
	player: Player;
	local_guild: Local_Guild;
	local_events: Event[] = [];

	kills = 0;
	deaths = 0;

	kd = 0;
	performance = 0;

	duration = 0;
	duration_percentage = 0;

	kill_events: Event[] = [];
	death_events: Event[] = [];

	constructor(local_guild: Local_Guild, player: Player) {
		this.local_guild = local_guild;
		this.player = player;
	}

	update() {
		this.kill_events = this.get_kill_events();
		this.death_events = this.get_death_events();

		this.kills = this.kill_events.length;
		this.deaths = this.death_events.length;

		this.kd = this.get_kd();
		this.performance = this.get_performance();

		this.duration = this.get_join_duration();
		this.duration_percentage = this.get_join_duration_percentage();

		this.player.update();
	}

	get_kill_events() {
		return this.local_events.filter((l) => l.normalized_kill(this.local_guild.guild));
	}

	get_death_events() {
		return this.local_events.filter((l) => !l.normalized_kill(this.local_guild.guild));
	}

	get_kd() {
		if (this.deaths == 0) {
			return this.kills;
		}

		return this.kills / this.deaths;
	}

	get_performance() {
		if (this.local_guild.average_kills == 0) return this.kills;
		return this.kills / this.local_guild.average_kills;
	}

	get_join_duration() {
		const logs = [...this.kill_events, ...this.death_events];
		if (logs.length < 2) return 0;

		logs.sort((a, b) => (b.time <= a.time ? 1 : -1));

		const start = logs[0].time;
		const end = logs[logs.length - 1].time;
		return end.diff(start, 'minutes');
	}

	get_join_duration_percentage() {
		if (this.get_join_duration() == 0) return 0;

		return this.duration / this.local_guild.duration;
	}
}
export class Event {
	player_one: Player;
	local_player_one!: Local_Guild_Player;
	player_two: Player;
	local_player_two!: Local_Guild_Player;
	kill: boolean;
	time: Dayjs;
	time_string: string;
	guild: string;

	constructor(p1: Player, p2: Player, kill: boolean, time_string: string) {
		this.player_one = p1;
		this.player_two = p2;
		this.kill = kill;
		this.time_string = time_string;
		this.time = dayjs(time_string, 'HH:mm:ss');
		this.guild = '';
	}

	normalized_kill(guild: Guild) {
		if (guild == this.local_player_one.local_guild.guild) {
			return this.kill;
		}
		return !this.kill;
	}
}

export class Log {
	player_one: string;
	player_two: string;
	kill: boolean;
	guild: string;
	time: string;

	constructor(p1: string, p2: string, kill: boolean, guild: string, time: string) {
		this.player_one = p1;
		this.player_two = p2;
		this.kill = kill;
		this.guild = guild;
		if (this.guild == '-1') {
			this.guild = 'No Guild';
		}
		this.time = time;
	}

	static parse_log(log: string) {
		const regex = /\[(.*)\] (\w*) (died to|has killed) (\w*) from (\w*)/;
		const results = log.match(regex);
		if (results && results.length == 6) {
			const kill = results[3] == 'has killed';
			return new Log(results[2], results[4], kill, results[5], results[1]);
		}

		throw new Error(`Invalid Log: ${log}`);
	}

	static parse_logs(events: Event[]) {
		return events.map(
			(l) =>
				new Log(
					l.player_one.name,
					l.player_two.name,
					l.kill,
					l.local_player_two.local_guild.guild.name,
					l.time_string
				)
		);
	}
}
