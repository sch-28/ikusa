export type Row = {
	columns: (number | string)[];
	onclick?: () => void;
};

export type HeaderColumn<T> = {
	label: string;
	width?: number;
	sort?: (a: T, b: T) => number;
	sortable?: boolean;
	sort_dir?: 'asc' | 'desc';
};
