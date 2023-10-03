import { get, writable } from 'svelte/store';

export type Loader = {
	visible: boolean;
	text?: string;
	progress?: number;
	cancel?: () => void;
};

const CurrentLoader = writable<Loader>({ visible: false });

export abstract class LoaderManager {
	static set_status(text: string, progress?: number) {
		CurrentLoader.update((s) => ({ ...s, text, progress }));
	}

	static close() {
		CurrentLoader.set({ visible: false });
	}

	static open(cancel?: () => void) {
		CurrentLoader.update((s) => ({ ...s, visible: true, cancel }));
	}

	static get store() {
		return CurrentLoader;
	}
}
