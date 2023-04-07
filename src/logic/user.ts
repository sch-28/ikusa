import { browser } from '$app/environment';
import type { Writable } from 'svelte/store';
import { writable, get } from 'svelte/store';
import type { War, WarJSON, WarType } from './data';

const storage = <T extends { [key: string]: any }>(key: string, initValue: T): Writable<T> => {
	const store = writable(initValue);
	if (!browser) return store;
	const local_store_str = localStorage.getItem(key);

	if (local_store_str != null) {
		let value = JSON.parse(local_store_str);
		Object.keys(initValue).forEach((key) => {
			if (value[key] === undefined || value[key] === null) {
				value = { ...value, [key]: initValue[key] };
			}
		});
		store.set(value);
	}

	store.subscribe((val) => {
		if (val == null || val == undefined) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, JSON.stringify(val));
		}
	});

	window.addEventListener('storage', () => {
		const local_store_str = localStorage.getItem(key);

		if (local_store_str == null) return;

		let value: T = JSON.parse(local_store_str);

		if (value !== get(store)) {
			Object.keys(initValue).forEach((key) => {
				if (value[key] === undefined || value[key] === null) {
					value = { ...value, [key]: initValue[key] };
				}
			});
			store.set(value);
		}
	});

	return store;
};

export default storage;

export interface User {
	discord_data?: {
		id: string;
		username: string;
		discriminator: string;
	};
	name?: string;
	guild?: string;
	wars?: WarType[];
}

export const User = storage<User>('settings', {});
