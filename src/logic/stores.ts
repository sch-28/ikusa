import { browser } from '$app/environment';
import { get, writable, type Writable } from 'svelte/store';
import { ManagerClass } from './manager';
import { db } from './indexDB';

async function setSaveCallback(store: Writable<ManagerClass>) {
	const storeData = get(store);
	storeData.save_callback = async () => {
		store.set(get(store));
		if (db.manager) await db.manager.clear();
		storeData.get_json().then((data) => db.manager.add({ id: 0, data }));
	};
}

const storage = (key: string, initValue: ManagerClass): Writable<ManagerClass> => {
	const store = writable(initValue);
	if (!browser || typeof window === 'undefined') return store;
	const dbManagerPromise = db.manager.where('id').equals(0).first();
	dbManagerPromise.then((manager) => {
		if (manager) {
			store.set(ManagerClass.from_json(manager.data));
			setSaveCallback(store);
		} else {
			const legacyStorage = localStorage.getItem(key);
			if (legacyStorage !== null) {
				store.set(ManagerClass.from_json(legacyStorage));
				/* localStorage.removeItem(key); */ //TODO add this line if everything works
			}
			setSaveCallback(store);
			get(store).save_callback?.();
		}
	});

	return store;
};

export default storage;

export const Manager: Writable<ManagerClass> = storage('manager', new ManagerClass());
