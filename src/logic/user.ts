import { browser } from '$app/environment';
import type { Writable } from 'svelte/store';
import { writable, get } from 'svelte/store';
import type { WarType } from './data';
import { debounce } from './util';

const debounce_update = debounce((value) => {
	fetch('/api/user', {
		method: 'POST',
		body: JSON.stringify(value)
	});
}, 500);

const storage = (key: string, initValue: User): Writable<User> => {
	const store = writable(initValue);
	if (!browser) return store;
	const local_store_str = localStorage.getItem(key);

	if (local_store_str != null) {
		let value = JSON.parse(local_store_str);
		Object.keys(initValue).forEach((key) => {
			if (value[key] === undefined || value[key] === null) {
				value = { ...value, [key]: initValue[key as keyof User] };
			}
		});
		store.set(value);
	}

	store.subscribe((val) => {
		if (val == null || val == undefined) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, JSON.stringify(val));
			const current_user = get(store);
			if (current_user) val.discord_data && debounce_update(val);
		}
	});

	window.addEventListener('storage', () => {
		const local_store_str = localStorage.getItem(key);

		if (local_store_str == null) return;

		let value: User = JSON.parse(local_store_str);

		if (value !== get(store)) {
			Object.keys(initValue).forEach((key) => {
				if (value[key as keyof User] === undefined || value[key as keyof User] === null) {
					value = { ...value, [key]: initValue[key as keyof User] };
				}
			});
			store.set(value);
		}
	});

	return store;
};

export interface User {
	discord_data?: {
		id: string;
		username: string;
		discriminator: string;
	};
	name?: string;
	guild?: string;
	wars?: WarType[];
	bdo_sync: boolean;
	liked_suggestions?: string[];
	region?: string;
}

export const User = storage('settings', { bdo_sync: true });
