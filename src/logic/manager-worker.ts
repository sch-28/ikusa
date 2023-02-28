import { stringify } from 'flatted';
import { ManagerClass, type War_JSON } from './manager';
/* 
import { ManagerClass, stringify, type War_JSON } from "./test"; */

export interface UpdateManager extends PostMessage<{ wars: War_JSON[] }> {
	data: { wars: War_JSON[] };
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
		const new_manager = ManagerClass.from_json(data.data.wars, false);
		const message: ManagerUpdated = {
			msg: 'manager_updated',
			data: { manager: stringify(new_manager) }
		};
		postMessage(message);
	}
};

export {}