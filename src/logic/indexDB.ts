import Dexie, { type Table } from 'dexie';

export class DexieManager extends Dexie {
	manager!: Table<{ id: number; data: string }>;

	constructor() {
		super('managerDB');
		this.version(1).stores({
			manager: 'id'
		});
	}
}

export const db = new DexieManager();
