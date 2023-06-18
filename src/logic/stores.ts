import { browser } from '$app/environment';
import { get, writable, type Writable } from 'svelte/store';
import { ManagerClass } from './manager';
import { show_toast } from './util';

const storage = (key: string, initValue: ManagerClass): Writable<ManagerClass> => {
	const store = writable(initValue);

	if (!browser || typeof window === 'undefined') return store;

	const storedValueStr = localStorage.getItem(key);
	if (storedValueStr != null) {
		store.set(ManagerClass.from_json(storedValueStr));
	}

	get(store).save_callback = () => {
		if (store) {
			store.set(get(store));
			try {
				localStorage.setItem(key, get(store).get_json());
			} catch (e) {
				console.error(e);
				show_toast('Not enough storage', 'error');
			}
		}
	};

	return store;
};

export default storage;

export const Manager: Writable<ManagerClass> = storage('manager', new ManagerClass());
