export type Row = {
	columns: string[];
	onclick?: () => void;
};

export type HeaderColumn = {
        label: string;  
        width?: number; 
}