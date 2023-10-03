import type { WarType } from '../../../logic/data';

export type SharedWar = WarType & {
	class_mapping: { name: string; char_name?: string; class_name?: string }[];
};
