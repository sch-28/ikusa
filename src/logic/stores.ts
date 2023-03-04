import { browser } from '$app/environment';
import { get, writable, type Writable } from 'svelte/store';
import { ManagerClass } from './manager';

const storage = (key: string, initValue: ManagerClass): Writable<ManagerClass> => {
	const store = writable(initValue);

	if (!browser || typeof window === 'undefined') return store;

	const storedValueStr = localStorage.getItem(key);
	if (storedValueStr != null) {
		store.set(ManagerClass.from_json(storedValueStr));
	}
	/* store.subscribe((val) => {
		if (val == null || val == undefined) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, val.get_json());
			console.log('saved');
		}
	}); */

	get(store).save_callback = () => {
		if (store) {
			store.set(get(store));
			localStorage.setItem(key, get(store).get_json());
		}
	};

	// TODO fix this
	/* window.addEventListener('storage', () => {
		const storedValueStr = localStorage.getItem(key);

		if (storedValueStr == null) return;

		const localValue = ManagerClass.from_json(JSON.parse(storedValueStr));

		// might need to implemenet compare function
		if (localValue !== get(store)) store.set(localValue);
	}); */

	return store;
};

/* export async function load_store(store: Writable<ManagerClass>, key: string) {
	get(store).save_callback = () => {
		store && store.set(get(store));
	};

	const storedValueStr = localStorage.getItem(key);
	if (storedValueStr != null) {
		const parsed = JSON.parse(storedValueStr);
		await get(store).update_data(parsed);
	}
	store.subscribe((val) => {
		if (val == null || val == undefined) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, val.get_json());
		}
	});
} */

export default storage;

export const Manager: Writable<ManagerClass> = storage('manager', new ManagerClass());
