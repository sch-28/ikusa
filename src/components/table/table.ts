import { writable } from 'svelte/store';

export type Row = {
	columns: (number | string)[];
	onclick?: () => void;
};

export type HeaderColumn<T> = {
	label: string;
	width?: number;
	sort?: (a: T, b: T) => number;
	sortable?: boolean;
	sort_dir?: 'asc' | 'des';
};

type TableData = {
	table_id: string;
	sorts: HeaderColumn<any>[];
	search?: string;
	scroll_y: number;
}[];

export const TableSort = writable<TableData>([]);
