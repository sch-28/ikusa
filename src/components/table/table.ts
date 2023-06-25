import { get, writable, type Writable } from 'svelte/store';
import type { Component } from '../modal/modal-store';
import { browser } from '$app/environment';

export type RowObject = {
	label: number | string | Component;
	color?: string;
	value?: number | string;
	isIcon?: boolean;
};

export type RowElement = number | string | Component | RowObject | undefined;

export type Row = {
	columns: RowElement[];
	onclick?: () => void;
};

export type HeaderColumn = {
	label: string;
	width?: number;
	min_width?: number;
	sort?: (a: RowElement, b: RowElement) => number;
	sortable?: boolean;
	sort_dir?: 'asc' | 'des';
	title?: string;
};

export type TableData = {
	table_id: string;
	sorts: HeaderColumn[];
	search?: string;
	scroll_y: number;
	columnSizes?: Record<string, number>;
}[];

const storage = (key: string, initValue: TableData): Writable<TableData> => {
	const store = writable(initValue);

	if (!browser || typeof window === 'undefined') return store;

	const storedValueStr = localStorage.getItem(key);
	if (storedValueStr != null) {
		store.set(JSON.parse(storedValueStr));
	}
	store.subscribe((val) => {
		if (val == null || val == undefined) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, JSON.stringify(val));
		}
	});

	return store;
};

export default storage;

export const TableSort: Writable<TableData> = storage('table-data', []);
