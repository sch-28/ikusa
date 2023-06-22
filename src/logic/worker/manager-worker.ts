import { stringify } from 'flatted';
import type { WarType } from '../data';
import { ManagerClass } from '../manager';

export interface UpdateManager extends PostMessage<{ wars: WarType[] }> {
	data: { wars: WarType[] };
	msg: 'update_manager';
}

export interface ManagerUpdated extends PostMessage<{ manager: string }> {
	data: { manager: string };
	msg: 'manager_updated';
}

export interface UpdateProgress extends PostMessage<{ progress: number }> {
	data: { progress: number };
	msg: 'update_progress';
}

export interface PostMessage<T> {
	msg: 'update_manager' | 'manager_updated' | 'update_progress';
	data: T;
}
onmessage = ({ data }: MessageEvent<UpdateManager>) => {
	if (data.msg === 'update_manager' && data.data) {
		const new_manager = ManagerClass.wars_from_json(data.data.wars);
		const message: ManagerUpdated = {
			msg: 'manager_updated',
			data: { manager: stringify(new_manager) }
		};
		postMessage(message);
	}
};

export {};
