import { writable } from 'svelte/store';
import type { Component } from '../modal/modal-store';

export type RowObject = {
	label: number | string | Component;
	color: string;
	value?: number | string;
};

export type RowElement = number | string | Component | RowObject;

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

type TableData = {
	table_id: string;
	sorts: HeaderColumn[];
	search?: string;
	scroll_y: number;
	columnSizes?: Record<string, number>;
}[];

export const TableSort = writable<TableData>([]);
